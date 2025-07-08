import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {

    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    mobile: number;

}

export const userSchema = SchemaFactory.createForClass(User)