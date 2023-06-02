import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async send(dto: SendMailDto) {
    await this.mailerService.sendMail({
      to: dto.to,
      subject: dto.subject,
      text: dto.body,
      // template: 'message',
      // context: {
      //   message: dto.body,
      //   sender: 'MagicRelay team',
      // },
    });
  }

  async sendEmailConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text: `To confirm email: copy and paste this URL into your browser: ${process.env.FRONTEND_URL}/confirm/${token}`,
    });
  }
  
  async sendEmailResetPassword(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      text: `To reset your password: copy and paste this URL into your browser: ${process.env.FRONTEND_URL}/reset-password/${token}`,
    });
  }
}
