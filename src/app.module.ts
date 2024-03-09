import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
// import { ComunityModule } from './comunity/comunity.module';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule, UserModule, DashboardModule, ColumnModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
