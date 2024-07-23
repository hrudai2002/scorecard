import { Schema, Types } from "mongoose";
import { MATCH_STATUS } from "../../enum";
import { MatchDetails } from "../../models/match-details.model";

export const roundRobinSchedule = async (
 teams: Schema.Types.ObjectId[],
 matchDetails: {
    sport: string, 
    user: Types.ObjectId, 
    gameType: string,
    sets: number, 
    gamePoints: number
 }
) => {
    let matchesBulkWrite = [], matchNo = 1;
    for(let t1 = 0; t1 < teams.length; ++t1) {
        for(let t2 = t1 + 1; t2 < teams.length; ++t2) {
            matchesBulkWrite.push({
                insertOne: {
                    'document': {
                        status: MATCH_STATUS.NOT_STARTED, 
                        sport: matchDetails.sport, 
                        user: matchDetails.user, 
                        gameType: matchDetails.gameType,
                        totalSets: Number(matchDetails.sets), 
                        completedSets: 0,
                        gamePoint: Number(matchDetails.gamePoints), 
                        teamA: teams[t1], 
                        teamB: teams[t2], 
                        matchNo: matchNo++
                    }
                }
            })
        }
    }

    // shuffle matches 
    for(let i = matchesBulkWrite.length - 1; i > 0; --i) {
        let j = Math.floor(Math.random() * (i + 1));
        [matchesBulkWrite[i], matchesBulkWrite[j]] = [matchesBulkWrite[j], matchesBulkWrite[i]];
    }

    matchesBulkWrite = matchesBulkWrite.map((doc) => ({
        insertOne: {
            'document': {
                ...doc.insertOne.document, 
                date: new Date()
            }
        }
    }))

    const result = await MatchDetails.bulkWrite(matchesBulkWrite); 
    const createdIds = Object.values(result.insertedIds); 

    const firstMatch = await MatchDetails.findOne({ _id: { $in: createdIds } }).sort({ date: 1 }); 
    firstMatch.status = MATCH_STATUS.READY;
    await firstMatch.save();

    return createdIds;
}