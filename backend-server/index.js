'use strict';
import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import mysql from 'mysql2/promise';

import dotenv from 'dotenv';
dotenv.config();

// environment variables
const port = process.env.PORT || 5001;

// mysql
const sqlHost = process.env.MYSQL_HOST || '';
const sqlUser = process.env.MYSQL_USERNAME || '';
const sqlPassword = process.env.MYSQL_PASSWORD || '';
const sqlDatabase = process.env.MYSQL_DATABASE || '';
const sqlTable = process.env.MYSQL_TABLE || '';

const dbConfig = {
    host: sqlHost,
    user: sqlUser,
    password: sqlPassword,
    database: sqlDatabase,
};

const getData = async () => {
    try {
        const sqlQuery = `SELECT data FROM ${sqlTable}`;
        const sqlConnection = await mysql.createConnection(dbConfig);
        return sqlConnection.execute(sqlQuery);
    } catch (error) {
        throw new Error(error);
    }
};

// redis
const redisUsername = process.env.REDIS_USERNAME || '';
const redisPassword = process.env.REDIS_PASSWORD || '';
const redisHost = process.env.REDIS_HOST || '';
const redisPort = process.env.REDIS_PORT || '';
const redisChannel = process.env.REDIS_CHANNEL || '';

// configs
const redisUrl = `redis://${redisUsername}:${redisPassword}@${redisHost}:${redisPort}`;

const redisClient = createClient({ url: redisUrl });

const setRedisCache = async jsonData => {
    try {
        const value = JSON.stringify({ isCached: 'yes', data: jsonData });
        await redisClient.connect();
        await redisClient.set('key', value);
        return redisClient.disconnect();
    } catch (error) {
        throw new Error(error);
    }
};

const getRedisCache = async () => {
    try {
        await redisClient.connect();
        const cachedData = await redisClient.get('key');
        await redisClient.disconnect();
        return cachedData;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteRedisCache = async () => {
    try {
        await redisClient.connect();
        await redisClient.del('key');
        return redisClient.disconnect();
    } catch (error) {
        throw new Error(error);
    }
};

const publishToRedis = async data => {
    try {
        await redisClient.connect();
        const subscriberCount = await redisClient.publish(redisChannel, data);
        await redisClient.disconnect();
        return subscriberCount;
    } catch (error) {
        throw new Error(error);
    }
};

//express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express endpoints
app.get('/', (_, res) => res.status(200).send('connected to backend server!'));
app.get('/data', async (_, res) => {
    try {
        const cachedData = await getRedisCache();
        if (cachedData) {
            const results = JSON.parse(cachedData);
            res.status(200).json({ message: 'success', ...results });
            // ending the fn
            return;
        }

        const [data, _] = await getData();
        await setRedisCache(data);

        res.status(200).json({ message: 'success', isCached: 'no', data });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: 'failure', error });
    }
});

app.post('/create', async (req, res) => {
    const { data } = req.body;
    try {
        if (!data) throw new Error('missing data');
        const subscriberCount = await publishToRedis(data);
        console.log({ subscriberCount });
        const test = await deleteRedisCache();
        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: 'failure', error });
    }
});

app.listen(port, () => console.log(`served on port ${port}`));
