import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshConfig from './config/refresh.config';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import yandexOauthConfig from './config/yandex-oauth.config';
import { YandexStrategy } from './strategies/yandex.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RoleAuthGuard } from './guards/role-auth/role-auth.guard';

@Module({
  imports: [
    //Регистрирует объект конфигурации в модуле.
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(yandexOauthConfig),
    //.asProvider() преобразует конфигурацию с пространством имен в поставщика.
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    YandexStrategy,
    //Порядок перечисления провайдеров важен. От него зависит порядок их срабатывания.
    //JwtAuthGuard должен быть зарегистрирован перед RoleAuthGuard,
    //т.к. он добавляет в Request свойство user, которое требуется для корректной работы RoleAuthGuard.
    {
      //import { APP_GUARD } from '@nestjs/core';
      provide: APP_GUARD,
      //Регистрация провайдера с токеном APP_GUARD приведёт к тому,
      //что все контроллеры, данного модуля по умолчанию будут защищены JwtAuthGuard.
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard)
    },
    {
      //Повторная регистрация провайдера с токеном APP_GUARD не приввдёт к его перезаписи,
      provide: APP_GUARD,
      useClass: RoleAuthGuard, //@UseGuards(RoleAuthGuard)
    },
  ],
})
export class AuthModule {}
