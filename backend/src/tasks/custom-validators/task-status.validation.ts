import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TaskStatus } from '../task-status.enum';

@ValidatorConstraint({ name: 'isValidTaskStatus', async: false })
export default class IsValidTaskStatus implements ValidatorConstraintInterface {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    return idx !== -1;
  }
  validate(text: string) {
    text = text.toUpperCase();

    return this.isStatusValid(text);
  }

  defaultMessage() {
    return '($value) is invalid status';
  }
}
