import { Model, model, Schema } from 'mongoose'; 
import { GAMETYPE, SPORT, TOURNAMENT_STATUS } from '../enum';

interface ITournament {
    status: TOURNAMENT_STATUS.COMPLETED | TOURNAMENT_STATUS.LIVE, 
    sport: SPORT.BADMINTON | SPORT.TABLE_TENNIS, 
    gameType: GAMETYPE.SINGLES | GAMETYPE.DOUBLES,
    teams: Schema.Types.ObjectId[], 
    matches: Schema.Types.ObjectId[], 
    date: Date,
    user: Schema.Types.ObjectId
}

const tournamentSchema = new Schema<ITournament>({
    status: {
        type: Schema.Types.String, 
        enum: Object.values(TOURNAMENT_STATUS),
        required: true
    }, 
    sport: {
        type: Schema.Types.String, 
        enum: Object.values(SPORT),
        required: true
    },
    gameType: {
        type: Schema.Types.String, 
        enum: Object.values(GAMETYPE),
        required: true
    },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'Team',
        default: []
    }, 
    matches: {
        type: [Schema.Types.ObjectId], 
        ref: 'MatchDetails', 
        default: []
    },
    date: {
        type: Schema.Types.Date, 
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Tournament: Model<ITournament> = model<ITournament>('Tournament', tournamentSchema);