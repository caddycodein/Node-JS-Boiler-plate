import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Client_creditcheck from '../entity/client_creditcheck';
import Client_esign from '../entity/client_esign';
import Client_integrations from '../entity/client_integrations';
import Creditcheck_master from '../entity/creditcheck_master';
import Tenant_bankid_verification_details from '../entity/tenant_bankid_verification_details';
import Tenant_bankid_verification_history from '../entity/tenant_bankid_verification_history';
import Tenant_credit_check_details from '../entity/tenant_credit_check_details';
import Tenant_credit_check_history from '../entity/tenant_credit_check_history';

const AppDataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD? Buffer.from(process.env.DB_PASSWORD, 'base64').toString() :process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Client_integrations, Tenant_bankid_verification_details, Tenant_bankid_verification_history, Creditcheck_master, Tenant_credit_check_details, Tenant_credit_check_history, Client_creditcheck, Client_esign],
    migrations: ['../migrations/*{.ts,.js}'],
    subscribers: [],
});

AppDataSource.initialize();
export default AppDataSource;