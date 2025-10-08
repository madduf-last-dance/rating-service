import { IsEnum, IsInt, IsOptional, Min, Max } from "class-validator";
import { RatingType } from "../entities/rating-type.enum";

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsEnum(RatingType)
  ratingType?: RatingType;
}
