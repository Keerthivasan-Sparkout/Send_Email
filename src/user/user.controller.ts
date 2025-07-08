import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {

    constructor(private useerService: UserService) { }

    @Post()
    createNewUser(@Body() user: CreateUserDto) {
        return this.useerService.createuser(user)
    }
}