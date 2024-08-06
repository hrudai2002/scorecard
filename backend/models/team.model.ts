import { Model, Schema, model } from "mongoose"
export interface ITeam {
    name: string, 
    playerOne: string, 
    playerTwo: string, 
    tournament?: Schema.Types.ObjectId,
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
    tournament: {
        type: Schema.Types.ObjectId, 
        ref: 'Tournament'
    }
})

export const Team: Model<ITeam> = model<ITeam>('Team', teamSchema);