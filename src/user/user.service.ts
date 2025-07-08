import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { EmailService } from "src/email/email.service";
import { CreateUserDto } from "./user.dto";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>, private emailService: EmailService) { }

    createuser(user: CreateUserDto) {
        const newUser = user;
        if (this.findUser(user.email) !== null) {
            return " the user already exits"
        } else {
            this.userModel.insertOne(newUser)
                .then(user => this.emailService.registerMail(user.email, user.name))
                .catch(err => { throw new UnauthorizedException(err.message) })
        }
    }

    findUser(mail: string) {
        return this.userModel.findOne({ email: mail })
    }

}