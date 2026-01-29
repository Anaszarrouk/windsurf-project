import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('movies/:movieId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  list(@Param('movieId') movieId: string) {
    return this.reviewService.findByMovie(movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Param('movieId') movieId: string, @Body() dto: CreateReviewDto, @Req() req: any) {
    const userId = req?.user?.id as string | undefined;
    return this.reviewService.create(movieId, userId ?? '', dto);
  }

  @Get('summary')
  summary(@Param('movieId') movieId: string) {
    return this.reviewService.getSummaryForMovie(movieId);
  }
}
