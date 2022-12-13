import { DataSource } from 'typeorm';

export const config = new DataSource({
    "type": "mssql",
    "host": "sixdb30122019.cc1jvdhqk6ad.us-west-2.rds.amazonaws.com",
    "port": 1433,
    "username": "ssdbuser",
    "password": "Caddycode",
    "database": "CreditCheckTest",
    "synchronize": true,
            "extra": {
                "trustServerCertificate": true,
                "Encrypt": true,
                "IntegratedSecurity": false,
            },
    "logging": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migrations/dev-migrations/**/*.ts"],
    
})

config.initialize();

