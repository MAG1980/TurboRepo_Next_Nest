import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //Внедрение экземпляра объекта конфигурации с помощью токена jwtConfig.KEY
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      //Получать токен из AuthBearer-заголовка запроса
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //Секретный JWT-ключ для валидации полученных данных
      //Получение секретного ключа с помощью экземпляра объекта конфигурации
      // secretOrKey: jwtConfiguration.secret,
      secretOrKey: configService.get<typeof jwtConfig>('jwt.secret'),
      //Запретить использование просроченного токена
      ignoreExpiration: false,
    });
    //Получение JWT-secret с помощью пространства имён (токена), переданного в метод registerAs() '@nestjs/config', возвращающий объект конфигурации.
    console.log({ secret: configService.get<string>('jwt.secret') });
    //Получение секретного ключа с помощью экземпляра объекта конфигурации
    console.log({ jwtConfiguration });
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
