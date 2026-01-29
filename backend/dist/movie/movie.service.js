"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./entities/movie.entity");
const genre_entity_1 = require("../genre/entities/genre.entity");
const review_service_1 = require("../review/review.service");
let MovieService = class MovieService {
    constructor(movieRepository, genreRepository, reviewService) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.reviewService = reviewService;
    }
    async findAllV2() {
        const movies = await this.movieRepository.find({ relations: ['user', 'genres'] });
        const summaries = await this.reviewService.getSummariesForMovies(movies.map((m) => m.id));
        return movies.map((m) => {
            const s = summaries[m.id];
            return {
                ...m,
                avgRating: s?.avgRating ?? 0,
                reviewCount: s?.reviewCount ?? 0,
            };
        });
    }
    async findOneV2(id) {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: ['user', 'genres'],
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
        }
        const summary = await this.reviewService.getSummaryForMovie(movie.id);
        return {
            ...movie,
            avgRating: summary.avgRating,
            reviewCount: summary.reviewCount,
        };
    }
    async createV2(createMovieDto) {
        const movie = this.movieRepository.create(createMovieDto);
        if (createMovieDto.genreIds && createMovieDto.genreIds.length > 0) {
            movie.genres = await this.genreRepository.find({
                where: { id: (0, typeorm_2.In)(createMovieDto.genreIds) },
            });
        }
        return this.movieRepository.save(movie);
    }
    async updateV2(id, updateMovieDto) {
        const { genreIds, ...updatePayload } = updateMovieDto;
        const movie = await this.movieRepository.preload({
            id,
            ...updatePayload,
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${id} not found`);
        }
        if (genreIds) {
            movie.genres = await this.genreRepository.find({
                where: { id: (0, typeorm_2.In)(genreIds) },
            });
        }
        return this.movieRepository.save(movie);
    }
    async removeV2(id) {
        const movie = await this.findOneV2(id);
        await this.movieRepository.softRemove(movie);
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(1, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        review_service_1.ReviewService])
], MovieService);
//# sourceMappingURL=movie.service.js.map