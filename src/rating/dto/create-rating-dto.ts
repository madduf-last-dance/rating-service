import { IsEnum, IsInt, IsNotEmpty, Min, Max } from "class-validator";
import { RatingType } from "../entities/rating-type.enum";

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  ratedEntityId: number; // Could be accommodationId or hostId

  @IsEnum(RatingType)
  @IsNotEmpty()
  ratingType: RatingType;
}
