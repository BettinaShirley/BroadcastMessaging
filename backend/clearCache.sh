#!/bin/bash

# cd backend
# rm -rf .wwebjs*
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null