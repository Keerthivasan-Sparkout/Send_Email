import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailController } from "./email.controller";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('formail.host'),
                    port: configService.get<number>('formail.port'),
                    secure: false,
                    auth: {
                        user: configService.get<string>('formail.user'),
                        pass: configService.get<string>('formail.pass')
                    }
                },
                defaults: {
                    from: `No Reply <${configService.get('formail.user')}>`
                },
                template: {
                    dir: join(process.cwd(), 'src', 'email', 'temp'),
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true }
                }
            })
        })
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {

}

