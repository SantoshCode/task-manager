import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterDto } from './dto/filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDto: FilterDto, user: UserEntity) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }, filters: ${JSON.stringify(filterDto)}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const { title, description, status } = createTaskDto;
    const task = new Task();
    task.user = user;
    task.title = title;
    task.description = description;
    console.log('before',status)
    task.status = status ? status : TaskStatus.OPEN;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create tasks for user "${
          user.username
        }, Data: ${JSON.stringify(createTaskDto)}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    task.user = undefined;
    return task;
  }
}
