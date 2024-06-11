export const sports = [
    {
        name: 'Badminton', 
        sportType: 'Badminton',
        src: require('../../assets/Badminton.png'),
        _id: 1,
    },
    {
        name: 'Table Tennis',
        sportType: 'Table_Tennis',
        src: require('../../assets/Table_tennis.png'),
        _id: 2,
    },
];



// Badmintion 

export const badmintonMatchType = [
    { label: 'Singles', value: 'Singles' },
    { label: 'Doubles', value: 'Doubles' }
]

export const badmintonGameSets = [
    { label: '1', value: '1' },
    { label: '3', value: '3' },
    { label: '5', value: '5' },
    { label: '7', value: '7' },
    { label: '9', value: '9' }
];

export const badmintonGamePoints = [
    { label: '11', value: '11' },
    { label: '21', value: '21' },
]

export const badmintonRules = [
    'A match consists of  3 games of 21 points.',
    'At 20 all, the side which gains a 2 point lead first wins that game, At 29 all, the side scoring the 30th point first, wins that game.', 
    'The side winning  a game serves first in the next game', 
    'At the beginning of the game (0-0) and when the server’s score is even, the server serves from the right service court. When the server’s score is odd, the server serves from the left service court'
]