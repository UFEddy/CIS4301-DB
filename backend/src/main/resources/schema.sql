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
    TeamName VARCHAR(100) NOT NULL
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
    HomeTeamStanding INTEGER,
    AwayTeamID INTEGER,
    AwayTeamStanding INTEGER,
    FOREIGN KEY (SeasonYear) REFERENCES Season(SeasonYear) ON DELETE CASCADE,
    FOREIGN KEY (HomeTeamID) REFERENCES Team(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (AwayTeamID) REFERENCES Team(TeamID) ON DELETE CASCADE
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