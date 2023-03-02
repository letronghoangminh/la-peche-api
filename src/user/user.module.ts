import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MailModule],
})
export class UserModule {}
