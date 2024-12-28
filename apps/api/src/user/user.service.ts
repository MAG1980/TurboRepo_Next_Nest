import { Injectable } from '@nestjs/common';
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { hash } from "argon2";


@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    const { password, ...user } = createUserDto
    const hashedPassword = await hash(password)
    console.log(hashedPassword)
    return this.prismaService.users.create({
      data: {
        ...user,
        password: hashedPassword
      }
    })
  }

  findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email
      }
    })
  }
}
