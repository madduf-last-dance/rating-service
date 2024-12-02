import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rating } from "src/rating/entities/rating.entity";
import { RatingType } from "src/rating/entities/rating-type.enum";

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
  ) {}

  async seed() {
    const reviews = [

      // Reviews for accommodation ID 1
      { rating: 5, userId: 101, ratedEntityId: 1, ratingType: RatingType.ACCOMMODATION },
      { rating: 4, userId: 102, ratedEntityId: 1, ratingType: RatingType.ACCOMMODATION },
      { rating: 3, userId: 103, ratedEntityId: 1, ratingType: RatingType.ACCOMMODATION },
  
      // Reviews for accommodation ID 2
      { rating: 4, userId: 104, ratedEntityId: 2, ratingType: RatingType.ACCOMMODATION },
      { rating: 2, userId: 105, ratedEntityId: 2, ratingType: RatingType.ACCOMMODATION },
      { rating: 5, userId: 106, ratedEntityId: 2, ratingType: RatingType.ACCOMMODATION },
    ];
  
    await this.ratingRepository.save(reviews);
  }
}
