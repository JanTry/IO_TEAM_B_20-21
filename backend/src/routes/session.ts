import express from "express";
import {Session} from '../database/models/session'

export const sessionRoutes = express.Router();

sessionRoutes.get('/', (req, res) => {
    Session.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results)
        }
    })
})

sessionRoutes.get('/validate/:sessionID/:accessCode', (req, res) => {
    const {sessionID, accessCode} = req.params
    Session.findOne({_id: sessionID, accessCode, online: true}, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else  {
            res.status(200).send(!!result)
        }
    })
})

sessionRoutes.post('/', (req, res) => {
    const session = {accessCode: Math.random().toString(36).substring(2, 7), online: true};
    Session.create(session, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result)
        }
    })
})