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
        const matches = await MatchDetails.find({ tournament: id }).populate('teamA teamB winner').sort({ matchNo: 1 }).lean();
        const result = matches.map((doc: any) => {
            if(doc.status == MATCH_STATUS.LIVE) {
                return {
                    date: doc.date,
                    status: doc.status,
                    totalSets: doc.totalSets,
                    teamA: {
                        name: doc.teamA.name,
                        score: doc.sets[doc.sets.length - 1].teamAScore
                    },
                    teamB: {
                        name: doc.teamB.name,
                        score: doc.sets[doc.sets.length - 1].teamBScore
                    },
                    currentSet: doc.sets.length,
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
                        score: doc.sets[doc.sets.length - 1].teamAScore,
                        winner: doc.sets[doc.sets.length - 1].winner.toString() == doc.teamA._id.toString()
                    },
                    teamB: {
                        name: doc.teamB.name,
                        score: doc.sets[doc.sets.length - 1].teamBScore,
                        winner: doc.sets[doc.sets.length - 1].winner.toString() == doc.teamB._id.toString()
                    },
                    matchNo: doc.matchNo,
                    winner: doc?.winner?.name,
                    currentSet: doc.sets.length,
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
        team = new Types.ObjectId(team);
        const match: any = await MatchDetails.findOne({ _id: matchId }).populate('teamA teamB').lean();
        const summary = `Serve holds by ${match.teamA._id == team ? match.teamA.name : match.teamB.name} Serve from right side of the court, ( ${match.teamA.name} - 0, ${match.teamB.name} - 0 )`
        await MatchDetails.updateOne({ _id: matchId }, {
            $set: {
                status: MATCH_STATUS.LIVE,
                summary: [[{ text: summary, date: new Date() }]],
                sets: [{
                    teamAScore: 0,
                    teamBScore: 0,
                    serve: team
                }],
            }
        });
        return res.json({ success: true, data: true });
    } catch (error) {
        return res.json({ success: false, error: error.message })
    }
}