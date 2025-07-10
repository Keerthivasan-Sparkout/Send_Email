import { Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { EmailService } from "./email.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/email")
export class EmailController {

    constructor(private emailService: EmailService) { }

    @Get("/:toemail")
    regiterEmail(@Param('toemail') toemail: string) {
        this.emailService.attachedHtmlAsPdf(toemail, null)
    }

    @Post()
    @UseInterceptors(FileInterceptor('newfile'))
    sendMailUsingExcel(@UploadedFile(
        new ParseFilePipe({
            validators:[
                new FileTypeValidator({fileType:'sheet'})
            ]
        })
    ) file: Express.Multer.File) {
        this.emailService.getEmailFromExcel(file)
    }

}