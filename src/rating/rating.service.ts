import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy, Payload, RpcException } from "@nestjs/microservices";
import { Rating } from "./entities/rating.entity";
import { RatingType } from "./entities/rating-type.enum";
import { CreateRatingDto } from "./dto/create-rating-dto";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class RatingService {
  constructor(
    @Inject("RESERVATION_SERVICE") private readonly reservationClient:
      ClientProxy,
    @Inject("ACCOMMODATION_SERVICE") private readonly accommodationClient:
      ClientProxy,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}


  async createRating(createRatingDto: CreateRatingDto) {
    const newRating = this.ratingRepository.create(createRatingDto);
    return await this.ratingRepository.save(newRating);
  }

  async getAllRatings() {
    return await this.ratingRepository.find();
  }

  async getRatingById(id: number) {
    const rating = await this.ratingRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async getRatingsByType(entityId: number, type: RatingType) {
    const ratings = await this.ratingRepository.find({
      where: { ratedEntityId: entityId, ratingType: type },
    });
    if (ratings.length === 0) {
      throw new NotFoundException(
        `No ratings found for entity ID: ${entityId} and type: ${type}`
      );
    }
    return ratings;
  }

  async removeRating(id: number) {
    const result = await this.ratingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return { message: `Rating with ID ${id} successfully removed` };
  }

  async getAverageRating(entityId: number, type: RatingType) {
    const ratings = await this.ratingRepository.find({
      where: { ratedEntityId: entityId, ratingType: type },
    });
    if (ratings.length === 0) {
      throw new NotFoundException(
        `No ratings found for entity ID: ${entityId} and type: ${type}`
      );
    }
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return { averageRating: total / ratings.length };
  }
}
