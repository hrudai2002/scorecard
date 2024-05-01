
import { GAMETYPE, MATCH_STATUS } from "../enum";
import { model, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IBadmintonMatchDetails {
    status: MATCH_STATUS.LIVE | MATCH_STATUS.COMPLETED, 
    user:  Schema.Types.ObjectId | IUser, 
    gameType: GAMETYPE.SINGLES | GAMETYPE.DOUBLES, 
    date: Date, 
    totalSets: number, 
    completedSets: number, 
    summary: { text: string, date: Date }[], 
    teamA: Schema.Types.ObjectId, 
    teamB: Schema.Types.ObjectId
}

const badmintonMatchDetailsSchema = new Schema<IBadmintonMatchDetails>({ 
    status: {
        type: Schema.Types.String,
        enum: Object.values(MATCH_STATUS),
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User'
    }, 
    gameType: {
        type: Schema.Types.String, 
        enum: Object.values(GAMETYPE), 
        required: true,
    }, 
    date: {
        type: Schema.Types.Date, 
        required: true
    }, 
    totalSets: {
        type: Schema.Types.Number, 
        required: true
    }, 
    completedSets: {
        type: Schema.Types.Number, 
        required: true
    }, 
    summary: [new Schema({
       text: {
         type: Schema.Types.String, 
         required: true
       },
       date: {
         type: Schema.Types.Date,
         required: true
       }
    })],
    teamA: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'Team'
    },
    teamB: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'Team'
    }
 });

 badmintonMatchDetailsSchema.index({
    teamA: 1, 
    teamB: 1
 }, {unique: true})

export const BadmintonMatchDetails: Model<IBadmintonMatchDetails> = model<IBadmintonMatchDetails>('BadmintonMatchDetails', badmintonMatchDetailsSchema);

