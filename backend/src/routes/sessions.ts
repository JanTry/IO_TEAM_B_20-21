import express from "express";
import { Session } from '../database/models/session'

export const sessions = express.Router();

sessions.get('/', (req, res) => {
    Session.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results)
        }
    })
})

sessions.get('/validate/:sessionID/:accessCode', (req, res) => {
    const {sessionID, accessCode} = req.params
    Session.findOne({_id: sessionID, accessCode, online: true}, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else  {
            console.log(result)
            res.status(200).send(!!result)
        }
    })
})

sessions.post('/', (req, res) => {
    const session = {accessCode: Math.random().toString(36).substring(2, 7), online: true};
    Session.create(session, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log(result);
            res.status(200).send(result)
        }
    })
})