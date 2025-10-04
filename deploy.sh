#!/bin/bash
set -e

APP_DIR="/var/www/goldApp"

echo "📦 Pulling latest code..."
cd $APP_DIR
git reset --hard
git pull origin main

echo "📂 Backend setup..."
cd $APP_DIR/backend
npm install --production

echo "📂 Frontend setup..."
cd $APP_DIR/frontend
npm install --production
npm run build

echo "🔄 Restarting apps with PM2..."
cd $APP_DIR
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo "✅ Deployment complete!"
