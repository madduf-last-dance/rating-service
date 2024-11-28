import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { Rating } from "./entities/rating.entity";

@Injectable()
export class RatingService {
  constructor(
    @Inject("RESERVATION_SERVICE") private readonly reservationClient:
      ClientProxy,
    @Inject("ACCOMMODATION_SERVICE") private readonly accommodationClient:
      ClientProxy,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}
}
