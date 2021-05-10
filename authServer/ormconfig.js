const config = require('dotenv').config().parsed;

module.exports = config.USE_POSTGRES == 1
    ? {
        "type": "postgres",
        "host": config.POSTGRES_ADDRESS,
        "port": config.POSTGRES_PORT,
        "synchronize": true,
        "logging": true,
        "username": config.POSTGRES_USERNAME,
        "password": config.POSTGRES_PASSWORD,
        "database": "postgres",
        "entities": [
            "./src/database/entities/**/*.ts"
        ],
        "migrations": [
            "./src/database/migrations/*.ts"
        ],
        "cli": {
            "migrationsDir": "./src/database/migrations"
        }
    }
    : {
        "name": "default",
        "type": "sqlite",
        "database": "db.sqlite",
        "synchronize": true,
        "logging": false,
        "entities": [
          "./src/database/entities/**/*.ts"
        ],
        "migrations": [
          "./src/database/migrations/*.ts"
        ],
        "cli": {
          "migrationsDir": "./src/database/migrations"
        }
    }
      
      