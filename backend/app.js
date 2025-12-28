import express from 'express'
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectToDB from './middleware/ConnectToDB.js'
import commonMainRoute from './routes/common/main.js'
import clientMainRoute from './routes/client/main.js'
import adminMainRoute from './routes/admin/main.js'
import superAdminMainRoute from './routes/dev/main.js'
import InternetCheck from './middleware/InternetCheck.js';

const app = express()
const port = process.env.PORT || 5000

// White-listed Host
const whitelist = [
    'http://localhost:3000',
    'http://localhost:5000',
];

// CORS Setup
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origin is not white-listed. Connect to developer fot it.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Access-Control headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (whitelist.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Middleware setup
app.use(cors(corsOptions));
// app.use(InternetCheck);
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(connectToDB)

// Routes Forwarding
app.use("/api/common", commonMainRoute)
app.use("/api/client/", clientMainRoute);
app.use("/api/admin/", adminMainRoute);
app.use("/api/dev/", superAdminMainRoute);

// Listening express app
app.listen(port, () => {
    console.log(`BACKEND SERVER LISTENING AT: ${port}`)
});
