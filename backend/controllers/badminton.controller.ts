import { BadmintonMatchDetails } from "../models/badminton-match-details.model";
import { MATCH_STATUS, Team as TeamEnum } from "../enum";
import { Types } from "mongoose";
import { Team } from "../models/team.model";


// @get badminton/live
export const getLiveMatches = async (req, res) => {
    try {
        let { user, limit } = req.query;
        if (!user || !limit) {
            throw new Error("Invalid Request");
        }
        user = new Types.ObjectId(user);
        limit = (limit == 'true') ? true : false;
        let matches = [];
        if(limit) {
            matches = await BadmintonMatchDetails.find({
                status: MATCH_STATUS.LIVE, 
                user
            }).populate('teamA teamB').limit(5);
        } else {
            matches = await BadmintonMatchDetails.find({
                status: MATCH_STATUS.LIVE,
                user
            }).populate('teamA teamB').sort({ _id: -1 })
        }

        const result = matches.map((doc: any) => ({
            date: doc.date, 
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
        }))

        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// @get badminton/finished 
export const getFinishedMatches = async (req, res) => {
    try {
        let { user, limit } = req.query; 
        if(!user || !limit) {
            throw new Error("Invalid Request"); 
        }

        user = new Types.ObjectId(user);
        limit =  (limit == 'true') ? true : false;
        let matches = [];
        if(limit) {
            matches = await BadmintonMatchDetails.find({
                status: MATCH_STATUS.COMPLETED,
                user
            }).populate('teamA teamB winner').limit(5).lean();
        } else {
            matches = await BadmintonMatchDetails.find({
                status: MATCH_STATUS.COMPLETED,
                user
            }).populate('teamA teamB winner').sort({ _id: -1 })
        }

        const result = matches.map((doc: any) => ({
            date: doc.date,
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
        })); 

        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// @get badminton/:id
export const getMatchDetails = async (req, res) => {
    try {
        let { matchId } = req.params; 
        if(!matchId) {
            throw new Error("Invalid Request!");
        }
        matchId = new Types.ObjectId(matchId);
        const result: any = await BadmintonMatchDetails.findOne({ _id: matchId })
                                                       .populate('teamA teamB winner').lean();
        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}


// @get badminton/summary
export const getMatchSummary = async (req, res) => {
    try {
        let { matchId } = req.params;
        if(!matchId) {
            throw new Error('Invalid Request!');
        }
        matchId = new Types.ObjectId(matchId); 
        const result = await BadmintonMatchDetails.findById(matchId).lean();
        const data = result.summary.map((doc) => doc.reverse());

        return res.json({ success: true, data });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// @post badminton/create
export const createMatch = async (req, res) => {
    try {
        const { gameType, sets, gamePoints, serveFirst, teamA, teamB, user } = req.body;

        if (!gameType || !sets || !gamePoints || !serveFirst  || !teamA || !teamB || !teamA?.name || !teamA?.playerOne || (gameType == "Doubles" && !teamA?.playerTwo) || !teamB || !teamB?.name || !teamB?.playerOne || (gameType == "Doubles" && !teamB?.playerTwo) ) {
            throw new Error("Invalid Request!");
        }

        const TeamA = await Team.create({
            ...teamA, 
            sets: [{
                score: 0, 
                serve: serveFirst == TeamEnum.TEAM_A ? true : false
            }], 
        });

        const TeamB = await Team.create({
            ...teamB, 
            sets: [{
                score: 0, 
                serve: serveFirst == TeamEnum.TEAM_A ? false : true
            }]
        })
        
        const name = serveFirst == TeamEnum.TEAM_A ? TeamA.name : TeamB.name;
        const summary = `Serve holds by ${name}, Serve from right side of the court, ( ${TeamA.name} - 0, ${TeamB.name} - 0 )`

        const count = await BadmintonMatchDetails.find({  status: MATCH_STATUS.LIVE, user: new Types.ObjectId(user) }).countDocuments();

        await BadmintonMatchDetails.create({
            status: MATCH_STATUS.LIVE, 
            user: new Types.ObjectId(user),
            gameType, 
            date: new Date(), 
            matchNo: count + 1,
            totalSets: sets, 
            completedSets: 0, 
            gamePoint: gamePoints,
            summary: [[{ text: summary, date: new Date() }]], 
            serveFirst: serveFirst == TeamEnum.TEAM_A ? TeamA._id : TeamB._id,
            teamA: TeamA._id, 
            teamB: TeamB._id
        });
        return res.json({ success: true, data: null });
    } catch (error) {
        return res.json({ success: false, error: error.message })
    }
}

// @put badminton/update/score
export const updateScore = async (req, res) => {
    try {
        let { matchId, teamAScore, teamBScore, whoScored } = req.body;
        if(!matchId || teamAScore == undefined || !teamBScore == undefined || whoScored == undefined) {
            throw new Error('Invalid Request!');
        }
        matchId = new Types.ObjectId(matchId); 

        if(teamAScore < 0 || teamBScore < 0) {
            throw new Error('Score cannot be negative!');
        }

        const matchDetails = await BadmintonMatchDetails.findOne({ _id: matchId }); 
        const teamA = await Team.findOne({ _id: matchDetails.teamA }); 
        const teamB = await Team.findOne({ _id: matchDetails.teamB }); 
        const gamePoint = matchDetails.gamePoint;
        const maximumScore = gamePoint == 21 ? 30 : 16;

        teamA.sets[matchDetails.completedSets].score = teamAScore; 
        teamB.sets[matchDetails.completedSets].score = teamBScore; 
        
        if(whoScored) {
            
            teamA.sets[matchDetails.completedSets].serve = (whoScored == TeamEnum.TEAM_A) ? true : false; 
            teamB.sets[matchDetails.completedSets].serve = (whoScored == TeamEnum.TEAM_A) ? false : true;

            if (
                (teamAScore == maximumScore || teamBScore == maximumScore) || 
                ((teamAScore >= gamePoint || teamBScore >= gamePoint) && Math.abs(teamAScore - teamBScore) > 1) 
            ) { 
                // set completed
                const winningTeam = teamAScore > teamBScore ? teamA.name : teamB.name;
                if (matchDetails.completedSets < matchDetails.totalSets - 1) {
                    teamA.sets.push({ score: 0, serve: false });
                    teamB.sets.push({ score: 0, serve: false });
                    matchDetails.summary.push([{ text: `Serve holds by ${winningTeam}, Serve from right side of the court, ( ${teamA.name} - 0, ${teamB.name} - 0 )`, date: new Date() }])
                }
                matchDetails.summary[matchDetails.completedSets].push({ text: `Set-${matchDetails.completedSets + 1} won by ${winningTeam} 🎉`, date: new Date() });
                teamA.sets[matchDetails.completedSets].winner = teamAScore > teamBScore ? true : false;
                teamB.sets[matchDetails.completedSets].winner = teamBScore > teamAScore ? true : false;
                matchDetails.completedSets += 1;
            } 
    
            else {
                let summaryText; 
                if (teamA.sets[matchDetails.completedSets].serve) {
                    if (teamA.sets[matchDetails.completedSets].score % 2) {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamA.name} scores a point, Serve holds by ${teamA.name}, Serve from left side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    } else {
                        summaryText = `Set-${matchDetails.completedSets + 1}, ${teamA.name} scores a point, Serve holds by ${teamA.name}, Serve from right side of the court, ( ${teamA.name} - ${teamAScore}, ${teamB.name} - ${teamBScore} )`;
                    }
                } else {
                    if (teamB.sets[matchDetails.completedSets].score % 2) {
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
                const teamASetWinsCount = teamA.sets.reduce((acc, curr) => acc + (curr.winner ? 1 : 0), 0);
                const teamBSetWinsCount = teamB.sets.reduce((acc, curr) => acc + (curr.winner ? 1 : 0), 0);
                matchDetails.status = MATCH_STATUS.COMPLETED;
                matchDetails.winner = teamASetWinsCount > teamBSetWinsCount ? matchDetails.teamA : matchDetails.teamB;
            }
        }

        await teamA.save();
        await teamB.save();
        await matchDetails.save();

        const result = await BadmintonMatchDetails.findOne({ _id: matchDetails._id }).populate('teamA teamB').lean();

        return res.json({ success: true, data: result });

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

