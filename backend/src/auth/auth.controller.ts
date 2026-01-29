import { Controller, Post, Body, Get, UseGuards, Request, Res, Patch, Param } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and returns an access token (also set as cookie).',
  })
  @ApiBody({
    schema: {
      example: {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'StrongPass123',
        role: 'USER',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(createUserDto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return result;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticates a user and returns an access token (also set as cookie).',
  })
  @ApiBody({
    schema: {
      example: {
        username: 'john_doe',
        password: 'StrongPass123',
      },
    },
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return result;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the access token cookie.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get my profile',
    description: 'Returns the authenticated user payload.',
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  @ApiOperation({
    summary: 'List users (admin)',
    description: 'Returns all users. Requires ADMIN role.',
  })
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('users/:id/role')
  @ApiOperation({
    summary: 'Update user role (admin)',
    description: 'Updates a user role by user id. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({
    schema: {
      example: {
        role: 'MANAGER',
      },
    },
  })
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.authService.updateRole(id, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('users/:id/ban')
  @ApiOperation({
    summary: 'Ban/unban user (admin)',
    description: 'Sets the banned flag for a user. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({
    schema: {
      example: {
        banned: true,
      },
    },
  })
  setBanned(@Param('id') id: string, @Body() dto: SetUserBanDto) {
    return this.authService.setBanned(id, dto.banned);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('users/:id/reset-password')
  @ApiOperation({
    summary: 'Reset user password (admin)',
    description: 'Resets a user password by user id. Requires ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({
    schema: {
      example: {
        newPassword: 'NewStrongPass123',
      },
    },
  })
  resetPassword(@Param('id') id: string, @Body() dto: ResetUserPasswordDto) {
    return this.authService.resetPassword(id, dto.newPassword);
  }
}
