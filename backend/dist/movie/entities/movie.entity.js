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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const genre_entity_1 = require("../../genre/entities/genre.entity");
let Movie = class Movie {
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Movie.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "poster", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movie.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.movies),
    __metadata("design:type", user_entity_1.User)
], Movie.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genre_entity_1.Genre, (genre) => genre.movies),
    (0, typeorm_1.JoinTable)({
        name: 'movie_genres',
        joinColumn: { name: 'movieId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'genreId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Movie.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Movie.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.VersionColumn)(),
    __metadata("design:type", Number)
], Movie.prototype, "version", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)('movies')
], Movie);
//# sourceMappingURL=movie.entity.js.map