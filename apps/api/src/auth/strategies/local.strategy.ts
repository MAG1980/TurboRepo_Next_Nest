import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    //Передаем в конструктор PassportStrategy объект с настройками
    super({
      //Указываем, что мы будем использовать свойство email в качестве логина
      usernameField: 'email',
      //Если в качестве пароля мы будем использовать свойство с другим именем, необходимо это указать.
      //passwordField: 'password',
    });
  }

  //LocalStrategy.validate вызывается при каждом запросе AuthGuard.
  //В случае успешной проверки соответствия пароля и логина, возвращается объект пользователя,
  //который передается в AuthGuard и добавляется к объекту запроса в виде свойства:  request.user
  async validate(email: string, password: string) {
    return await this.authService.validateLocalUser(email, password);
  }
}
