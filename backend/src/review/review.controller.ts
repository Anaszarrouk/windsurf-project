import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller('movies/:movieId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'List reviews for movie', description: 'Returns all reviews for a specific movie.' })
  @ApiParam({ name: 'movieId', description: 'Movie id' })
  list(@Param('movieId') movieId: string) {
    return this.reviewService.findByMovie(movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create review', description: 'Creates a review for a movie. Requires authentication.' })
  @ApiParam({ name: 'movieId', description: 'Movie id' })
  @ApiBody({
    schema: {
      example: {
        rating: 5,
        comment: 'Amazing movie! Great story and visuals.',
      },
    },
  })
  create(@Param('movieId') movieId: string, @Body() dto: CreateReviewDto, @Req() req: any) {
    const userId = req?.user?.id as string | undefined;
    return this.reviewService.create(movieId, userId ?? '', dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Review summary for movie', description: 'Returns aggregated review metrics for a movie.' })
  @ApiParam({ name: 'movieId', description: 'Movie id' })
  summary(@Param('movieId') movieId: string) {
    return this.reviewService.getSummaryForMovie(movieId);
  }
}
