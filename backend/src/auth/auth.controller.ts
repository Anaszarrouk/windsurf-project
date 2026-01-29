import { Controller, Post, Body, Get, UseGuards, Request, Res, Patch, Param } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { SetUserBanDto } from './dto/set-user-ban.dto';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(createUserDto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return result;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.authService.updateRole(id, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('users/:id/ban')
  setBanned(@Param('id') id: string, @Body() dto: SetUserBanDto) {
    return this.authService.setBanned(id, dto.banned);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('users/:id/reset-password')
  resetPassword(@Param('id') id: string, @Body() dto: ResetUserPasswordDto) {
    return this.authService.resetPassword(id, dto.newPassword);
  }
}
