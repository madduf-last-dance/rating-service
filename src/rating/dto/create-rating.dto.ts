import { IsEnum, IsInt, Min, Max } from "class-validator";
import { RatingType } from "../entities/rating-type.enum";

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  usedId: number; // guest id

  @IsInt()
  ratingId: number; // host id or accommodation id

  @IsEnum(RatingType)
  ratingType: RatingType;
}
