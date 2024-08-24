import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
  sender?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
}
