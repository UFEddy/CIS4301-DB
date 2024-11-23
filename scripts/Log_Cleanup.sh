#!/bin/bash

# Navigate to the main directory (assumes the script is in the 'scripts' folder)
cd .. || { echo "Failed to navigate to the main directory. Exiting."; exit 1; }

# Directory containing the logs
LOGS_DIR="Logs"

# Ensure the logs directory exists
if [ ! -d "$LOGS_DIR" ]; then
    echo "Logs directory not found: $LOGS_DIR"
    exit 1
fi

# Function to delete logs based on user input
delete_logs() {
    echo "Do you want to delete logs based on:"
    echo "1. Number of logs to keep"
    echo "2. Logs older than a certain number of days"
    read -p "Enter 1 or 2: " choice

    if [[ "$choice" == "1" ]]; then
        # Option 1: Keep a specified number of logs
        read -p "How many logs do you want to keep? " num_logs
        if [[ ! "$num_logs" =~ ^[0-9]+$ || "$num_logs" -le 0 ]]; then
            echo "Invalid number entered. Exiting."
            exit 1
        fi
        # Count total logs and remove older logs if they exceed the specified limit
        total_logs=$(ls -1 "$LOGS_DIR" | wc -l)
        if [ "$total_logs" -gt "$num_logs" ]; then
            num_to_delete=$((total_logs - num_logs))
            echo "Deleting $num_to_delete oldest log(s)..."
            ls -1t "$LOGS_DIR" | tail -n "$num_to_delete" | while read -r log_file; do
                rm "$LOGS_DIR/$log_file"
                echo "Deleted: $LOGS_DIR/$log_file"
            done
        else
            echo "No logs to delete. Total logs ($total_logs) are within the specified limit ($num_logs)."
        fi

    elif [[ "$choice" == "2" ]]; then
        # Option 2: Delete logs older than a certain number of days
        read -p "Delete logs older than how many days? " days_old
        if [[ ! "$days_old" =~ ^[0-9]+$ || "$days_old" -le 0 ]]; then
            echo "Invalid number of days entered. Exiting."
            exit 1
        fi
        echo "Deleting logs older than $days_old days..."
        find "$LOGS_DIR" -type f -mtime +"$days_old" -exec rm {} \; -print
    else
        echo "Invalid choice. Exiting."
        exit 1
    fi

    echo "Log cleanup complete."
}

# Run the delete_logs function
delete_logs