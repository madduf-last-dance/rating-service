import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rating } from "src/rating/entities/rating.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [SeedService],
})
export class SeedModule {}
