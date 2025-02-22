import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { YandexAuthGuard } from './guards/yandex-auth/yandex-auth.guard';
import { Public, Roles } from './decorators';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  //При запросе POST /auth/signin будет срабатывать LocalAuthGuard и вызывать стратегию LocalStrategy
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() request) {
    return await this.authService.login(
      request.user.id,
      request.user.name,
      request.user.role,
    );
  }

  //Провайдер с токеном APP_GUARD, зарегистрированный на уровне модуля, защищает все эндпойнты с помощью JwtAuthGuard.
  @Post('signout')
  async logOut(@Request() request, @Res() response: Response) {
    //Если не использовать JwtAuthGuard, то в request будет отсутствовать поле user.
    const data = await this.authService.logOut(request.user.id);
    return response.json(data.id);
  }

  //Провайдер с токеном APP_GUARD, зарегистрированный на уровне модуля, защищает все эндпойнты с помощью JwtAuthGuard.

  //Декораторы добавляют функции-обертки для методов контроллера.
  //Чем ближе к методу в коде находится декоратор, тем раньше он будет вызван.
  //Данные, возвращаемые функциями-обёртками, будут доступны в области вызова внешних функций-обёрток.
  //RoleAuthGuard использует данные Request.user.role для проверки наличия требуемых ролей у пользователя.
  //Если не расположить JwtAuthGuard, добавляющий в Request свойство user,
  //ближе к контроллеру, чем RoleAuthGuard,
  //то при срабатывании @Roles() в Request будут отсутствовать требуемые для его корректной работы данные: поле user.
  //Если используется глобальная защита, то добавлять @UseGuards(JwtAuthGuard) не требуется, у него уже будет приоритет выше.
  //Если глобальная защита использует несколько Guards, то они будут вызваны в порядке их приоритета:
  //чем ближе к началу массива зарегистрирован провайдер, тем раньше он будет вызван (тем выше его приоритет)..
  @Roles(Role.ADMIN, Role.EDITOR)
  //Зарегистрированы в списке провайдеров модуля (включена GlobalGuard).
  // @UseGuards(RoleAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() request) {
    return {
      message: `Now you can access this protected API! This is your ID: ${request.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  //Генерация новых JWT-токенов (refreshToken и accessToken)
  refreshToken(@Req() request) {
    return this.authService.refreshToken(request.user.id, request.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  //Авторизация через Google OAuth c стратегией GoogleStrategy
  //Перенаправляет пользователя на страницу аутентификации Google
  //GoogleStrategy.validate() принимает accessToken, refreshToken для валидации на сервер Google
  //данные профиля пользователя, полученные от Google API в случае успешной аутентификации.
  //На основе данных профиля пользователя производится поиск учётной записи в БД.
  //Если пользователя нет в БД, то создает нового пользователя в БД.
  //Путём вызова метода done() внутри validate() данные пользователя добавляются в request в виде свойства user
  //и передаются в 'auth/google/callback', где генерируются JWT-токены.
  googleLogin() {
    //Реализация не требуется, т.к. вся логика реализована в GoogleStrategy, которую вызывает GoogleAuthGuard
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  //На данном этапе перед доступом к этому маршруту в GoogleStrategy будет вызываться метод 'validate'
  //Получает данные от Google OAuth
  //import { Response } from 'express';
  async googleCallback(@Req() request, @Res() response: Response) {
    const userData = await this.authService.login(
      request.user.id,
      request.user.name,
      request.user.role,
    );

    const userId = `userId=${userData.id}`;
    const name = `name=${userData.name}`;
    const accessToken = `accessToken=${userData.accessToken}`;
    const refreshToken = `refreshToken=${userData.refreshToken}`;
    const role = `role=${userData.role}`;
    return response.redirect(
      `http://localhost:3000/api/auth/google/callback?${userId}&${name}&${accessToken}&${refreshToken}&${role}`,
    );
  }

  @Public()
  @UseGuards(YandexAuthGuard)
  @Get('yandex/login')
  yandexLogin() {
    //Реализация не требуется, т.к. вся логика реализована в YandexStrategy, которую вызывает YandexAuthGuard
  }

  @Public()
  @UseGuards(YandexAuthGuard)
  @Get('yandex/callback')
  async yandexCallback(@Req() request, @Res() response: Response) {
    const userData = await this.authService.login(
      request.user.id,
      request.user.name,
      request.user.role,
    );

    const userId = `userId=${userData.id}`;
    const name = `name=${userData.name}`;
    const accessToken = `accessToken=${userData.accessToken}`;
    const refreshToken = `refreshToken=${userData.refreshToken}`;
    const role = `role=${userData.role}`;
    return response.redirect(
      `http://localhost:3000/api/auth/yandex/callback?${userId}&${name}&${accessToken}&${refreshToken}&${role}`,
    );
  }
}
