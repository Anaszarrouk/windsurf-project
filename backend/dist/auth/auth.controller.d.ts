import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { SetUserBanDto } from './dto/set-user-ban.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
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
    updateRole(id: string, dto: UpdateUserRoleDto): Promise<Partial<import("./entities/user.entity").User>>;
    setBanned(id: string, dto: SetUserBanDto): Promise<Partial<import("./entities/user.entity").User>>;
    resetPassword(id: string, dto: ResetUserPasswordDto): Promise<{
        message: string;
    }>;
}
