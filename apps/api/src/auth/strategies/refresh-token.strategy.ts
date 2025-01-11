import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import {  ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types';
import { AuthService } from '../auth.service';
import refreshConfig from "../config/refresh.config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'refresh-jwt') {
  constructor(
    //Внедрение экземпляра объекта конфигурации с помощью токена jwtConfig.KEY
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService,
    // private readonly configService: ConfigService,
  ) {
    super({
      //Получать токен из свойства refresh тела запроса
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      //Секретный JWT-ключ для валидации полученных данных
      //Получение секретного ключа с помощью экземпляра объекта конфигурации
      secretOrKey: refreshTokenConfig.secret,
      // Получение секретного ключа с помощью ConfigService
      // secretOrKey: configService.get<typeof refreshConfig>('refresh-jwt.secret'),
      //Запретить использование просроченного токена
      ignoreExpiration: false,
    });
  }

  /*Прикреплённый к соответствующему методу контроллера Guard вызовет связанную с ним стратегию.
  Данная JwtStrategy в связи с переданными в super() настройками
  будет получать токен из AuthBearer-заголовка запроса и с помощью секретного ключа проверять его валидность.
  Если проверка на валидность окажется успешной, будет вызван метод validate с payload, который является расшифрованным токеном.*/

  validate(payload: AuthJwtPayload) {
    //Объект payload создаётся в AuthService.generateTokens() перед подписанием токена и содержит userId.
    const userId = payload.sub;

    //Возвращаемый объект будет добавлен к request в виде свойства: request.user
    return this.authService.validateRefreshToken(userId);
  }
}
