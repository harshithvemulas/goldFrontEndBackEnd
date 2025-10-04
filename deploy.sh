#!/bin/bash
set -e

APP_DIR="/var/www/goldApp"
BACKUP_DIR="/var/www/goldApp_prev"

# Log inside the app folder
exec > >(tee -a $APP_DIR/deploy.log) 2>&1

echo "🚀 Starting deployment..."

# Step 1: Backup current version
if [ -d "$APP_DIR" ]; then
  echo "📦 Backing up current version to $BACKUP_DIR..."
  rm -rf $BACKUP_DIR
  rsync -a --exclude 'node_modules' $APP_DIR/ $BACKUP_DIR/
fi

# Step 2: Update code
echo "📦 Pulling latest code..."
cd $APP_DIR
git fetch --all
git reset --hard origin/main

# Step 3: Backend setup
echo "📂 Backend setup..."
cd $APP_DIR/backend
npm install --production

# Step 4: Frontend setup (skip husky)
echo "📂 Frontend setup..."
cd $APP_DIR/frontend
HUSKY=0 npm install --production
npm run build

# Step 5: Restart PM2 apps
echo "🔄 Restarting apps with PM2..."
cd $APP_DIR
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

# Step 6: Cleanup backup if everything worked
echo "🧹 Cleaning up old backup..."
rm -rf $BACKUP_DIR

echo "✅ Deployment complete!"
