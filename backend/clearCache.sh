#!/bin/bash

lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null
cd backend
rm -rf node*
rm -rf package-lock.json
npm install
rm -rf .wwebjs*