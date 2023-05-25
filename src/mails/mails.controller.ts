import { Controller, Post, Body } from '@nestjs/common';
import { MailsService } from './mails.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post()
  create(@Body() createMailDto: SendMailDto) {
    return this.mailsService.send(createMailDto);
  }
}
