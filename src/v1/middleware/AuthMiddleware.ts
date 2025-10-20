import { NextFunction, Request, Response } from "express";
import { IUser } from "../core/IUser";
import { AuthService } from "../service/AuthService";
import { LoggerFactory, Logger } from "../utility/LoggerFactory";
import { wrapErr } from "../utility/ResponseWrapper";

/**
 * Authentification middleware
 * 
 * Require the route to be authentified and/or have certain authorization
 * 
 * @requires AuthService
 * @requires LoggerFactory
 * @example
 *  // User only need to be login
 *  app.get("/whitehouse/enter",
 *      authMiddleware.requireAuthorization(),
 *      whiteHouseController.enter
 *  )
 *  // require the user to be login and have the role 'president'
 *  app.get("/nuke", 
 *      authMiddleware.requiredAuthorization((user)=>user.role === 'president'), 
 *      nukeController.nukeTarget
 * )
 */
class AuthMiddleware {
    static readonly inject = ['AuthService', 'LoggerFactory'] as const;
    private logger: Logger
    constructor(
        private service: AuthService,
        loggerFactory: LoggerFactory
    ){
        this.logger = loggerFactory.service('AuthMiddleware');
    }
    /**
     * Maker for the authorization middleware
     * 
     * @param authCheck - callback to the user
     * @param messageOnFailure - Message to log on faillure
     */
    requireAuthorization(authCheck?: (user: IUser)=>boolean, messageOnFailure: string = 'required authorization') {
        const { service, logger } = this;
        return (req: Request, res: Response, next: NextFunction)=>{
            const {skey} = req.cookies;
            const user = service.getSession(skey);
            if(user && (authCheck ? authCheck(user) : true)) {
                next()
            } else {
                logger.error(messageOnFailure);
                user ?
                    wrapErr(res).Forbidden().end(messageOnFailure) :
                    wrapErr(res).Unauthorized().end(messageOnFailure);
            }
        }
    }
}

export {
    AuthMiddleware
}