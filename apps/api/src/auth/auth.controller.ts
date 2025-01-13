import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() request) {
    return {
      message: `Now you can access this protected API! This is your ID: ${request.user.id}`,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  //Генерация новых JWT-токенов (refreshToken и accessToken)
  refreshToken(@Req() request) {
    return this.authService.refreshToken(request.user.id, request.user.name);
  }
}
