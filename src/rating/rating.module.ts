import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Rating } from "./entities/rating.entity";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RESERVATION_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 1315,
        },
      },
      {
        name: "ACCOMMODATION_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "accommodation-service",
          port: 1312,
        },
      },
    ]),
    TypeOrmModule.forFeature([Rating]),
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService, TypeOrmModule],
})
export class RatingModule {}
