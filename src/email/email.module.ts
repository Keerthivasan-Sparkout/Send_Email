import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailController } from "./email.controller";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";


@Module({
    imports: [MailerModule.forRoot({
        transport: {
            host: 'smtp.zoho.in',
            port: 587,
            secure: false,
            auth: {
                user: "no.reply@nilachains.com",
                pass: 'UC1fx2ULrUR8'
            }
        },
        defaults: {
            from: '"No Reply" <no.reply@nilachains.com>',
        },
        template: {
            dir:join(__dirname,'temp'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
        }
    })],
    controllers: [EmailController],
    providers: [EmailService]
})
export class EmailModule { }