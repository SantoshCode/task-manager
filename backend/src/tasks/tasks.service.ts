import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterDto } from './dto/filter-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskReposiory: TaskRepository,
  ) {}

  getTasks(filterDto: FilterDto, user: UserEntity): Promise<Task[]> {
    return this.taskReposiory.getTasks(filterDto, user);
  }
  async getTasksById(id: number, user: UserEntity): Promise<Task> {
    const found = await this.taskReposiory.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  createTasks(createTaskDto: CreateTaskDto, user: UserEntity): Promise<Task> {
    return this.taskReposiory.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.getTasksById(id, user);

    const { status } = updateTaskDto;

    task.status = status;

    task.save();

    return task;
  }

  async deleteTask(id: number, user: UserEntity): Promise<DeleteResult> {
    const result = await this.taskReposiory.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return result;
  }
}
