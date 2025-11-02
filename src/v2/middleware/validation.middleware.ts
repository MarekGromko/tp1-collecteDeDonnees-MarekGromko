import { RequestHandler } from "express";
import { wrapErr } from "@common/ResponseWrapper";

export const ValidationMw = (...validators: ((data: any)=>boolean)[]): RequestHandler=> {
    return (req, res, next)=>{
        if(validators.findIndex(validator=>!validator(req.body))==-1)
            next();
        else
            wrapErr(res).BadRequest().end("body is ill-formed");
    }
}