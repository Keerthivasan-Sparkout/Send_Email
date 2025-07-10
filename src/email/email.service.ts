import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as path from 'path';
import puppeteer from "puppeteer";
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as Excel from 'xlsx';


@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    async registerMail(email: string, name?: string) {
        await this.mailerService.sendMail({
            to: email,
            from: this.configService.get<string>('formail.user'),
            subject: "Register mail",
            template: 'hello',
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
            html: `<h1> Hello </h1>`,
            attachments: [
                {
                    path: path.join(process.cwd(), 'src', 'images', 'logo.png'),
                    filename: 'company-logo',
                    contentDisposition: 'attachment'
                }
            ]
        });
    }

    async convertHtmlToPdf(user: any): Promise<Buffer> {
        const browser = await puppeteer.launch()
        const tab = await browser.newPage()
        const file = fs.readFileSync(path.join(process.cwd(), 'src', 'email', 'temp', 'salary.hbs'), 'utf-8');
        const sourcefile = handlebars.compile(file)
        tab.setContent(sourcefile(this.generateSalaryObject(user)))
        const buffer = await tab.pdf({ format: 'A4', printBackground: true }) as Buffer;
        return buffer;
    }

    generateSalaryObject(user: any) {
        return ({
            empId: user["empId"],
            name: user["name "],
            designation: user["Designation"],
            dateOfJoining: user["Date of joining"],
            monthYear: user["month/year"],
            noOfDays: user["no of days"],
            basicPay: user["Basic Pay"],
            Hra: user["HRA"],
            conveyance: user["Conveyance"],
            foodAllowance: user["Food Allowance"],
            eductaionAllowance: user["Educational Allowance"],
            specialAllowance: user["Special Allowance"],
            performanceBonus: user["Performance Bonus"],
            overtimePay: user["Overtime Pay"],
            totalEarning: user["Total earning"],
            epf: user["EPF"],
            esi: user["ESI"],
            tds: user["TDS"],
            professionalTax: user["Proffessional Tax"],
            lossOfPay: user["Loss of Pay"],
            salaryAdvance: user["salary in Advance"],
            otherDeduction: user["other deduction"],
            healthInsurance: user["Health Insurance"],
            totalDeduction: user["Total Deduction"],
            rupees: user["Rupees"],
            inword: user["In word"]

        })
    }


    async attachedHtmlAsPdf(toemail: string, user: any) {
        await this.mailerService.sendMail({
            to: toemail,
            from: this.configService.get<string>('formail.user'),
            subject: "salary mail",
            html: "<p> your salary has been crited </p>",
            attachments: [{
                content: await this.convertHtmlToPdf(user),
                filename: 'salary slip.pdf',
                contentType: 'application/pdf'
            }]
        })
    }


    async getEmailFromExcel(file: Express.Multer.File) {
        if (file) {
            const workbook = await Excel.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[1];
            const workSheet = workbook.Sheets[sheetName];
            const rows = Excel.utils.sheet_to_json(workSheet, { raw: false });
            if(rows.length===0){
                throw new Error("this sheet does't contain rows")
            }
            rows.forEach(async row => { row? await this.attachedHtmlAsPdf(row['email'],row):null
            })
        } else {
            throw new handlebars.Exception("File is missing")
        }

    }

}