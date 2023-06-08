import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendEmailConfirmation(
    user: { email: string; name: string },
    token: string,
  ) {
    const url = `${this.config.get('APPLICATION_ROOT')}/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to La Pêche! Please confirm your Email',
      template: 'confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }

  async sendResetPasswordEmail(
    user: { email: string; name: string },
    token: string,
  ) {
    const url = `${this.config.get(
      'APPLICATION_ROOT',
    )}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Use the below URL to reset password, please don't share it",
      template: 'reset-password',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
