import { Schema } from "mongoose";
import { Team } from "../models/team.model";
import { roundRobinSchedule } from "./helpers";
import { Tournament } from "../models/tournament.model";
import { TOURNAMENT_STATUS } from "../enum";
import { MatchDetails } from "../models/match-details.model";

/**
 * @Post - tournament/create
 * @desc - creates a tournament 
 */
export const createTournament = async (req, res) => {
    try {
        let { teams, sport, gameType, user, sets, gamePoints, scheduleType } = req.body;
        if(!teams.length || !sport || !gameType || !user || !sets || !gamePoints || !scheduleType) {
            throw new Error('Invalid Request!');
        }

        user = new Schema.Types.ObjectId(user); 

        let teamBulkWrite = []
        for(let doc of teams) {
            teamBulkWrite.push({
                insertOne: {
                    "document": {
                        ...doc,
                    }
                }
            })
        }
        
        const result = await Team.bulkWrite(teamBulkWrite);
        const createdTeams = Object.values(result.insertedIds);
        const createdMatches = await roundRobinSchedule(createdTeams, {
            sport, 
            user, 
            gameType, 
            sets, 
            gamePoints
        });

        const tournament = await Tournament.create({
            status: TOURNAMENT_STATUS.READY, 
            sport, 
            gameType, 
            teams: createdTeams, 
            matches: createdMatches, 
            date: new Date(), 
            user: user
        });

        await Team.updateMany({
            _id: { $in: createdTeams }
        }, {
            $set: {
                tournament: tournament._id
            }
        });

        await MatchDetails.updateMany({
            _id: { $in: createdMatches }
        }, {
            $set: {
                tournament: tournament._id
            }
        })

        return res.json({ success: true, data: true })

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}