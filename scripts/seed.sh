#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Warning: .env.local file not found. Using fallback credentials."
fi

# Run the seed script
echo "Running seed script..."
node scripts/seed-questions.mjs 