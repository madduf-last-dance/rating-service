import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RatingType } from "./rating-type.enum";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  usedId: number;

  @Column()
  ratingId: number;

  @Column()
  ratingType: RatingType;
}
