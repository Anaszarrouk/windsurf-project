import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create report', description: 'Creates a new report for the authenticated user.' })
  @ApiBody({
    schema: {
      example: {
        category: 'BUG',
        message: 'There is an issue with this movie page. Please review the content.',
        movieId: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  create(@Body() dto: CreateReportDto, @Req() req: any) {
    const userId = req?.user?.id as string | undefined;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.reportService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  @ApiOperation({
    summary: 'List reports (staff)',
    description: 'Returns all reports for staff review. Requires ADMIN or MANAGER role.',
  })
  listForStaff() {
    return this.reportService.findAllForStaff();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id/resolve')
  @ApiOperation({
    summary: 'Resolve report (staff)',
    description: 'Marks a report as resolved. Requires ADMIN or MANAGER role.',
  })
  @ApiParam({ name: 'id', description: 'Report id' })
  resolve(@Param('id') id: string, @Req() req: any) {
    return this.reportService.resolve(id, req?.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete report (staff)',
    description: 'Deletes a report by id. Requires ADMIN or MANAGER role.',
  })
  @ApiParam({ name: 'id', description: 'Report id' })
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
