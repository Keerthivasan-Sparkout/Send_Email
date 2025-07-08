import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./user.schema";
import { EmailModule } from "src/email/email.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }]), EmailModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }