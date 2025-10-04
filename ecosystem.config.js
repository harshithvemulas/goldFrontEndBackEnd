module.exports = {
  apps: [
    {
      name: "goldapp-backend",
      cwd: "/var/www/goldApp/backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 8000
      }
    },
    {
      name: "goldapp-frontend",
      cwd: "/var/www/goldApp/frontend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0"
      }
    }
  ]
};
