function makeTeam() {
    return [
        { teamname: 'Test1', teamabr: 'TT1', captainid: '1', captain: 'Dum1', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' },
        { teamname: 'Test2', teamabr: 'TT2', captainid: '2', captain: 'Dum2', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' },
        { teamname: 'Test3', teamabr: 'TT3', captainid: '3', captain: 'Dum3', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' }
    ];
}

function makeTestTeam() {
    return [
        { teamid: 1, teamname: 'Test1', teamabr: 'TT1', captainid: '1', captain: 'Dum1', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' },
        { teamid: 2, teamname: 'Test2', teamabr: 'TT2', captainid: '2', captain: 'Dum2', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' },
        { teamid: 3, teamname: 'Test3', teamabr: 'TT3', captainid: '3', captain: 'Dum3', topid: '1', _top: 'Dum1', jungleid: '2', jungle: 'Dum2', midid: '3', mid: 'Dum3', adcid: '4', adc: 'Dum4', supportid: '5', support: 'Dum5' }
    ];
}

function createTeam() {
    return {
        teamname: 'Test2',
        teamabr: 'TT2',
        captainid: '2',
        captain: 'Dum2',
        topid: '1',
        _top: 'Dum1',
        jungleid: '2',
        jungle: 'Dum2',
        midid: '3',
        mid: 'Dum3',
        adcid: '4',
        adc: 'Dum4',
        supportid: '5',
        support: 'Dum5'
    }
}

function emptyTeam() {
    return {
        teamname: 'Test2',
        teamabr: 'TTT',
        captainid: '2',
        captain: 'Dum2',
        topid: '1',
        _top: null,
        jungleid: '2',
        jungle: 'Dum2',
        midid: '3',
        mid: 'Dum3',
        adcid: '4',
        adc: 'Dum4',
        supportid: '5',
        support: 'Dum5'
    }
}

function makeMaliciousImg() {
    const maliciousImg = {
        teamname: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        teamabr: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        captainid: '2',
        captain: 'Dum2',
        topid: '1',
        _top: 'Dum1',
        jungleid: '2',
        jungle: 'Dum2',
        midid: '3',
        mid: 'Dum3',
        adcid: '4',
        adc: 'Dum4',
        supportid: '5',
        support: 'Dum5'
    };
    const expectedImg = {
        ...maliciousImg,
        teamname: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        teamabr: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        captainid: '2',
        captain: 'Dum2',
        topid: '1',
        _top: 'Dum1',
        jungleid: '2',
        jungle: 'Dum2',
        midid: '3',
        mid: 'Dum3',
        adcid: '4',
        adc: 'Dum4',
        supportid: '5',
        support: 'Dum5'
    };

    return {
        maliciousImg, expectedImg
    }
}

module.exports = {
    makeTeam,
    makeTestTeam,
    createTeam,
    emptyTeam,
    makeMaliciousImg
};