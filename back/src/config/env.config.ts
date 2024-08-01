import dotenv from 'dotenv';

dotenv.config();


export const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
};

export const jwt = {
    secret: process.env.JWT_SECRET || '',
    expiresIn: '1h',
};
