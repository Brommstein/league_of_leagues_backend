function makeUser() {
    return [
        {
            leaguename: 'Test1',
            preferedrole: 'top',
            secondaryrole: 'mid',
            sunday: 'true',
            monday: 'true',
            tuesday: 'true',
            wednesday: 'false',
            thursday: 'false',
            friday: 'false',
            saturday: 'true',
            team: 'TTT'
        },
        {
            leaguename: 'Test2',
            preferedrole: 'top',
            secondaryrole: 'mid',
            sunday: 'true',
            monday: 'false',
            tuesday: 'true',
            wednesday: 'false',
            thursday: 'false',
            friday: 'false',
            saturday: 'true',
            team: 'TTT'
        },
        {
            leaguename: 'Test3',
            preferedrole: 'top',
            secondaryrole: 'mid',
            sunday: 'true',
            monday: 'false',
            tuesday: 'false',
            wednesday: 'false',
            thursday: 'false',
            friday: 'false',
            saturday: 'true',
            team: 'TTT'
        }
    ];
}

function createUser() {
    return {
        leaguename: 'Test3',
        preferedrole: 'top',
        secondaryrole: 'mid',
        sunday: 'true',
        monday: 'false',
        tuesday: 'false',
        wednesday: 'false',
        thursday: 'false',
        friday: 'false',
        saturday: 'true',
        team: 'TTT'
    }
}

function emptyUser() {
    return {
        leaguename: 'Test3',
        preferedrole: 'top',
        secondaryrole: 'mid',
        sunday: '',
        monday: 'false',
        tuesday: 'false',
        wednesday: 'false',
        thursday: 'false',
        friday: 'false',
        saturday: 'true',
        team: 'TTT'
    }
}

function makeMaliciousImg() {
    const maliciousImg = {
        leaguename: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        preferedrole: 'top',
        secondaryrole: 'mid',
        sunday: '',
        monday: 'false',
        tuesday: 'false',
        wednesday: 'false',
        thursday: 'false',
        friday: 'false',
        saturday: 'true',
        team: 'TTT'
    };
    const expectedImg = {
        ...maliciousImg,
        leaguename: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        preferedrole: 'top',
        secondaryrole: 'mid',
        sunday: '',
        monday: 'false',
        tuesday: 'false',
        wednesday: 'false',
        thursday: 'false',
        friday: 'false',
        saturday: 'true',
        team: 'TTT'
    };

    return {
        maliciousImg, expectedImg
    }
}

module.exports = {
    makeUser,
    createUser,
    emptyUser,
    makeMaliciousImg
};