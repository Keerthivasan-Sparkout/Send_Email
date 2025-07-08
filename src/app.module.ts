import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
                  load: [configuration],
                  isGlobal: true,
                  envFilePath: 'process.env'
                }),
            ConfigModule,
            MongooseModule.forRoot('mongodb://localhost/email'),
            EmailModule,
            UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
