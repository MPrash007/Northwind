import { Router } from "express";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users";


const router = Router();

router.get("/", (req,res, next)=>{
    try {
        const {userId, isAuthenticated} =  getAuth(req);

        if(!isAuthenticated || !userId){
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const user = getLocalUser(userId);

        res.json({user});
    } catch (error) {
        next(error);
    }
});

export default router;