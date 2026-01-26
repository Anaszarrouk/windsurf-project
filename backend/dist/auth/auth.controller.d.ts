import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto, res: Response): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        access_token: string;
    }>;
    regiter(createUserDto: CreateUserDto, res: Response): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        access_token: string;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        access_token: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    getProfile(req: any): any;
    findAll(): Promise<Partial<import("./entities/user.entity").User>[]>;
}
