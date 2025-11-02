import { Request, RequestHandler } from "express";
import { User } from "../model/user.model";
import { JwtUtil } from "../utility/jwt.utility";
import { wrapErr } from "@common/ResponseWrapper";

export interface AuthorizedRequest extends Request{
    principal: User.Model;
}

export const PreAuthorizeMw = (requirement?: ((user: User.Model)=>boolean) | ((user: User.Model)=>Promise<boolean>)): RequestHandler =>{
    return async (req, res, next)=>{
        const user = await JwtUtil.parse(req);
        if(!user)
            return wrapErr(res).Forbidden().end("Require valid authentication");
        if(requirement){
            let reqResult = requirement(user)
            if(reqResult instanceof Promise) reqResult = await reqResult;
            if(!reqResult)
                return wrapErr(res).Unauthorized().end("Authenticated user is unauthorized");
        }
        (req as any).principal = user;
        next()
    }
}