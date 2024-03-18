import { Model, Schema, model } from "mongoose"

export interface IUser {
    name: string, 
    email: string, 
    password: string 
}

const userSchema = new Schema<IUser>({
    name: {
        type: Schema.Types.String, 
        required: true
    }, 
    email: {
        type: Schema.Types.String, 
        required: true
    },
    password: {
        type: Schema.Types.String, 
        required: true
    }
})

export const User: Model<IUser> = model<IUser>('User', userSchema);