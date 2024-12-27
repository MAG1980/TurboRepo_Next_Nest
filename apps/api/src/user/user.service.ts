import { Injectable } from '@nestjs/common';
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {
  }
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return 'This action adds a new user';
  }

  findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email
      }
    })
  }
}
