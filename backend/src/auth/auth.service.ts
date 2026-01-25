import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: Partial<User>; access_token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const payload = { sub: savedUser.id, username: savedUser.username };

    return {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }));
  }

  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
