import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import yandexOauthConfig from '../config/yandex-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    @Inject(yandexOauthConfig.KEY)
    private readonly yandexConfig: ConfigType<typeof yandexOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: yandexConfig.clientId,
      clientSecret: yandexConfig.clientSecret,
      callbackURL: yandexConfig.callbackUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (
      error: string | null,
      user: { email: string | null; name: string | null; id: number },
    ) => void,
  ) {
    const user = await this.authService.validateYandexUser({
      email: profile.emails[0].value,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      password: '',
    });

    delete user.password;

    //Данные пользователя будут добавлены в request.user
    done(null, user);
  }
}
