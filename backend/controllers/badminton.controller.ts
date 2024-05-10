import { BadmintonMatchDetails } from "../models/badminton-match-details.model";
import { MATCH_STATUS } from "../enum";
import { Types } from "mongoose";
import { Team } from "../models/team.model";


// @get badminton/live
export const getLiveMatches = async (req, res) => {
    try {
        let { user } = req.query;
        user = new Types.ObjectId(user);
        const matches = await BadmintonMatchDetails.find({
            status: MATCH_STATUS.LIVE, 
            user
        }).populate('teamA teamB');

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
        let { user } = req.query; 
        if(!user) {
            throw new Error("Invalid Request"); 
        }

        user = new Types.ObjectId(user);

        const matches = await BadmintonMatchDetails.find({
            status: MATCH_STATUS.COMPLETED,
            user
        }).populate('teamA teamB').lean();
        
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
        const doc: any = await BadmintonMatchDetails.findOne({ _id: matchId }).populate('teamA teamB');
        const result = {
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
            _id: doc._id
        }
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

        return res.json({ success: true, data: result.summary.reverse() });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// @post badminton/create
export const createMatch = async (req, res) => {
    try {
        const { gameType, sets, gamePoints, teamA, teamB, user } = req.body;

        if (!gameType || !sets || !gamePoints || !teamA || !teamB || !teamA?.name || !teamA?.playerOne || (gameType == "Doubles" && !teamA?.playerTwo) || !teamB || !teamB?.name || !teamB?.playerOne || (gameType == "Doubles" && !teamB?.playerTwo) ) {
            throw new Error("Invalid Request!");
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

        await BadmintonMatchDetails.create({
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

        if(teamAScore > 21 || teamAScore > 21) {
            throw new Error('Score cannot be greater than 21');
        }

        const matchDetails = await BadmintonMatchDetails.findOne({ _id: matchId }); 
        const teamA = await Team.findOne({ _id: matchDetails.teamA }); 
        const teamB = await Team.findOne({ _id: matchDetails.teamB }); 

        if(whoScored) {
            teamA.sets[matchDetails.completedSets].serve = whoScored == 'TEAMA' ? true : false; 
            teamB.sets[matchDetails.completedSets].serve = whoScored == 'TEAMA' ? false : true;
        }

        teamA.sets[matchDetails.completedSets].score = teamAScore; 
        teamB.sets[matchDetails.completedSets].score = teamBScore; 

        if(teamAScore == 21 || teamBScore == 21) { // set completed
            if (matchDetails.completedSets < matchDetails.totalSets - 1) {
                teamA.sets.push({ score: 0, serve: false }); 
                teamB.sets.push({ score: 0, serve: false });
            }
            const winningTeam = teamAScore == 21 ? teamA.name : teamB.name;
            matchDetails.summary.push({text: `Set-${matchDetails.completedSets + 1} won by ${winningTeam} 🎉`, date: new Date()});
            teamA.sets[matchDetails.completedSets].winner = teamAScore == 21 ? true : false;
            teamB.sets[matchDetails.completedSets].winner = teamBScore == 21 ? true : false;

            matchDetails.completedSets += 1;
        } else if(whoScored) {
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
            matchDetails.summary.push({ text: summaryText, date: new Date() });
        }

        if(matchDetails.completedSets == matchDetails.totalSets) {
            matchDetails.status = MATCH_STATUS.COMPLETED;
        }

        await teamA.save();
        await teamB.save();
        await matchDetails.save();

        return res.json({ success: true, data: null });

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

