"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_decorator_1 = require("./decorators/roles.decorator");
const roles_guard_1 = require("./guards/roles.guard");
const user_entity_1 = require("./entities/user.entity");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
const set_user_ban_dto_1 = require("./dto/set-user-ban.dto");
const reset_user_password_dto_1 = require("./dto/reset-user-password.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createUserDto, res) {
        const result = await this.authService.register(createUserDto);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            sameSite: 'lax',
        });
        return result;
    }
    async login(loginDto, res) {
        const result = await this.authService.login(loginDto);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            sameSite: 'lax',
        });
        return result;
    }
    logout(res) {
        res.clearCookie('access_token');
        return { message: 'Logged out' };
    }
    getProfile(req) {
        return req.user;
    }
    findAll() {
        return this.authService.findAll();
    }
    updateRole(id, dto) {
        return this.authService.updateRole(id, dto.role);
    }
    setBanned(id, dto) {
        return this.authService.setBanned(id, dto.banned);
    }
    resetPassword(id, dto) {
        return this.authService.resetPassword(id, dto.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user',
        description: 'Creates a new user account and returns an access token (also set as cookie).',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'StrongPass123',
                role: 'USER',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login',
        description: 'Authenticates a user and returns an access token (also set as cookie).',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                username: 'john_doe',
                password: 'StrongPass123',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout',
        description: 'Clears the access token cookie.',
    }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my profile',
        description: 'Returns the authenticated user payload.',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({
        summary: 'List users (admin)',
        description: 'Returns all users. Requires ADMIN role.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user role (admin)',
        description: 'Updates a user role by user id. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                role: 'MANAGER',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Patch)('users/:id/ban'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ban/unban user (admin)',
        description: 'Sets the banned flag for a user. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                banned: true,
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_user_ban_dto_1.SetUserBanDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setBanned", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Post)('users/:id/reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset user password (admin)',
        description: 'Resets a user password by user id. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User id' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                newPassword: 'NewStrongPass123',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_user_password_dto_1.ResetUserPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map