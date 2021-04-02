import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'

const publicKey = fs.readFileSync('resources/public.key');

export const middleware = (req, res, next) => {
    try {
        const prefix = req.headers.authorization.split(' ')[0];
        if (prefix !== "Bearer") {
            res.status(401).json({
                errors: [{authentication: "Invalid request!"}]
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, publicKey) as any;
        if (req.body.role && req.body.role !== decodedToken.role) {
            res.status(401).json({
                errors: [{authentication: "Invalid role!"}]
            });
        }
        next();
    } catch {
        res.status(401).json({
            errors: [{authentication: "Invalid request!"}]
        });
    }
};