import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NoAccountGuard } from '../auth/decorators/no-account-guard.decorator';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findMany(@Query() query: FindUsersDto) {
    return this.usersService.findMany(query);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @NoAccountGuard()
  @Post('verification-otp')
  async generateEmailVerification(@CurrentUser() user: User) {
    await this.usersService.generateEmailVerification(user.id);

    return { status: 'success', message: 'Sending email in a moment' };
  }

  @NoAccountGuard()
  @Post('verify/:otp')
  async verifyEmail(@Param('otp') otp: string, @CurrentUser() user: User) {
    const result = await this.usersService.verifyEmail(user.id, otp);

    return { status: result ? 'sucess' : 'failure', message: null };
  }
}
