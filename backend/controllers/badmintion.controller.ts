import { badmintonMatchDetails } from "../models/badminton-match-details.model";
import { GAMETYPE, MATCH_STATUS } from "../enum";
import { Mongoose, Schema, Types } from "mongoose";
import { Team } from "../models/team.model";

// @post badminton/create
export const createMatch = async (req, res) => {
    try {
        const {
            gameType, 
            sets, 
            gamePoints, 
            teamA, 
            teamB,
            user
        } = req.body;
        if(!gameType) {
            throw new Error("game type cannot be empty!");
        }
        if(!sets) {
            throw new Error("sets cannot be empty!");
        }
        if(!gamePoints) {
            throw new Error("Game points cannot be empty!");
        }
        if(!teamA || !teamA?.name || !teamA?.playerOne || (gameType == "Doubles" && !teamA?.playerTwo)) {
            throw new Error("teamA cannot have incomplete data!");
        }
        if(!teamB || !teamB?.name || !teamB?.playerOne || (gameType == "Doubles" && !teamB?.playerTwo)) {
            throw new Error("teamA cannot have incomplete data!");
        }

        const TeamA = await Team.create({
            ...teamA, 
            sets: [{
                score: 0, 
                serve: false
            }], 
        });

        const TeamB = await Team.create({
            ...teamB, 
            sets: [{
                score: 0, 
                serve: false
            }]
        })

        await badmintonMatchDetails.create({
            status: MATCH_STATUS.LIVE, 
            user: new Types.ObjectId(user),
            gameType, 
            date: new Date(), 
            totalSets: sets, 
            completedSets: 0, 
            summary: [], 
            teamA: TeamA._id, 
            teamB: TeamB._id
        });
        return res.json({ success: true, data: null });
    } catch (error) {
        return res.json({ success: false, error: error })
    }
}