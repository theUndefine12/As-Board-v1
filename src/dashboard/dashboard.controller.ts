import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { DashboardDto } from './dto/dashboard.dto';
import { updateDto } from './dto/update.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Post('create')
  @Auth()
  @UsePipes(new ValidationPipe())
  createDahsboard(@CurrentUser('id') userId: string, @Body() data: DashboardDto) {
    return this.dashboardService.createDahsboard(userId ,data)
  }

  @Get()
  @Auth()
  getAllDashboards(@CurrentUser('id') userId: string) {
    return this.dashboardService.getAllDashboards(userId)
  }

  @Get(':id')
  @Auth()
  getDashboardById(@Param('id') id: string) {
    return this.dashboardService.getDashboardById(id)
  }

  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  updateDashboard(@CurrentUser('id') userId: string, @Param('id') id: string,@Body() data: updateDto) {
    return this.dashboardService.updateDashboard(userId ,id, data)
  }

  @Delete(':id')
  @Auth()
  deleteDashboard(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.dashboardService.deleteDashboard(userId, id)
  }
}
