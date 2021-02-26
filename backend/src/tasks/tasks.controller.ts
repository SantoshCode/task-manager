import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterDto } from './dto/filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getTasks(@Query() filterDto: FilterDto, @GetUser() user: UserEntity) {
    this.logger.verbose(
      `User "${user.username} retrieving all tasks. filters: ${JSON.stringify(
        filterDto,
      )}"`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: number, @GetUser() user: UserEntity) {
    return this.taskService.getTasksById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ) {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTasks(createTaskDto, user);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateTaskStatus(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserEntity,
  ) {
    return this.taskService.updateTaskStatus(id, updateTaskDto, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number, @GetUser() user: UserEntity) {
    return this.taskService.deleteTask(id, user);
  }
}
