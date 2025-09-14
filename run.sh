#!/bin/bash

echo "Starting Whatsapp Broadcaster..."

# Step 1: Cleanup
echo "Running cache cleanup..."
if ./backend/clearCache.sh; then
  echo "Cache Clear executed successfully."
else
  echo "Error while running clearCache.sh"
fi

# Step 2: Start Express server (background, logs in terminal + file)
echo "Starting Express server..."
(cd backend && node server.js 2>&1 | tee ../server.log &)

sleep 2

# Step 3: Start frontend (background, logs in terminal + file)
echo "Starting Frontend..."
(cd frontend && npm run dev -- --host 2>&1 | tee ../frontend.log &)

echo "All services started."
