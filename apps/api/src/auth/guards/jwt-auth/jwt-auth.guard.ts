import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//Благодаря тому, что в конструктор AuthGuard передано значение 'jwt'
//JwtAuthGuard будет автоматически связан со стратегией (Strategy), импортируемой из пакета 'passport-jwt'
//т.е. JwtStrategy
export class JwtAuthGuard extends AuthGuard('jwt') {}
