import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { bigintStringify } from '../../helpers/bigint.stringify';
import { verify } from 'argon2';
import { AuthJwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      console.log(user);
      throw new ConflictException('User already exists');
    }

    const createdUser = await this.userService.create(createUserDto);
    return bigintStringify(createdUser);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      //В целях повышения безопасности в тексте ошибки нежелательно сообщать о причине, по которой аутентификация провалилась
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //В случае успешной аутентификации возвращаем данные пользователя
    //Ни в коем случае не возвращаем пароль после успешной аутентификации
    //Т.к. данные пользователя в итоге будут добавлены к request
    return { id: user.id, name: user.name };
  }

  async login(userId: number, name?: string) {
    const { accessToken } = await this.generateTokens(bigintStringify(userId));

    return {
      //В БД request.user.id определен как bigint
      //bigintStringify преобразует bigint в строку, т.к. JS этого не умеет
      id: bigintStringify(userId),
      name,
      accessToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken] = await Promise.all([
      //В AuthModule был зарегистрирован JwtModule с jwtConfig в качестве провайдера,
      //содержащий signOptions.expiresIn, поэтому повторная передача свойства expiresIn не требуется,
      this.jwtService.signAsync(payload),
    ]);

    //Возвращаем access token
    //В случае успешной аутентификации возвращаем данные пользователя
    //Ни в коем случае не возвращаем пароль после успешной аутентификации
    //Т.к. данные пользователя в итоге будут добавлены к request
    return { accessToken };
  }
}
