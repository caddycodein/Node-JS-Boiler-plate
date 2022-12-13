import { DataSource } from 'typeorm';

export const config = new DataSource({
    "type": "mssql",
    "host": "sixstoragedb.ciiqx44sw8dp.eu-north-1.rds.amazonaws.com",
    "port": 1433,
    "username": "ssdbuser",
    "password": "Caddycode",
    "database": "CreditCheck",
    "synchronize": true,
            "extra": {
                "trustServerCertificate": true,
                "Encrypt": true,
                "IntegratedSecurity": false,
            },
    "logging": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migrations/eu-prod-migrations/**/*.ts"],
    
})

config.initialize();

