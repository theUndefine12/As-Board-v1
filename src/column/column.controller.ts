import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ColumnService } from './column.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ColumnDto } from './dto/column.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('dashboard/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post(':id/create')
  @Auth()
  @UsePipes(new ValidationPipe())
  addColumn(@Param('id') id: string, @Body() data: ColumnDto) {
    return this.columnService.addColumn(id, data)
  }

  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  updateColumn(@CurrentUser('id') userId: string, @Param('id') id: string,@Body() data: ColumnDto) {
    return this.columnService.updateColumn(userId, id, data)
  }

  @Delete(':id')
  @Auth()
  deleteColumn(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.columnService.deletColumn(userId, id)
  }
}
