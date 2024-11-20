-- Sample data for Player table
INSERT INTO Player (PlayerID, Position, FirstName, LastName) VALUES (1, 'Pitcher', 'Garret', 'Cole');
INSERT INTO Player (PlayerID, Position, FirstName, LastName) VALUES (2, 'Outfielder', 'Aaron', 'Judge');

-- Sample data for Team table
INSERT INTO Team (TeamID, TeamName) VALUES (1, 'Yankees');

-- Insert test user "testuser" and plain-text password "password" ,Admin user with admin role "adminpass"
INSERT INTO authuser (username, password, enabled) VALUES ('testuser', '$2a$12$DMmLFX8vnxbSGdnULOealenbv6HGfHLKbZ2h07RxcPwzIfOOu8bFK', true);
INSERT INTO authuser (username, password, enabled) VALUES ('admin', '$2a$12$ezhjqz72R4B9.e1F/cTTAufMm.bnZ9O9LOE3dFGA7K6055YgnEuoW', true);
-- Assign the "ROLE_USER"  and ROLE_ADMIN
INSERT INTO authorities (username, authority) VALUES ('testuser', 'ROLE_USER');
INSERT INTO authorities (username, authority) VALUES ('admin', 'ROLE_ADMIN');