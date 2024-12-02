import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RatingType } from "./rating-type.enum";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number; // Number of stars 1-5

  @Column()
  userId: number;

  @Column()
  ratedEntityId: number; // ID of host or accommodation that is beeing rated. We can determine is it a host or accommodation with help of RatingType enum.

  @Column()
  ratingType: RatingType; // Enum
}
