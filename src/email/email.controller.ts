import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { EmailService } from "./email.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/email")
export class EmailController {

    constructor(private emailService: EmailService) { }

    @Get("/:toemail")
    regiterEmail(@Param('toemail') toemail: string) {
        this.emailService.attachedHtmlAsPdf( toemail)
    }

    @Post()
    @UseInterceptors(FileInterceptor('newfile'))
    sendMailUsingExcel(@UploadedFile() file:Express.Multer.File){
        // console.log(file)
        this.emailService.getEmailFromExcel(file)
    }

}