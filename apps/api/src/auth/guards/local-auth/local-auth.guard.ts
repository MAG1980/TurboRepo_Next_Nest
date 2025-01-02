import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//Благодаря тому, что в конструктор AuthGuard передано значение 'local'
//LocalAuthGuard будет автоматически связан со стратегией (Strategy), импортируемой из пакета 'passport-local'
//т.е. LocalStrategy
export class LocalAuthGuard extends AuthGuard('local') {}
