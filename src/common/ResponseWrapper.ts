/**
 * @file Descriptive response helper
 * 
 * Inpired by Java ResponseEntity
 */

import { Response } from "express";

/**
 * Wrap for erroneous response
 * 
 * @param res the response object
 * @returns the wrapper
 */
export const wrapErr = (res: Response)=>{
    const wrapper = {
        BadRequest: ()=>(res.status(400), wrapper),
        Unauthorized: ()=>(res.status(401), wrapper),
        Forbidden: ()=>(res.status(403), wrapper),
        NotFound: ()=>(res.status(404), wrapper),
        InternalError: ()=>(res.status(500), wrapper),
        ServiceUnavailable: ()=>(res.status(503), wrapper),
        Conflict: ()=>(res.status(409), wrapper),
        end: (error: string, extended: object = {})=>{
            res.send({error, ...extended}).end();
        }
    }
    return wrapper
}

/**
 * Wrap for sucessful response
 * 
 * @param res the response object
 * @returns the wrapper
 */
export const wrapOk = (res: Response)=>{
    const wrapper = {
        Ok: ()=>(res.status(200), wrapper),
        Created: ()=>(res.status(201), wrapper),
        NoContent: ()=>(void res.status(204).end()),
        end: (data?: any)=>{
            if(data !== undefined)
                res.send(data);
            res.end();
        }
    }
    return wrapper;
}