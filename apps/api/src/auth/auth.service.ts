import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';
import { AuthJwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    //Внедрение экземпляра объекта конфигурации с помощью токена refreshConfig.KEY(namespace="refresh-jwt")
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    //Создание нового пользователя
    //В случае успешной регистрации возвращаем данные пользователя
    //Ни в коем случае не возвращаем пароль после успешной регистрации
    //Т.к. данные пользователя в итоге будут добавлены к request
    //TODO: исключить возможность возвращения даже хешированного пароля
    return await this.userService.create(createUserDto);
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
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      //В AuthModule был зарегистрирован JwtModule с jwtConfig в качестве провайдера,
      //содержащий signOptions.expiresIn, поэтому повторная передача свойства expiresIn не требуется,
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    //Возвращаем access token
    //В случае успешной аутентификации возвращаем данные пользователя
    //Ни в коем случае не возвращаем пароль после успешной аутентификации
    //Т.к. данные пользователя в итоге будут добавлены к request
    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      //Пользователь не найден, но сообщать об этом не следует в целях повышения безопасности
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id };
  }

  /**
   * Временная реализация, до тех пор, пока не будет реализован отзыв токена при logout.
   * @param userId
   */
  async validateRefreshToken(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      //Пользователь не найден, но сообщать об этом не следует в целях повышения безопасности
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id };
  }

  //Генерация новых JWT-токенов (refreshToken и accessToken)
  async refreshToken(userId: number, name?: string) {
    //ToDo: Реализовать отзыв токена
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    //Проверка на существование пользователя в БД
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) {
      return user;
    }
    //Создаём и возвращаем нового пользователя, если он не был найден в БД
    return this.userService.create(googleUser);
  }
}
