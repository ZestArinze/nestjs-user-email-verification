import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { EmailService } from '../message/email.service';
import { VerificationService } from '../verification/verification.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private verificationTokenService: VerificationService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { username, password, name } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      name,
    });

    const newUser = await this.usersRepository.save(user);

    delete newUser.password;

    return newUser;
  }

  async findMany(dto: FindUsersDto) {
    // const query: Partial<User> = {};
    // return this.usersRepository.find();
    return this.usersRepository.createQueryBuilder('user').getMany();
  }

  async findOne(
    username: string,
    selectSecrets: boolean = false,
  ): Promise<User | undefined> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .andWhere('user.username = :username', { username })
      .select('user');

    if (selectSecrets) {
      query.addSelect('user.password');
    }

    return await query.getOne();
  }

  async generateEmailVerification(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const otp = await this.verificationTokenService.generateOtp(user.id);

    this.emailService.sendEmail({
      subject: 'MyApp - Account Verification',
      recipients: [{ name: user.name ?? '', address: user.username }],
      html: `<p>Hi${user.name ? ' ' + user.name : ''},</p><p>You may verify your MyApp account using the following OTP: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Regards,<br />MyApp</p>`,
    });
  }

  async verifyEmail(userId: number, token: string) {
    const invalidMessage = 'Invalid or expired OTP';

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      user.id,
      token,
    );

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    user.emailVerifiedAt = new Date();
    user.accountStatus = 'active';

    await this.usersRepository.save(user);

    return true;
  }
}
