import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        user: Partial<User>;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        access_token: string;
    }>;
    findAll(): Promise<Partial<User>[]>;
    findOne(id: string): Promise<Partial<User>>;
}
