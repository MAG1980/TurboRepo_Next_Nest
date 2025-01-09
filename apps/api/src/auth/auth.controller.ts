import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  //При запросе POST /auth/signin будет срабатывать LocalAuthGuard и вызывать стратегию LocalStrategy
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() request) {
    return await this.authService.login(request.user.id, request.user.name);
  }
}
