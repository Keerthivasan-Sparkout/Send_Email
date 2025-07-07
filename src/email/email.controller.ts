import { Controller, Get, Param } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("/email")
export class EmailController{

    constructor(private emailService:EmailService){}

    @Get("/:toemail")
    regiterEmail(@Param('toemail') toemail:string){
        this.emailService.registerMail(toemail)
    }

}