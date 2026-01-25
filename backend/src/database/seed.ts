import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../auth/entities/user.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Movie } from '../movie/entities/movie.entity';
import { Task, TaskStatus } from '../screening-task/entities/task.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'cinevault_dev',
  entities: [User, Genre, Movie, Task],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const userRepository = AppDataSource.getRepository(User);
    const genreRepository = AppDataSource.getRepository(Genre);
    const movieRepository = AppDataSource.getRepository(Movie);
    const taskRepository = AppDataSource.getRepository(Task);

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      { username: 'admin', email: 'admin@cinevault.com', password: hashedPassword, role: UserRole.ADMIN },
      { username: 'manager', email: 'manager@cinevault.com', password: hashedPassword, role: UserRole.MANAGER },
      { username: 'john_doe', email: 'john@cinevault.com', password: hashedPassword, role: UserRole.USER },
      { username: 'jane_smith', email: 'jane@cinevault.com', password: hashedPassword, role: UserRole.USER },
    ];

    const savedUsers = [];
    for (const userData of users) {
      const existingUser = await userRepository.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        const user = userRepository.create(userData);
        savedUsers.push(await userRepository.save(user));
        console.log(`Created user: ${userData.username}`);
      } else {
        savedUsers.push(existingUser);
        console.log(`User already exists: ${userData.username}`);
      }
    }

    // Seed Genres
    const genreNames = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Animation'];
    const savedGenres = [];
    for (const designation of genreNames) {
      const existingGenre = await genreRepository.findOne({ where: { designation } });
      if (!existingGenre) {
        const genre = genreRepository.create({ designation });
        savedGenres.push(await genreRepository.save(genre));
        console.log(`Created genre: ${designation}`);
      } else {
        savedGenres.push(existingGenre);
        console.log(`Genre already exists: ${designation}`);
      }
    }

    // Seed Movies
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
      } else {
        console.log(`Movie already exists: ${movieData.title}`);
      }
    }

    // Seed Screening Tasks
    const tasksData = [
      { name: 'Clean Theater 1', description: 'Deep clean theater 1 after midnight screening', status: TaskStatus.EN_ATTENTE },
      { name: 'Update Projector', description: 'Install new firmware on Theater 2 projector', status: TaskStatus.EN_COURS },
      { name: 'Restock Popcorn', description: 'Restock popcorn supplies in concession stand', status: TaskStatus.FINALISE },
      { name: 'Fix Sound System', description: 'Repair speaker in Theater 3', status: TaskStatus.EN_ATTENTE },
      { name: 'Replace Seats', description: 'Replace damaged seats in Theater 1 row F', status: TaskStatus.EN_COURS },
      { name: 'Inspect Fire Exits', description: 'Monthly fire exit inspection', status: TaskStatus.EN_ATTENTE },
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
      } else {
        console.log(`Task already exists: ${taskData.name}`);
      }
    }

    console.log('Seeding completed successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
