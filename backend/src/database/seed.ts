import { Between, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from '../auth/entities/user.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Movie } from '../movie/entities/movie.entity';
import { Review } from '../review/entities/review.entity';
import { Task, TaskStatus } from '../screening-task/entities/task.entity';
import { Screening, ScreeningStatus } from '../screening/entities/screening.entity';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cinevault_dev',
  entities: [User, Genre, Movie, Review, Task, Screening, Booking],
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
    const screeningRepository = AppDataSource.getRepository(Screening);
    const bookingRepository = AppDataSource.getRepository(Booking);

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      { username: 'admin', email: 'admin@cinevault.com', password: hashedPassword, role: UserRole.ADMIN, banned: false },
      { username: 'manager', email: 'manager@cinevault.com', password: hashedPassword, role: UserRole.MANAGER, banned: false },
      { username: 'john_doe', email: 'john@cinevault.com', password: hashedPassword, role: UserRole.USER, banned: false },
      { username: 'jane_smith', email: 'jane@cinevault.com', password: hashedPassword, role: UserRole.USER, banned: false },
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
          price: (movieData as any).price,
          trailerUrl: (movieData as any).trailerUrl,
          user: savedUsers[Math.floor(Math.random() * savedUsers.length)],
          genres: movieGenres,
        });
        await movieRepository.save(movie);
        console.log(`Created movie: ${movieData.title}`);
      } else {
        // Update existing movie so rerunning seed refreshes demo data
        const movieGenres = savedGenres.filter(g => movieData.genres.includes(g.designation));

        existingMovie.duration = movieData.duration;
        existingMovie.director = movieData.director;
        existingMovie.poster = movieData.poster;
        (existingMovie as any).price = (movieData as any).price;
        (existingMovie as any).trailerUrl = (movieData as any).trailerUrl;
        existingMovie.genres = movieGenres;

        await movieRepository.save(existingMovie);
        console.log(`Updated movie: ${movieData.title}`);
      }
    }

    // Seed Screenings (today + tomorrow)
    const allMovies = await movieRepository.find();

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const mkDate = (base: Date, hour: number, minute: number) => {
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

      const existing = await screeningRepository.findOne({ where: { movieId: movie.id, startsAt } as any });
      if (!existing) {
        const screening = screeningRepository.create({
          movieId: movie.id,
          startsAt,
          endsAt,
          room,
          capacity: 120,
          ticketsSold: 0,
          status: ScreeningStatus.SCHEDULED,
        });
        await screeningRepository.save(screening);
        console.log(`Created screening for ${movie.title} at ${startsAt.toISOString()} in ${room}`);
      } else {
        existing.room = room;
        existing.endsAt = endsAt as any;
        existing.capacity = 120 as any;
        existing.status = ScreeningStatus.SCHEDULED as any;
        await screeningRepository.save(existing);
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

      const existing = await screeningRepository.findOne({ where: { movieId: movie.id, startsAt } as any });
      if (!existing) {
        const screening = screeningRepository.create({
          movieId: movie.id,
          startsAt,
          endsAt,
          room,
          capacity: 120,
          ticketsSold: 0,
          status: ScreeningStatus.SCHEDULED,
        });
        await screeningRepository.save(screening);
        console.log(`Created screening for ${movie.title} at ${startsAt.toISOString()} in ${room}`);
      } else {
        existing.room = room;
        existing.endsAt = endsAt as any;
        existing.capacity = 120 as any;
        existing.status = ScreeningStatus.SCHEDULED as any;
        await screeningRepository.save(existing);
      }
    }

    // Seed Screening Tasks (some linked to screenings)
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const todaysScreenings = await screeningRepository.find({
      where: { startsAt: Between(todayStart, todayEnd) } as any,
      relations: ['movie'] as any,
      order: { startsAt: 'ASC' } as any,
    });

    const s1 = todaysScreenings[0];
    const s2 = todaysScreenings[1];
    const s3 = todaysScreenings[2];

    const tasksData = [
      { name: 'Clean Room 1 after show', description: 'Quick cleanup right after the screening ends.', status: TaskStatus.EN_ATTENTE, screeningId: s1?.id },
      { name: 'Projector check before show', description: 'Run projector diagnostics and focus calibration.', status: TaskStatus.EN_COURS, screeningId: s2?.id },
      { name: 'Sound system test', description: 'Test rear speakers and subwoofer levels.', status: TaskStatus.EN_ATTENTE, screeningId: s3?.id },
      { name: 'Restock Popcorn', description: 'Restock popcorn supplies in concession stand', status: TaskStatus.FINALISE },
      { name: 'Inspect Fire Exits', description: 'Monthly fire exit inspection', status: TaskStatus.EN_ATTENTE },
    ];

    for (const taskData of tasksData) {
      const existingTask = await taskRepository.findOne({ where: { name: taskData.name } });
      if (!existingTask) {
        const task = taskRepository.create({
          ...(taskData as any),
          date: new Date(),
        });
        await taskRepository.save(task);
        console.log(`Created task: ${taskData.name}`);
      } else {
        (existingTask as any).description = (taskData as any).description;
        (existingTask as any).status = (taskData as any).status;
        (existingTask as any).screeningId = (taskData as any).screeningId;
        await taskRepository.save(existingTask);
        console.log(`Updated task: ${taskData.name}`);
      }
    }

    // Seed Demo Bookings (linked to screenings + users)
    const john = savedUsers.find((u) => u.username === 'john_doe');
    const jane = savedUsers.find((u) => u.username === 'jane_smith');

    if (john && jane && todaysScreenings.length) {
      const bookingScreenings = todaysScreenings.slice(0, 3);
      const demoUserIds = [john.id, jane.id];
      const demoScreeningIds = bookingScreenings.map((s) => s.id);

      await bookingRepository
        .createQueryBuilder()
        .delete()
        .from(Booking)
        .where('userId IN (:...userIds)', { userIds: demoUserIds })
        .andWhere('screeningId IN (:...screeningIds)', { screeningIds: demoScreeningIds })
        .execute();

      const mkBooking = (userId: string, screening: any, seatsCount: number, status: BookingStatus) => {
        const price = Number(screening?.movie?.price ?? 0);
        const totalPrice = Number.isFinite(price) ? Number((price * seatsCount).toFixed(2)) : 0;
        return bookingRepository.create({
          userId,
          screeningId: screening.id,
          seatsCount,
          totalPrice,
          status,
        });
      };

      const demoBookings = [
        mkBooking(john.id, bookingScreenings[0], 2, BookingStatus.PAID),
        mkBooking(jane.id, bookingScreenings[0], 3, BookingStatus.PAID),
        mkBooking(john.id, bookingScreenings[1] || bookingScreenings[0], 1, BookingStatus.CANCELLED),
        mkBooking(jane.id, bookingScreenings[1] || bookingScreenings[0], 2, BookingStatus.REFUNDED),
        mkBooking(john.id, bookingScreenings[2] || bookingScreenings[0], 4, BookingStatus.PAID),
      ];

      for (const b of demoBookings) {
        await bookingRepository.save(b);
      }
      console.log(`Created demo bookings: ${demoBookings.length}`);

      // Sync ticketsSold from PAID bookings for today's screenings
      for (const s of bookingScreenings) {
        const raw = await bookingRepository
          .createQueryBuilder('b')
          .select('COALESCE(SUM(b.seatsCount), 0)', 'sum')
          .where('b.screeningId = :screeningId', { screeningId: s.id })
          .andWhere('b.status = :status', { status: BookingStatus.PAID })
          .getRawOne();

        const paidSeats = Number((raw as any)?.sum ?? 0);
        await screeningRepository.update({ id: s.id } as any, { ticketsSold: paidSeats as any } as any);
      }
      console.log('Synced ticketsSold for demo screenings');
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
