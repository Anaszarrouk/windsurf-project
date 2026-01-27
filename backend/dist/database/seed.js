"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const user_entity_1 = require("../auth/entities/user.entity");
const genre_entity_1 = require("../genre/entities/genre.entity");
const movie_entity_1 = require("../movie/entities/movie.entity");
const task_entity_1 = require("../screening-task/entities/task.entity");
const screening_entity_1 = require("../screening/entities/screening.entity");
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'cinevault_dev',
    entities: [user_entity_1.User, genre_entity_1.Genre, movie_entity_1.Movie, task_entity_1.Task, screening_entity_1.Screening],
    synchronize: true,
});
async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected for seeding...');
        const userRepository = AppDataSource.getRepository(user_entity_1.User);
        const genreRepository = AppDataSource.getRepository(genre_entity_1.Genre);
        const movieRepository = AppDataSource.getRepository(movie_entity_1.Movie);
        const taskRepository = AppDataSource.getRepository(task_entity_1.Task);
        const screeningRepository = AppDataSource.getRepository(screening_entity_1.Screening);
        const hashedPassword = await bcrypt.hash('password123', 10);
        const users = [
            { username: 'admin', email: 'admin@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.ADMIN, banned: false },
            { username: 'manager', email: 'manager@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.MANAGER, banned: false },
            { username: 'john_doe', email: 'john@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.USER, banned: false },
            { username: 'jane_smith', email: 'jane@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.USER, banned: false },
        ];
        const savedUsers = [];
        for (const userData of users) {
            const existingUser = await userRepository.findOne({ where: { username: userData.username } });
            if (!existingUser) {
                const user = userRepository.create(userData);
                savedUsers.push(await userRepository.save(user));
                console.log(`Created user: ${userData.username}`);
            }
            else {
                savedUsers.push(existingUser);
                console.log(`User already exists: ${userData.username}`);
            }
        }
        const genreNames = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Animation'];
        const savedGenres = [];
        for (const designation of genreNames) {
            const existingGenre = await genreRepository.findOne({ where: { designation } });
            if (!existingGenre) {
                const genre = genreRepository.create({ designation });
                savedGenres.push(await genreRepository.save(genre));
                console.log(`Created genre: ${designation}`);
            }
            else {
                savedGenres.push(existingGenre);
                console.log(`Genre already exists: ${designation}`);
            }
        }
        const moviesData = [
            {
                title: 'The Dark Knight',
                duration: 152,
                poster: 'https://m.media-amazon.com/images/I/51k0qa6oT-L._AC_.jpg',
                director: 'Christopher Nolan',
                price: 12.99,
                trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
                genres: ['Action', 'Drama', 'Thriller'],
            },
            {
                title: 'Inception',
                duration: 148,
                poster: 'https://m.media-amazon.com/images/I/51s+e2Z9WEL._AC_.jpg',
                director: 'Christopher Nolan',
                price: 11.99,
                trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
                genres: ['Action', 'Sci-Fi', 'Thriller'],
            },
            {
                title: 'Interstellar',
                duration: 169,
                poster: 'https://m.media-amazon.com/images/I/71n58W5T9WL._AC_SL1024_.jpg',
                director: 'Christopher Nolan',
                price: 13.5,
                trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
                genres: ['Sci-Fi', 'Drama'],
            },
            {
                title: 'The Matrix',
                duration: 136,
                poster: 'https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_.jpg',
                director: 'Wachowski Sisters',
                price: 10.0,
                trailerUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
                genres: ['Action', 'Sci-Fi'],
            },
            {
                title: 'Pulp Fiction',
                duration: 154,
                poster: 'https://m.media-amazon.com/images/I/71c05lTE03L._AC_SL1024_.jpg',
                director: 'Quentin Tarantino',
                price: 9.99,
                trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
                genres: ['Drama', 'Comedy'],
            },
            {
                title: 'The Shining',
                duration: 146,
                poster: 'https://m.media-amazon.com/images/I/71o2L6x6WZL._AC_SL1024_.jpg',
                director: 'Stanley Kubrick',
                price: 8.5,
                trailerUrl: 'https://www.youtube.com/watch?v=5Cb3ik6zP2I',
                genres: ['Horror', 'Thriller'],
            },
            {
                title: 'Toy Story',
                duration: 81,
                poster: 'https://m.media-amazon.com/images/I/81mH1lZ8qEL._AC_SL1500_.jpg',
                director: 'John Lasseter',
                price: 7.99,
                trailerUrl: 'https://www.youtube.com/watch?v=v-PjgYDrg70',
                genres: ['Animation', 'Comedy'],
            },
            {
                title: 'Titanic',
                duration: 195,
                poster: 'https://m.media-amazon.com/images/I/71KxkU7mVQL._AC_SL1024_.jpg',
                director: 'James Cameron',
                price: 10.5,
                trailerUrl: 'https://www.youtube.com/watch?v=CHekzSiZjrY',
                genres: ['Drama', 'Romance'],
            },
        ];
        for (const movieData of moviesData) {
            const existingMovie = await movieRepository.findOne({ where: { title: movieData.title } });
            if (!existingMovie) {
                const movieGenres = savedGenres.filter(g => movieData.genres.includes(g.designation));
                const movie = movieRepository.create({
                    title: movieData.title,
                    duration: movieData.duration,
                    poster: movieData.poster,
                    director: movieData.director,
                    price: movieData.price,
                    trailerUrl: movieData.trailerUrl,
                    user: savedUsers[Math.floor(Math.random() * savedUsers.length)],
                    genres: movieGenres,
                });
                await movieRepository.save(movie);
                console.log(`Created movie: ${movieData.title}`);
            }
            else {
                const movieGenres = savedGenres.filter(g => movieData.genres.includes(g.designation));
                existingMovie.duration = movieData.duration;
                existingMovie.director = movieData.director;
                existingMovie.poster = movieData.poster;
                existingMovie.price = movieData.price;
                existingMovie.trailerUrl = movieData.trailerUrl;
                existingMovie.genres = movieGenres;
                await movieRepository.save(existingMovie);
                console.log(`Updated movie: ${movieData.title}`);
            }
        }
        const tasksData = [
            { name: 'Clean Theater 1', description: 'Deep clean theater 1 after midnight screening', status: task_entity_1.TaskStatus.EN_ATTENTE },
            { name: 'Update Projector', description: 'Install new firmware on Theater 2 projector', status: task_entity_1.TaskStatus.EN_COURS },
            { name: 'Restock Popcorn', description: 'Restock popcorn supplies in concession stand', status: task_entity_1.TaskStatus.FINALISE },
            { name: 'Fix Sound System', description: 'Repair speaker in Theater 3', status: task_entity_1.TaskStatus.EN_ATTENTE },
            { name: 'Replace Seats', description: 'Replace damaged seats in Theater 1 row F', status: task_entity_1.TaskStatus.EN_COURS },
            { name: 'Inspect Fire Exits', description: 'Monthly fire exit inspection', status: task_entity_1.TaskStatus.EN_ATTENTE },
        ];
        for (const taskData of tasksData) {
            const existingTask = await taskRepository.findOne({ where: { name: taskData.name } });
            if (!existingTask) {
                const task = taskRepository.create({
                    ...taskData,
                    date: new Date(),
                });
                await taskRepository.save(task);
                console.log(`Created task: ${taskData.name}`);
            }
            else {
                console.log(`Task already exists: ${taskData.name}`);
            }
        }
        const allMovies = await movieRepository.find();
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const mkDate = (base, hour, minute) => {
            const d = new Date(base);
            d.setHours(hour, minute, 0, 0);
            return d;
        };
        const rooms = ['Room 1', 'Room 2', 'Room 3'];
        const slots = [
            { h: 10, m: 0 },
            { h: 13, m: 0 },
            { h: 16, m: 0 },
            { h: 19, m: 0 },
            { h: 21, m: 30 },
        ];
        const pickMovies = allMovies.slice(0, Math.min(allMovies.length, 6));
        for (let i = 0; i < pickMovies.length; i++) {
            const movie = pickMovies[i];
            const room = rooms[i % rooms.length];
            const slot = slots[i % slots.length];
            const startsAt = mkDate(todayStart, slot.h, slot.m);
            const endsAt = new Date(startsAt);
            endsAt.setMinutes(endsAt.getMinutes() + (movie.duration || 120));
            const existing = await screeningRepository.findOne({ where: { movieId: movie.id, startsAt } });
            if (!existing) {
                const screening = screeningRepository.create({
                    movieId: movie.id,
                    startsAt,
                    endsAt,
                    room,
                    capacity: 120,
                    ticketsSold: Math.floor(Math.random() * 80),
                    status: screening_entity_1.ScreeningStatus.SCHEDULED,
                });
                await screeningRepository.save(screening);
                console.log(`Created screening for ${movie.title} at ${startsAt.toISOString()} in ${room}`);
            }
        }
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        for (let i = 0; i < Math.min(pickMovies.length, 4); i++) {
            const movie = pickMovies[i];
            const room = rooms[(i + 1) % rooms.length];
            const slot = slots[(i + 2) % slots.length];
            const startsAt = mkDate(tomorrowStart, slot.h, slot.m);
            const endsAt = new Date(startsAt);
            endsAt.setMinutes(endsAt.getMinutes() + (movie.duration || 120));
            const existing = await screeningRepository.findOne({ where: { movieId: movie.id, startsAt } });
            if (!existing) {
                const screening = screeningRepository.create({
                    movieId: movie.id,
                    startsAt,
                    endsAt,
                    room,
                    capacity: 120,
                    ticketsSold: Math.floor(Math.random() * 60),
                    status: screening_entity_1.ScreeningStatus.SCHEDULED,
                });
                await screeningRepository.save(screening);
                console.log(`Created screening for ${movie.title} at ${startsAt.toISOString()} in ${room}`);
            }
        }
        console.log('Seeding completed successfully!');
        await AppDataSource.destroy();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map