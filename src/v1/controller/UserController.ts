import type { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { wrapErr, wrapOk } from "../utility/ResponseWrapper";

/**
 * Controller for all user related endpoint
 * @requires AuthService
 * @requires LoggerFactory
 */
class UserController{
    static readonly inject = ['UserService'] as const;
    constructor(
        private service: UserService
    ){
        this.getUserFavoriteMedias = this.getUserFavoriteMedias.bind(this);
    }
    /**
     * Endpoint to get the user's favorite medias
     * 
     * ### Expected params
     *  - `:userId` - id of the user
     */
    getUserFavoriteMedias(req: Request, res: Response) {
        const {userId} = req.params;
        const result = this.service.getAllUserMedias(userId)
        switch(result){
            case 'UserNonexistent':
                wrapErr(res).NotFound().end("user not found");
                break;
            default: 
                wrapOk(res).Ok().end(result);
        }
    }
}

export { UserController }