export const sports = [
    {
        name: 'Football',
        src: require('../../assets/Football.png'),
        _id: 1,
    },
    {
        name: 'Badminton',
        src: require('../../assets/Badminton.png'),
        _id: 2,
    },
    {
        name: 'Table Tennis',
        src: require('../../assets/Table_tennis.png'),
        _id: 3,
    },
    {
        name: 'Rugby',
        src: require('../../assets/Rugby.png'),
        _id: 4,
    },
    {
        name: 'BasketBall',
        src: require('../../assets/Basketball.png'),
        _id: 5
    }
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


export const liveMatchDetails = [
    {
        date: new Date(),
        teamA: {
            name: 'Titans',
            score: 21
        },
        teamB: {
            name: 'Patans',
            score: 18
        },
        matchType: 'Singles',
    },
    {
        date: new Date(),
        teamA: {
            name: 'Titans',
            score: 21
        },
        teamB: {
            name: 'Patans',
            score: 18
        },
        matchType: 'Singles',
    },
    {
        date: new Date(),
        teamA: {
            name: 'Titans',
            score: 21
        },
        teamB: {
            name: 'Patans',
            score: 18
        },
        matchType: 'Singles',
    },
];