import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<import("./entities/user.entity").User>;
        access_token: string;
    }>;
    getProfile(req: any): any;
    findAll(): Promise<Partial<import("./entities/user.entity").User>[]>;
}
