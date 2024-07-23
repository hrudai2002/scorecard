import { Types } from "mongoose";
import { Team } from "../models/team.model";
import { roundRobinSchedule } from "./helpers";
import { Tournament } from "../models/tournament.model";
import { MATCH_STATUS, TOURNAMENT_STATUS } from "../enum";
import { MatchDetails } from "../models/match-details.model";

/**
 * @Get - tournament
 * @desc - get all the tournaments
 */
export const getAllTournaments = async (req, res) => {
    try {
        let { user } = req.query; 
        if(!user) {
            throw new Error('Invalid Request!');
        }
        user = new Types.ObjectId(user);
        const allTournamentsData = await Tournament.find({ user }).lean();
        return res.json({ success: true, data: allTournamentsData });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Get - tournament/:id
 * @desc - get all the tournament matches
 */
export const getTournamentMatches = async (req, res) => {
    try {
        let { user } = req.query; 
        let { id } = req.params; 
        if(!user || !id) {
            throw new Error('Invalid Request!');
        }
        user = new Types.ObjectId(user); 
        const matches = await MatchDetails.find({ tournament: id }).populate('teamA teamB').sort({ matchNo: 1 }).lean();
        const result = matches.map((doc: any) => {
            if(doc.status == MATCH_STATUS.LIVE) {
                return {
                    date: doc.date,
                    status: doc.status,
                    totalSets: doc.totalSets,
                    teamA: {
                        name: doc.teamA.name,
                        score: doc.teamA.sets[doc.teamA.sets.length - 1].score
                    },
                    teamB: {
                        name: doc.teamB.name,
                        score: doc.teamB.sets[doc.teamB.sets.length - 1].score
                    },
                    currentSet: doc.teamA.sets.length,
                    matchType: doc.gameType,
                    matchNo: doc.matchNo,
                    _id: doc._id
                }
            } else if(doc.status == MATCH_STATUS.COMPLETED) {
                return {
                    date: doc.date,
                    status: doc.status,
                    totalSets: doc.totalSets,
                    teamA: {
                        name: doc.teamA.name,
                        score: doc.teamA.sets[doc.teamA.sets.length - 1].score,
                        winner: doc.teamA.sets[doc.teamA.sets.length - 1].winner
                    },
                    teamB: {
                        name: doc.teamB.name,
                        score: doc.teamB.sets[doc.teamB.sets.length - 1].score,
                        winner: doc.teamB.sets[doc.teamB.sets.length - 1].winner
                    },
                    matchNo: doc.matchNo,
                    winner: doc?.winner?.name,
                    currentSet: doc.teamA.sets.length,
                    matchType: doc.gameType,
                    _id: doc._id
                }
            } else  {
                return {
                    date: doc.date, 
                    status: doc.status,
                    teamA: doc.teamA, 
                    teamB: doc.teamB, 
                    matchNo: doc.matchNo,
                    matchType: doc.gameType, 
                    _id: doc._id
                }
            }
        })
        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Post - tournament/create
 * @desc - creates a tournament 
 */
export const createTournament = async (req, res) => {
    try {
        let { teams, name, sport, gameType, user, sets, gamePoints, scheduleType } = req.body;
        if(!teams.length || !sport || !name || !gameType || !user || !sets || !gamePoints || !scheduleType) {
            throw new Error('Invalid Request!');
        }

        user = new Types.ObjectId(user); 

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
            status: TOURNAMENT_STATUS.LIVE, 
            name,
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

/**
 * @Put - tournament/movetolive
 * @desc - moves the match from ready to live
 */
export const moveMatchToLive = async (req, res) => {
    try {
        let { matchId, team } = req.body;
        if(!matchId || !team) {
            throw new Error('Invalid Request!');
        }
        const match = await MatchDetails.findOne({ _id: matchId }).lean();
        await MatchDetails.updateOne({ _id: matchId }, {
            $set: {
                status: MATCH_STATUS.LIVE
            }
        });
        await Team.updateOne({ _id: match.teamA }, {
            $set: {
                sets: [{
                    score: 0,
                    serve: team == match.teamA ? true : false
                }],
            }
        });
        await Team.updateOne({ _id: match.teamB }, {
            $set: {
                sets: [{
                    score: 0,
                    serve: team == match.teamB ? true : false
                }],
            }
        });
    } catch (error) {
        return res.json({ success: false, error: error.message })
    }
}