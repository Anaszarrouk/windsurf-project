import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards, Version } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Version('2')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req: any) {
    const userId = req?.user?.id as string | undefined;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.reportService.create(userId, dto);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  async listForStaff() {
    return this.reportService.findAllForStaff();
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id/resolve')
  async resolve(@Param('id') id: string, @Req() req: any) {
    return this.reportService.resolve(id, req?.user);
  }

  @Version('2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
