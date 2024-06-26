import { Model, Schema, model } from "mongoose"

export interface Sets {
    score: number, 
    serve: boolean, 
    winner?: boolean
}

export interface ITeam {
    name: string, 
    playerOne: string, 
    playerTwo: string, 
    sets: Sets[],
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
    }, 
    sets: [new Schema({
        score: {
            type: Schema.Types.Number,
            default: 0
        }, 
        serve: {
            type: Schema.Types.Boolean,
            default: false
        },
        winner: {
            type: Schema.Types.Boolean
        }
    })]
})

export const Team: Model<ITeam> = model<ITeam>('Team', teamSchema);