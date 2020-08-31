import {Request, Response, NextFunction} from 'express';
import firebaseApp from './firebase';

const userAuth = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.token as string;
        const decoded =  await firebaseApp.auth().verifyIdToken(token);
        console.log("decoded", decoded);
        next();
    } catch (e) {
        res.status(403).send("access denied");
    }
};

export {userAuth};