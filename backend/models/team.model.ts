import { Model, Schema, model } from "mongoose"

export interface Sets {
    score: number, 
    server: boolean
}

export interface ITeam {
    name: string, 
    playerOne: string, 
    playerTwo: string, 
    sets: Sets[], 
    matchDetails: string
}

const teamSchema = new Schema<ITeam>({
    name: {
        type: Schema.Types.String, 
        required: true
    }, 
    playerOne: {
        type: Schema.Types.String, 
        required: true
    }, 
    playerTwo: {
        type: Schema.Types.String, 
        required: true
    }, 
    sets: [new Schema({
        score: {
            type: Schema.Types.Number,
            default: 0
        }, 
        serve: {
            type: Schema.Types.Boolean,
            default: false
        }
    })]
})

export const Team: Model<ITeam> = model<ITeam>('Team', teamSchema);