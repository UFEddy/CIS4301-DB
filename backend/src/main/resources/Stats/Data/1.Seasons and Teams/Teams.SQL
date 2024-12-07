INSERT INTO Team (TeamID, TeamName) VALUES (1, 'ARI');
INSERT INTO Team (TeamID, TeamName) VALUES (2, 'ATL');
INSERT INTO Team (TeamID, TeamName) VALUES (3, 'BAL');
INSERT INTO Team (TeamID, TeamName) VALUES (4, 'BOS');
INSERT INTO Team (TeamID, TeamName) VALUES (5, 'CHC');
INSERT INTO Team (TeamID, TeamName) VALUES (6, 'CHW');
INSERT INTO Team (TeamID, TeamName) VALUES (7, 'CIN');
INSERT INTO Team (TeamID, TeamName) VALUES (8, 'CLE');
INSERT INTO Team (TeamID, TeamName) VALUES (9, 'COL');
INSERT INTO Team (TeamID, TeamName) VALUES (10, 'DET');
INSERT INTO Team (TeamID, TeamName) VALUES (11, 'HOU');
INSERT INTO Team (TeamID, TeamName) VALUES (12, 'KCR');
INSERT INTO Team (TeamID, TeamName) VALUES (13, 'LAA');
INSERT INTO Team (TeamID, TeamName) VALUES (14, 'LAD');
INSERT INTO Team (TeamID, TeamName) VALUES (15, 'MIA');
INSERT INTO Team (TeamID, TeamName) VALUES (16, 'MIL');
INSERT INTO Team (TeamID, TeamName) VALUES (17, 'MIN');
INSERT INTO Team (TeamID, TeamName) VALUES (18, 'NYM');
INSERT INTO Team (TeamID, TeamName) VALUES (19, 'NYY');
INSERT INTO Team (TeamID, TeamName) VALUES (20, 'OAK');
INSERT INTO Team (TeamID, TeamName) VALUES (21, 'PHI');
INSERT INTO Team (TeamID, TeamName) VALUES (22, 'PIT');
INSERT INTO Team (TeamID, TeamName) VALUES (23, 'SDP');
INSERT INTO Team (TeamID, TeamName) VALUES (24, 'SEA');
INSERT INTO Team (TeamID, TeamName) VALUES (25, 'SFG');
INSERT INTO Team (TeamID, TeamName) VALUES (26, 'STL');
INSERT INTO Team (TeamID, TeamName) VALUES (27, 'TBR');
INSERT INTO Team (TeamID, TeamName) VALUES (28, 'TEX');
INSERT INTO Team (TeamID, TeamName) VALUES (29, 'TOR');
INSERT INTO Team (TeamID, TeamName) VALUES (30, 'WSN');
INSERT INTO TeamSeason (TeamSeasonID, TeamSeasonName, TeamSeasonYear)
SELECT
    t.TeamID,
    t.TeamName,
    s.SeasonYear
FROM
    Team t
        CROSS JOIN
    Season s;


COMMIT;
