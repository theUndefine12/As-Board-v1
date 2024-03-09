import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TaskDto } from './dto/task.dto';
import { DesctDto } from './dto/desc.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CommentDto } from './dto/comment.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':id/create')
  @Auth()
  @UsePipes(new ValidationPipe())
  createTask(@Param('id') id: string, @Body() data: TaskDto) {
    return this.taskService.createTask(id, data)
  }

  @Post(':id/description/new')
  @Auth()
  @UsePipes(new ValidationPipe())
  addDesc(@Param('id') id: string,@Body() data: DesctDto) {
    return this.taskService.addDesc(id, data)
  }

  @Post(':id/change-status')
  @Auth()
  changeStatus(@Param('id') id: string) {
    return this.taskService.changeStatus(id)
  }

  @Post(':id/comment/new')
  @Auth()
  @UsePipes(new ValidationPipe())
  addComment(@CurrentUser('id') userId: string,@CurrentUser('title') title: string,@Param('id') id: string, @Body() data: CommentDto) {
    return this.taskService.addComment(userId, title, id, data)
  }

  @Get(':id')
  @Auth()
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(id)
  }

  @Put(':id')
  @Auth()
  @UsePipes(new ValidationPipe())
  updateTask(@Param('id') id: string, @Body() data: TaskDto) {
    return this.taskService.updateTask(id, data)
  }

  @Put(':id/description/:desc')
  @Auth()
  @UsePipes(new ValidationPipe())
  updateDesc(@Param('id') taskId: string, @Param('desc') desc: string,@Body() data: DesctDto) {
    return this.taskService.updateDesc(taskId, desc, data)
  }

  @Put(':id/comment/:msgId')
  @Auth()
  @UsePipes(new ValidationPipe())
  changeComment(@CurrentUser('id') userId: string, @Param('id') taskId: string,@Param('msgId') msgId: string, @Body() data: CommentDto) {
    return this.taskService.updateComment(userId, taskId, msgId, data)
  }

  @Delete(':id/description/:desc')
  @Auth()
  deleteDesc(@Param('id') taskId: string, @Param('desc') desc: string) {
    return this.taskService.deleetDesc(taskId, desc)
  }

  @Delete(':id/comment/:msgId')
  @Auth()
  deleteComment(@CurrentUser('id') userId: string, @Param('id') taskId: string, @Param('msgId') msgId: string) {
    return this.taskService.deleteComment(userId, taskId, msgId)
  }

  @Delete(':id')
  @Auth()
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id)
  }
}
