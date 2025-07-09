import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as path from 'path';
import puppeteer from "puppeteer";
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as Excel from 'exceljs';
import { buffer } from "stream/consumers";


@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    async registerMail(email: string, name?: string) {
        await this.mailerService.sendMail({
            to: email,
            from: this.configService.get<string>('formail.user'),
            subject: "Register mail",
            template: 'salary',
            context: {
                name: name ? name : email.split('@')[0]
            },
        })
    }


    async sendMailWithFile(email: string) {
        await this.mailerService.sendMail({
            to: email,
            from: this.configService.get<string>('formail.user'),
            subject: 'Mail with File',
            html: `<h1> Hello buddy</h1>`,
            attachments: [
                {
                    path: path.join(process.cwd(), 'src', 'images', 'logo.png'),
                    filename: 'company-logo',
                    contentDisposition: 'attachment'
                }
            ]
        });
    }

    async convertHtmlToPdf(): Promise<Buffer> {
        const browser = await puppeteer.launch()
        const tab = await browser.newPage()
        const file = fs.readFileSync(path.join(process.cwd(), 'src', 'email', 'temp', 'salary.hbs'), 'utf-8');
        // const sourcefile = handlebars.compile(file)

        tab.setContent(file)
        const buffer = await tab.pdf({ format: 'A4', printBackground: true }) as Buffer;

        return buffer;
    }


    async attachedHtmlAsPdf(toemail: string) {
        this.mailerService.sendMail({
            to: toemail,
            from: this.configService.get<string>('formail.user'),
            subject: "salary mail",
            html: "<p> your salary has been crited </p>",
            attachments: [{
                content: await this.convertHtmlToPdf(),
                filename: 'salary slip.pdf',
                contentType: 'application/pdf'
            }]
        })
    }

    // async getEmailFromExcel(file: Express.Multer.File) {
    //     const workbook =await  Excel.read(file.buffer, { type: 'buffer' })
    //     const sheetName = workbook.SheetNames[0]
    //     const workSheet = workbook.Sheets[sheetName]
    //     const rows=await Excel.utils.sheet_to_json(workSheet);
    //     rows.forEach((row)=>{
    //         console.log(row)
    //     })
    // }

    async getEmailFromExcel(file: Express.Multer.File) {
        console.log("----------------")
        const workbook = new Excel.Workbook()
        const workSheet = await workbook.xlsx.load(file.buffer)
        const sheet=workSheet.getWorksheet(1);
        sheet?.eachRow(data =>{
        })
    }
}