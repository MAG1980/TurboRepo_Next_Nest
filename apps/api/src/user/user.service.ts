import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    console.log(hashedPassword);
    return this.prismaService.users.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
    });
  }

  findById(userId: number) {
    return this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateHashedRefreshToken(
    id: number,
    hashedRefreshToken: string | null,
  ) {
    return this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }
}
