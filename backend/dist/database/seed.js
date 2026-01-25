"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const user_entity_1 = require("../auth/entities/user.entity");
const genre_entity_1 = require("../genre/entities/genre.entity");
const movie_entity_1 = require("../movie/entities/movie.entity");
const task_entity_1 = require("../screening-task/entities/task.entity");
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'cinevault_dev',
    entities: [user_entity_1.User, genre_entity_1.Genre, movie_entity_1.Movie, task_entity_1.Task],
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
        const hashedPassword = await bcrypt.hash('password123', 10);
        const users = [
            { username: 'admin', email: 'admin@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.ADMIN },
            { username: 'manager', email: 'manager@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.MANAGER },
            { username: 'john_doe', email: 'john@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.USER },
            { username: 'jane_smith', email: 'jane@cinevault.com', password: hashedPassword, role: user_entity_1.UserRole.USER },
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
            { title: 'The Dark Knight', duration: 152, poster: '/posters/dark-knight.jpg', director: 'Christopher Nolan', genres: ['Action', 'Drama', 'Thriller'] },
            { title: 'Inception', duration: 148, poster: '/posters/inception.jpg', director: 'Christopher Nolan', genres: ['Action', 'Sci-Fi', 'Thriller'] },
            { title: 'Interstellar', duration: 169, poster: '/posters/interstellar.jpg', director: 'Christopher Nolan', genres: ['Sci-Fi', 'Drama'] },
            { title: 'The Matrix', duration: 136, poster: '/posters/matrix.jpg', director: 'Wachowski Sisters', genres: ['Action', 'Sci-Fi'] },
            { title: 'Pulp Fiction', duration: 154, poster: '/posters/pulp-fiction.jpg', director: 'Quentin Tarantino', genres: ['Drama', 'Comedy'] },
            { title: 'The Shining', duration: 146, poster: '/posters/shining.jpg', director: 'Stanley Kubrick', genres: ['Horror', 'Thriller'] },
            { title: 'Toy Story', duration: 81, poster: '/posters/toy-story.jpg', director: 'John Lasseter', genres: ['Animation', 'Comedy'] },
            { title: 'Titanic', duration: 195, poster: '/posters/titanic.jpg', director: 'James Cameron', genres: ['Drama', 'Romance'] },
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
                    user: savedUsers[Math.floor(Math.random() * savedUsers.length)],
                    genres: movieGenres,
                });
                await movieRepository.save(movie);
                console.log(`Created movie: ${movieData.title}`);
            }
            else {
                console.log(`Movie already exists: ${movieData.title}`);
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