-- Player table
CREATE TABLE Player (
    PlayerID INTEGER PRIMARY KEY,
    Position VARCHAR(50),
    FirstName VARCHAR(50),
    LastName VARCHAR(50)
);

-- Team table
CREATE TABLE Team (
    TeamID INTEGER PRIMARY KEY,
    TeamName VARCHAR(10) NOT NULL,
    --TeamStanding INTEGER,
    TeamSeason INTEGER,
    FOREIGN KEY (TeamSeason) REFERENCES Season(SeasonYear) ON DELETE CASCADE
);

-- Season table
CREATE TABLE Season (
    SeasonYear INTEGER PRIMARY KEY
);

-- PlayerSeason table
CREATE TABLE PlayerSeason (
    PlayerID INTEGER,
    TeamID INTEGER,
    SeasonYear INTEGER,
    Salary DOUBLE,
    WAR FLOAT,
    PRIMARY KEY (PlayerID, TeamID, SeasonYear),
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Team(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (SeasonYear) REFERENCES Season(SeasonYear) ON DELETE CASCADE
);

-- Game table
CREATE TABLE Game (
    GameID INTEGER PRIMARY KEY,
    GameDate DATE,
    SeasonYear INTEGER,
    Attendance INTEGER,
    HomeTeamID INTEGER,
    -- HomeTeamStanding INTEGER,
    AwayTeamID INTEGER,
    --AwayTeamStanding INTEGER,
    FOREIGN KEY (SeasonYear) REFERENCES Season(SeasonYear) ON DELETE CASCADE,
    FOREIGN KEY (HomeTeamID) REFERENCES Team(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (AwayTeamID) REFERENCES Team(TeamID) ON DELETE CASCADE,
    --FOREIGN KEY (HomeTeamStanding) REFERENCES Team(TeamStanding) ON DELETE CASCADE,
    --FOREIGN KEY (AwayTeamStanding) REFERENCES Team(TeamStanding) ON DELETE CASCADE
);

-- PlayerGame table
CREATE TABLE PlayerGame (
    PlayerID INTEGER,
    GameID INTEGER,
    WAR FLOAT,
    PRIMARY KEY (PlayerID, GameID),
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Game(GameID) ON DELETE CASCADE
);

-- Users table (Auth)
CREATE TABLE IF NOT EXISTS authuser (
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL,
    PRIMARY KEY (username)
);

-- Authorities table (roles Auth)
CREATE TABLE IF NOT EXISTS authorities (
    username VARCHAR(50) NOT NULL,
    authority VARCHAR(50) NOT NULL,
    FOREIGN KEY (username) REFERENCES authuser(username),
    PRIMARY KEY (username, authority)
);