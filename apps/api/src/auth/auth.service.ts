import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import { bigintStringify } from "../../helpers/bigint.stringify";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

 async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email)

    if (user) {
      console.log(user)
      throw new ConflictException('User already exists')
    }

    const createdUser = await this.userService.create(createUserDto)
    return bigintStringify(createdUser)
  }
}
