import { Injectable } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable()
//Связан с RefreshTokenStrategy по ей имени 'refresh-jwt'.
export class RefreshAuthGuard extends AuthGuard('refresh-jwt'){

}
