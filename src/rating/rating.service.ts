// src/rating/rating.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { Rating } from "./entities/rating.entity";
import { RatingType } from "./entities/rating-type.enum";

type CreatePayload = {
  rating: number;
  usedId: number;    // guest who rates
  ratingId: number;  // host id or accommodation id
  ratingType: RatingType;
};

@Injectable()
export class RatingService {
  constructor(
    @Inject("RESERVATION_SERVICE") private readonly reservationClient: ClientProxy,
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
  ) {}

  // ---------- CREATE ----------
  // Creates a new rating. Fails if a rating by same guest for same target & type already exists.
  async create(payload: CreatePayload): Promise<Rating> {
    const { rating, usedId, ratingId, ratingType } = payload;

    // validate score
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new RpcException({ statusCode: 400, message: "rating must be integer 1..5" });
    }

    // eligibility check (reservation service)
    try {
      if (ratingType === RatingType.HOST) {
        // reservation service should return boolean
        const ok = await firstValueFrom(
          this.reservationClient.send<boolean>(
            "canRateHost",
            { guestId: usedId, hostId: ratingId }
          )
        );
        if (!ok) throw new RpcException({ statusCode: 403, message: "guest not eligible to rate this host" });
      } else {
        // ACCOMMODATION
        const ok = await firstValueFrom(
          this.reservationClient.send<boolean>(
            "canRateAccommodation",
            { guestId: usedId, accommodationId: ratingId }
          )
        );
        if (!ok) throw new RpcException({ statusCode: 403, message: "guest not eligible to rate this accommodation" });
      }
    } catch (err) {
      // if reservation service returns error or times out
      if (err instanceof RpcException) throw err;
      throw new RpcException({ statusCode: 502, message: `reservation service error: ${err?.message || err}` });
    }

    // ensure guest hasn't already rated this target (use-case: create only)
    const existing = await this.ratingRepository.findOne({
      where: { usedId, ratingId, ratingType },
    });
    if (existing) {
      throw new RpcException({ statusCode: 409, message: "rating already exists; use update instead" });
    }

    const entity = this.ratingRepository.create({ rating, usedId, ratingId, ratingType });
    return this.ratingRepository.save(entity);
  }

  // ---------- UPDATE ----------
  // Update rating by id. Ensures the guest is the owner.
  async update(id: number, usedId: number, newScore: number): Promise<Rating> {
    if (!Number.isInteger(newScore) || newScore < 1 || newScore > 5) {
      throw new RpcException({ statusCode: 400, message: "rating must be integer 1..5" });
    }

    const r = await this.ratingRepository.findOne({ where: { id } });
    if (!r) throw new RpcException({ statusCode: 404, message: "rating not found" });
    if (r.usedId !== usedId) throw new RpcException({ statusCode: 403, message: "not owner of rating" });

    r.rating = newScore;
    return this.ratingRepository.save(r);
  }

  // ---------- DELETE ----------
  // Delete rating by id (only owner can delete). You can change to soft-delete if you add removedAt.
  async delete(id: number, usedId: number): Promise<{ success: true }> {
    const r = await this.ratingRepository.findOne({ where: { id } });
    if (!r) throw new RpcException({ statusCode: 404, message: "rating not found" });
    if (r.usedId !== usedId) throw new RpcException({ statusCode: 403, message: "not owner of rating" });

    await this.ratingRepository.remove(r);
    return { success: true };
  }

  // ---------- GET ONE ----------
  async getOne(id: number): Promise<Rating> {
    const r = await this.ratingRepository.findOne({ where: { id } });
    if (!r) throw new RpcException({ statusCode: 404, message: "rating not found" });
    return r;
  }

  // ---------- GET ALL FOR TARGET ----------
  // returns { ratings: Rating[], average: number | null }
  async getAllForTarget(ratingType: RatingType, ratingId: number): Promise<{ ratings: Rating[]; average: number | null }> {
    const ratings = await this.ratingRepository.find({
      where: { ratingType, ratingId },
      order: { id: "DESC" },
    });

    if (!ratings.length) return { ratings: [], average: null };

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return { ratings, average: sum / ratings.length };
  }
}
