import {
  Controller,
  NotFoundException,
} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { RatingType } from "./entities/rating-type.enum";
import { CreateRatingDto } from "./dto/create-rating-dto";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("ratings")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @MessagePattern("createRating")
  async create(@Payload() createRatingDto: CreateRatingDto) {
    return await this.ratingService.createRating(createRatingDto);
  }

  @MessagePattern("findAllRatings")
  async findAll() {
    return await this.ratingService.getAllRatings();
  }

  @MessagePattern("findRatingById")
  async findOne(@Payload() id: number) {
    const rating = await this.ratingService.getRatingById(id);
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  @MessagePattern("findRatingsByType")
  async findRatingsByType(@Payload() data: { entityId: number; type: RatingType }) {
    const { entityId, type } = data;
    return await this.ratingService.getRatingsByType(entityId, type);
  }

  @MessagePattern("removeRating")
  async remove(@Payload() id: number) {
    return await this.ratingService.removeRating(id);
  }

  @MessagePattern("getAverageRating")
  async getAverageRating(@Payload() data: { entityId: number; type: RatingType }) {
    const { entityId, type } = data;
    return await this.ratingService.getAverageRating(entityId, type);
  }

}