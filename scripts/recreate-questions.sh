#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Warning: .env.local file not found. Using fallback credentials."
fi

# Run the recreate questions script
echo "Running script to recreate questions with categories..."
node scripts/recreate-questions-with-categories.mjs 