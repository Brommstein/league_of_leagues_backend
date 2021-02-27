const xss = require('xss');

function makeAccountStatus() {
    return [
        { userid: '1', username: 'Test1', _password: '123456789', _status: 'User' },
        { userid: '2', username: 'Test2', _password: '123456789', _status: 'User' },
        { userid: '107', username: 'Test3', _password: '123456789', _status: 'User' }
    ];
}

function createAccount() {
    return {
        userid: '15',
        username: 'Brom',
        _password: '123456789',
        _status: 'User'
    }
}

function emptyAccount() {
    return {
        userid: '15',
        username: null,
        _password: '123456789',
        _status: 'User'
    }
}

function makeMaliciousImg() {
    const maliciousImg = {
        userid: '911',
        username: xss(`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`),
        _password: '123456789',
        _status: 'User'
    };
    const expectedImg = {
        ...maliciousImg,
        username: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        _password: '123456789',
        _status: 'User'
    };

    return {
        maliciousImg, expectedImg
    }
}

module.exports = {
    makeAccountStatus,
    createAccount,
    emptyAccount,
    makeMaliciousImg
};