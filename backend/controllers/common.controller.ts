import { MatchDetails } from "../models/match-details.model";
import { MATCH_STATUS, SPORT, Team as TeamEnum, TOURNAMENT_STATUS } from "../enum";
import { Types } from "mongoose";
import { Team } from "../models/team.model";
import { Tournament } from "../models/tournament.model";

const twentyOnePointsMatchMaxScore = 30, 
      elevenPointsMatchMaxScore = 16, 
      matchGamePoint = 21;

/** 
 * @Get - badminton/live
 * @desc - get all live matches
 */
export const getLiveMatches = async (req, res) => {
    try {
        let { user, limit, sport } = req.query;
        if (!user || !limit || !sport) {
            throw new Error("Invalid Request");
        }
        user = new Types.ObjectId(user);
        limit = (limit == 'true') ? true : false;
        let matches = [];
        if(limit) {
            matches = await MatchDetails.find({
                status: MATCH_STATUS.LIVE, 
                sport,
                user, 
                tournament: {$exists: false}
            }).populate('teamA teamB').limit(5).lean();
        } else {
            matches = await MatchDetails.find({
                status: MATCH_STATUS.LIVE,
                sport,
                user,
                tournament: { $exists: false }
            }).populate('teamA teamB').sort({ _id: -1 }).lean();
        }

        const result = matches.map((doc: any) => ({
            date: doc.date, 
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
        }))

        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/** 
 * @Get - badminton/finished
 * @desc - get all finished matches
 */
export const getFinishedMatches = async (req, res) => {
    try {
        let { user, limit, sport } = req.query; 
        if(!user || !limit || !sport) {
            throw new Error("Invalid Request"); 
        }

        user = new Types.ObjectId(user);
        limit =  (limit == 'true') ? true : false;
        let matches = [];
        if(limit) {
            matches = await MatchDetails.find({
                status: MATCH_STATUS.COMPLETED,
                sport,
                user, 
                tournament: { $exists: false }
            }).populate('teamA teamB winner').limit(5).lean();
        } else {
            matches = await MatchDetails.find({
                status: MATCH_STATUS.COMPLETED,
                sport,
                user,
                tournament: { $exists: false }
            }).populate('teamA teamB winner').sort({ _id: -1 })
        }

        const result = matches.map((doc: any) => ({
            date: doc.date,
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
        })); 

        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Get - badminton/:id 
 * @desc - get particular badminton match details
 */
export const getMatchDetails = async (req, res) => {
    try {
        let { matchId } = req.params; 
        if(!matchId) {
            throw new Error("Invalid Request!");
        }
        matchId = new Types.ObjectId(matchId);
        const result: any = await MatchDetails.findOne({ _id: matchId })
                                                       .populate('teamA teamB winner').lean();
        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Get - badminton/teams/:id 
 * @desc - get team details
 */
export const getMatchTeamDetails = async (req, res) => {
    try {
        let { matchId } = req.params; 
        if(!matchId) {
            throw new Error('Invalid Request!');
        }
        matchId = new Types.ObjectId(matchId); 
        const badmintonDoc = await MatchDetails.findOne({ _id: matchId }).populate('teamA teamB').lean(); 
        const result = {
            teamA: badmintonDoc.teamA, 
            teamB: badmintonDoc.teamB
        }
        return res.json({ success: true, data: result  });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Get - badminton/summary
 * @desc - get match summary
 */
export const getMatchSummary = async (req, res) => {
    try {
        let { matchId } = req.params;
        if(!matchId) {
            throw new Error('Invalid Request!');
        }
        matchId = new Types.ObjectId(matchId); 
        const result = await MatchDetails.findById(matchId).lean();
        const data = result.summary.map((doc) => doc.reverse());

        return res.json({ success: true, data });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

/**
 * @Post - badminton/create 
 * @desc - creates a match
 */
export const createMatch = async (req, res) => {
    try {
        const { gameType, sportType, sets, gamePoints, serveFirst, teamA, teamB, user } = req.body;

        if (!gameType || !sportType || !sets || !gamePoints || !serveFirst  || !teamA || !teamB || !teamA?.name || !teamA?.playerOne || 
            (gameType == "Doubles" && !teamA?.playerTwo) || !teamB || !teamB?.name || !teamB?.playerOne || (gameType == "Doubles" && !teamB?.playerTwo) 
        ) { throw new Error("Invalid Request!") }

        if(teamA.name == teamB.name) {
            throw new Error("Team Name should be unique");
        }
 
        const TeamA = await Team.create(teamA);
        const TeamB = await Team.create(teamB);
        
        const name = serveFirst == TeamEnum.TEAM_A ? TeamA.name : TeamB.name;
        const summary = `Serve holds by ${name}, Serve from right side of the court, ( ${TeamA.name} - 0, ${TeamB.name} - 0 )`

        const count = await MatchDetails.find({  status: MATCH_STATUS.LIVE, sport: sportType, user: new Types.ObjectId(user) }).countDocuments();

        await MatchDetails.create({
            status: MATCH_STATUS.LIVE, 
            sport: sportType,
            user: new Types.ObjectId(user),
            gameType, 
            date: new Date(), 
            matchNo: count + 1,
            totalSets: sets, 
            completedSets: 0, 
            gamePoint: gamePoints,
            sets: [{
                teamAScore: 0,
                teamBScore: 0, 
                serve: serveFirst == TeamEnum.TEAM_A ? TeamA._id : TeamB._id
            }], 
            summary: [[{ text: summary, date: new Date() }]], 
            serveFirst: serveFirst == TeamEnum.TEAM_A ? TeamA._id : TeamB._id,
            teamA: TeamA._id, 
            teamB: TeamB._id
        });
        return res.json({ success: true, data: true });
    } catch (error) {
        return res.json({ success: false, error: error.message })
    }
}

/**
 * @Put - badminton/update/score
 * @desc - updates score
 */
export const updateScore = async (req, res) => {
    try {
        let { matchId, teamAScore, teamBScore, whoScored } = req.body;
        if(!matchId || teamAScore == undefined || teamBScore == undefined || whoScored == undefined) {
            throw new Error('Invalid Request!');
        }
        matchId = new Types.ObjectId(matchId); 

        if(teamAScore < 0 || teamBScore < 0) {
            throw new Error('Score cannot be negative!');
        }

        const matchDetails = await MatchDetails.findOne({ _id: matchId }); 
        const teamA = await Team.findOne({ _id: matchDetails.teamA }); 
        const teamB = await Team.findOne({ _id: matchDetails.teamB }); 
        const gamePoint = matchDetails.gamePoint;
        const maximumScore = gamePoint == matchGamePoint ? twentyOnePointsMatchMaxScore : elevenPointsMatchMaxScore;

        matchDetails.sets[matchDetails.completedSets].teamAScore = teamAScore;
        matchDetails.sets[matchDetails.completedSets].teamBScore = teamBScore;
        
        if(whoScored) {
            matchDetails.sets[matchDetails.completedSets].serve = (whoScored == TeamEnum.TEAM_A) ? matchDetails.teamA : matchDetails.teamB; 
            if (
                (teamAScore == maximumScore || teamBScore == maximumScore) || 
                ((teamAScore >= gamePoint || teamBScore >= gamePoint) && Math.abs(teamAScore - teamBScore) > 1) 
            ) { 
                // set completed
                const winningTeam = teamAScore > teamBScore ? teamA.name : teamB.name;
                if (matchDetails.completedSets < matchDetails.totalSets - 1) {
                    matchDetails.sets.push({ teamAScore: 0, teamBScore: 0 });
                    matchDetails.summary.push([{ text: `Serve holds by ${winningTeam}, Serve from right side of the court, ( ${teamA.name} - 0, ${teamB.name} - 0 )`, date: new Date() }])
                }
                matchDetails.summary[matchDetails.completedSets].push({ text: `Set-${matchDetails.completedSets + 1} won by ${winningTeam} 🎉`, date: new Date() });
                matchDetails.sets[matchDetails.completedSets].winner = teamAScore > teamBScore ? matchDetails.teamA: matchDetails.teamB;
                matchDetails.completedSets += 1;
            } 
    
            else {
                let summaryText; 
                if (matchDetails.sets[matchDetails.completedSets].serve.toString() == matchDetails.teamA.toString()) {
                    if (matchDetails.sets[matchDetails.completedSets].teamAScore % 2) {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamA.name} scores a point, Serve holds by ${teamA.name}, Serve from left side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    } else {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamA.name} scores a point, Serve holds by ${teamA.name}, Serve from right side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    }
                } else {
                    if (matchDetails.sets[matchDetails.completedSets].teamBScore % 2) {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamB.name} scores a point Serve holds by ${teamB.name}, Serve from left side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    } else {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamB.name} scores a point, Serve holds by ${teamB.name}, Serve from right side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    }
                }
                matchDetails.summary[matchDetails.completedSets].push({
                    text: summaryText, 
                    date: new Date()
                })
            }
    
            if(matchDetails.completedSets == matchDetails.totalSets) {
                const teamASetWinsCount = matchDetails.sets.reduce((acc, curr) => acc + (curr.winner.toString() == matchDetails.teamA.toString() ? 1 : 0), 0);
                const teamBSetWinsCount = matchDetails.sets.reduce((acc, curr) => acc + (curr.winner.toString() == matchDetails.teamB.toString() ? 1 : 0), 0);
                matchDetails.status = MATCH_STATUS.COMPLETED;
                matchDetails.winner = teamASetWinsCount > teamBSetWinsCount ? matchDetails.teamA : matchDetails.teamB;
            }
        }

        await teamA.save();
        await teamB.save();
        await matchDetails.save();

        const result = await MatchDetails.findOne({ _id: matchDetails._id }).populate('teamA teamB').lean();

        if(matchDetails?.tournament && matchDetails.status == MATCH_STATUS.COMPLETED) {
            // move next match from not started to ready 
            const nextMatch = await MatchDetails.findOne({ 
                tournament: matchDetails.tournament, 
                status: MATCH_STATUS.NOT_STARTED
            }).sort({ matchNo: 1 }); 

            if(nextMatch) {
                nextMatch.status = MATCH_STATUS.READY;
                await nextMatch.save();
            } else {
                const tournament = await Tournament.findOne({ _id: matchDetails.tournament });
                tournament.status = TOURNAMENT_STATUS.COMPLETED;
                await tournament.save();
            }

        }

        return res.json({ success: true, data: result });

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

