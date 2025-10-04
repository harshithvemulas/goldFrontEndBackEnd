#!/bin/bash
set -e

APP_DIR="/var/www/goldApp"

echo "📦 Pulling latest code..."
cd $APP_DIR
git fetch --all
git reset --hard origin/main

echo "📂 Backend setup..."
cd $APP_DIR/backend
npm install --production

echo "📂 Frontend setup..."
cd $APP_DIR/frontend
# 🚫 Disable husky in CI/CD
HUSKY=0 npm install --production
npm run build

echo "🔄 Restarting apps with PM2..."
cd $APP_DIR
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo "✅ Deployment complete!"
