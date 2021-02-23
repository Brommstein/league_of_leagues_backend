CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    leaguename varchar(25) NOT NULL,
    preferedrole varchar(7) NOT NULL,
    secondaryrole varchar(7),
    sunday boolean NOT NULL,
    monday boolean NOT NULL,
    tuesday boolean NOT NULL,
    wednesday boolean NOT NULL,
    thursday boolean NOT NULL,
    friday boolean NOT NULL,
    saturday boolean NOT NULL,
    team varchar NOT NULL
);
CREATE TABLE IF NOT EXISTS teams (
    teamid SERIAL PRIMARY KEY,
    teamname varchar(255) NOT NULL,
    teamabr varchar(3) NOT NULL,
    captainid numeric NOT NULL,
    captain varchar(25) NOT NULL,
    topid numeric NOT NULL,
    _top varchar(25) NOT NULL,
    jungleid numeric NOT NULL,
    jungle varchar(25) NOT NULL,
    midid numeric NOT NULL,
    mid varchar(25) NOT NULL,
    adcid numeric NOT NULL,
    adc varchar(25) NOT NULL,
    supportid numeric NOT NULL,
    support varchar(25) NOT NULL
);
CREATE TABLE IF NOT EXISTS accountstatus (
    userid numeric NOT NULL,
    username varchar NOT NULL,
    _password varchar NOT NULL,
    _status varchar(7) NOT NULL
);