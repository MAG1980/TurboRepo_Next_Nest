import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../constants';
import { Reflector } from '@nestjs/core';

@Injectable()
//Благодаря тому, что в конструктор AuthGuard передано значение 'jwt'
//JwtAuthGuard будет автоматически связан со стратегией (Strategy), импортируемой из пакета 'passport-jwt'
//т.е. JwtStrategy
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  //Если возвращает true, то предоставляется доступ к эндпойнту.
  //В противном случае - входящий запрос блокируется.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> | Promise<boolean> {
    //Получение метаданных эндпойнта или контроллера, связанных с ключом IS_PUBLIC_KEY
    //Возвращает первое не undefined значение.
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      //Для получения метаданных эндпойнта используется getHandler().
      //Для получения метаданных контроллера используется getClass().
      //В данном случае в первую очередь проверяются метаданные эндпойнта.
      [context.getHandler(), context.getClass()],
    );

    //Если в метаданных запроса указано, что он публичный, возвращаем true (предоставляем доступ).
    if (isPublic) {
      return isPublic;
    }
    //В противном случае передаём ему контекст выполнения и вызываем метод canActivate(context) класса-родителя (AuthGuard).
    return super.canActivate(context);
  }
}
