// src/rating/ratings.controller.ts
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RatingService } from "./rating.service";
import { RatingType } from "./entities/rating-type.enum";

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // create: payload = { rating: number, usedId: number, ratingId: number, ratingType: RatingType }
  @MessagePattern("createRating")
  async create(@Payload() payload: {
    rating: number;
    usedId: number;
    ratingId: number;
    ratingType: RatingType;
  }) {
    return this.ratingService.create(payload);
  }

  // update: payload = { id: number, usedId: number, rating: number }
  @MessagePattern("updateRating")
  async update(@Payload() payload: { id: number; usedId: number; rating: number }) {
    return this.ratingService.update(payload.id, payload.usedId, payload.rating);
  }

  // delete: payload = { id: number, usedId: number }
  @MessagePattern("deleteRating")
  async remove(@Payload() payload: { id: number; usedId: number }) {
    return this.ratingService.delete(payload.id, payload.usedId);
  }

  // get one: payload = id (number)
  @MessagePattern("getRating")
  async getOne(@Payload() id: number) {
    return this.ratingService.getOne(id);
  }

  // get all for target: payload = { ratingType: RatingType, ratingId: number }
  // returns { ratings: Rating[], average: number | null }
  @MessagePattern("getRatingsForTarget")
  async getAllForTarget(@Payload() payload: { ratingType: RatingType; ratingId: number }) {
    return this.ratingService.getAllForTarget(payload.ratingType, payload.ratingId);
  }
}
