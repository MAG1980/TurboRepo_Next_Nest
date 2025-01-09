import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      //Получать токен из AuthBearer-заголовка запроса
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      //Подтверждение секретного ключа JWT
      secretOrKey: jwtConfiguration.secret,
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

    //Возвращаемый объект будет добавлен к request
    return this.authService.validateJwtUser(userId);
  }
}
