import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewModel } from './rewiev.model';

@Module({
  controllers: [ReviewController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReviewModel,
        schemaOptions: {
          collection: 'Rewiev',
        },
      },
    ]),
  ],
  providers: [ReviewService],
})
export class ReviewModule {}
