import { Controller, NotFoundException } from "@nestjs/common";
import { RatingService } from "./rating.service";

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
}
