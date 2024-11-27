#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>
#include <vector>
#include <pstl/utils.h>
using namespace std;

int testFile(ifstream& file) {
    if (!file) {
        cerr << "File not found" << endl;
        return 1;
    }
}

void FileToStringFormatter(ifstream& inFile, ofstream& outFile, string tableName) {
    string formattedString;
    string line;
    vector<string> formattedStrings;
    getline(inFile, line);
    while (getline(inFile, line)) {
        stringstream ss(line);
        string token;
        bool first = true;
        formattedString = "INSERT INTO " + tableName + " VALUES (";
        while (getline(ss, token, ',')) {
            if (!token.empty() && token.front() == '"' && token.back() == '"') {
                token = token.substr(1, token.size() - 2);
                token = token.substr(1, token.size() - 2);
            }
            if (!first) {
                formattedString += ", ";
            }
            formattedString += token;
            first = false;
        }
        formattedString += ");";
        formattedStrings.push_back(formattedString);
    }

    for (int i = 0; i < formattedStrings.size(); ++i) {
        outFile << formattedStrings[i] << endl;
    }
    outFile << "\n\n\n";
    formattedStrings.clear();
    inFile.close();
}



int main() {
    ofstream outFile("../Data/SQLText.txt");
    if (!outFile) {
        cerr << "Can't open output file" << endl;
        return 1;
    }
    string line;
    string tableName;


    //====================== Seasons ======================//

    outFile << "INSERT INTO Season (SeasonYear) VALUES (2021);\n";
    outFile << "INSERT INTO Season (SeasonYear) VALUES (2022);\n";
    outFile << "INSERT INTO Season (SeasonYear) VALUES (2023);\n\n\n";


    //====================== Teams ======================//

    ifstream inFile("../Data/TeamsSchemaFormatted.csv");
    tableName = "Team (TeamID, TeamName)";
    FileToStringFormatter(inFile, outFile, tableName);
    inFile.close();

    //====================== TeamSeason ======================//

    inFile.open("../Data/TeamSeasonQuery.txt");
    if (!inFile) {
        cerr << "Error opening file" << endl;
        return 1;
    }
    while (getline(inFile, line)) {
        outFile << line << endl;
    }
    outFile << "\n\n\n";
    inFile.close();

    //====================== Players ======================//

    inFile.open("../Data/PlayersSchemaFormatted.csv");
    tableName = "Player (PlayerID, Position, FirstName, LastName)";
    FileToStringFormatter(inFile, outFile, tableName);
    inFile.close();

    //====================== PlayerSeason ======================//

    inFile.open("../Data/PlayerSeasonSchemaFormatted.csv");
    tableName = "PlayerSeason (PlayerID, TeamID, SeasonYear, Salary, WAR)";
    FileToStringFormatter(inFile, outFile, tableName);
    inFile.close();

    //====================== Games ======================//

    inFile.open("../Data/GamesSchemaFormatted.csv");
    tableName = "Game (GameID, GameDate, SeasonYear, Attendance)";
    FileToStringFormatter(inFile, outFile, tableName);
    inFile.close();

    //====================== PlayerGame Query ======================//

    inFile.open("../Data/PlayerGameQuery.txt");
    if (!inFile) {
        cerr << "Error opening file" << endl;
        return 1;
    }
    while (getline(inFile, line)) {
        outFile << line << endl;
    }
    outFile << "\n";
    inFile.close();


    return 0;
}