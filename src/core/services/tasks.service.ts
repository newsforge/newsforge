import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      await this.performTask();
    } catch (error) {
      console.error('Error in hourly task:', error);
    }
  }

  private async performTask() {
    console.log('Running');
    // Implement your specific task logic here
    // For example:
    // - Clean up old records
    // - Send reports
    // - Update cache
    // - Process queued items
  }
}
