import { Request, Response } from "express"
import { Middleware, Route } from "@common/decorator/controller.decorator";
import { AuthorizedRequest, PreAuthorizeMw } from "../middleware/security.middleware";
import { PatchUserRequest, UserDetailResponse } from "../dto/user.dto";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { ValidationMw } from "../middleware/validation.middleware";
import { Types } from "mongoose";
import { User } from "../model/user.model";
import { containerBase } from "../container.base";

const LoggerMw = containerBase
    .resolve('LoggerFactory')
    .middleware('SerieController');

export class UserController {
    public readonly inject = [] as const;

    @Middleware(LoggerMw)
    @Middleware(PreAuthorizeMw())
    @Route("GET", "/me")
    async getUserInfo(req: AuthorizedRequest, res: Response) {
        const user = req.principal;
        const response: UserDetailResponse = {
            username: user.username,
            email: user.email,
            role: user.role,
            favorites: user.favorites.map(fav=>({kind: fav.kind, id: fav.itemRef._id.toString('hex')}))
        };
        wrapOk(res).Ok().end(response);
    }
    @Middleware(LoggerMw)
    @Middleware(PreAuthorizeMw())
    @Middleware(ValidationMw(PatchUserRequest.validate))
    @Route("PATCH", "/me")
    async patchUserInfo(req: AuthorizedRequest, res: Response) {
        const user = req.principal;
        const toPatch = req.body as PatchUserRequest;

        if (toPatch.email !== undefined)
            user.set("email", toPatch.email);

        if (toPatch.username !== undefined)
            user.set("username", toPatch.username);

        let favorites = user.favorites;
        if (toPatch.favoritesToRemove !== undefined)
            for (let toRemove of toPatch.favoritesToRemove)
                favorites = favorites.filter(fav => 
                    fav.kind == toRemove.kind && 
                    fav.itemRef._id.equals(toRemove.id)
                );
        
        if (toPatch.favoritesToAdd !== undefined)
            for (let toAdd of toPatch.favoritesToAdd)
                favorites.push({ 
                    kind: toAdd.kind, 
                    itemRef: new Types.ObjectId(toAdd.id) 
                });

        if (toPatch.favoritesToAdd || toPatch.favoritesToRemove)
            user.markModified("favorites");
        await user.save();
        wrapOk(res).NoContent();
    }

    @Middleware(LoggerMw)
    @Middleware(PreAuthorizeMw(user => user.role === 'admin'))
    @Route("GET", "/:id")
    async getUserById(req: Request, res: Response) {
        let id: Types.ObjectId;
        try {
            id = new Types.ObjectId(req.params.id)
        } catch(err: unknown) {
            return wrapErr(res).BadRequest().end("Invalid id");
        }

        const user = await User.Model.findOne({ _id: id });
        if(user === null)
            return wrapErr(res).NotFound().end("User not found");

        const response: UserDetailResponse = {
            username: user.username,
            email: user.email,
            role: user.role,
            favorites: user.favorites.map(fav=>({kind: fav.kind, id: fav.itemRef._id.toString('hex')}))
        };
        wrapOk(res).Ok().end(response);
    }
}