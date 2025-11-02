import { ErrorRequestHandler, Request, Response } from "express"
import { ErrorHandler, Middleware, Route } from "@common/decorator/controller.decorator";
import { AuthorizedRequest, PreAuthorizeMw } from "../middleware/security.middleware";
import { PatchUserRequest, UserDetailResponse } from "../dto/user.dto";
import { Movie } from "../model/movie.model";
import { Serie } from "../model/serie.model";
import { wrapErr, wrapOk } from "@common/ResponseWrapper";
import { ValidationMw } from "../middleware/validation.middleware";
import { Types } from "mongoose";
import { User } from "../model/user.model";

const favoritesMapper = (fav: User['favorites'][number]) => {
    switch (fav.kind) {
        case 'Movie': {
            let { genres, title, durationMin,
                ...item
            } = fav.itemRef as Movie.Model;
            return {
                kind: 'Movie',
                id: item._id.toHexString(),
                title,
                genres,
                durationMin,
                synopsis: item.synopsis || null,
                releaseDate: item.releaseDate ? item.releaseDate.toISOString() : null
            } as const
        }
        case 'Serie': {
            let { title, genres, status,
                ...item
            } = fav.itemRef as Serie.Model
            return {
                kind: 'Serie',
                id: item._id.toHexString(),
                title,
                genres,
                status
            } as const
        }

    }
}

export class UserController {
    public readonly inject = [] as const;

    @Middleware(PreAuthorizeMw())
    @Route("GET", "/me")
    async getUserInfo(req: AuthorizedRequest, res: Response) {
        const user = req.principal;
        await user.populate("favorites.itemRef");
        const response: UserDetailResponse = {
            username: user.username,
            email: user.email,
            role: user.role,
            favorites: user.favorites.map(favoritesMapper)
        };
        wrapOk(res).Ok().end(response);
    }
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

        let favorites = user.favorites.map(fav => ({
            ...fav,
            itemRef: fav.itemRef as Types.ObjectId
        }));
        if (toPatch.favoritesToRemove !== undefined)
            for (let toRemove of toPatch.favoritesToRemove)
                favorites = favorites.filter(fav => fav.kind == toRemove.kind && fav.itemRef.equals(toRemove.id));
        if (toPatch.favoritesToAdd !== undefined)
            for (let toAdd of toPatch.favoritesToAdd)
                favorites.push({ kind: toAdd.kind, itemRef: new Types.ObjectId(toAdd.id) });
        if (toPatch.favoritesToAdd || toPatch.favoritesToRemove)
            user.set("favorites", favorites);
        await user.save();
        wrapOk(res).NoContent();
    }

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
            favorites: user.favorites.map(favoritesMapper)
        };
        wrapOk(res).Ok().end(response);
    }
}