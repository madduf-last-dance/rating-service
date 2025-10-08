import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RatingType } from "./rating-type.enum";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  // TIMESTAMPS
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column() // Rating 1-5
  rating: number;

  @Column() // User that gives rank
  usedId: number;

  @Column() // Who is getting rated: id of HOST or id of ACCOMMODATION
  ratingId: number;

  @Column() // HOST or ACCOMMODATION
  ratingType: RatingType;
}
