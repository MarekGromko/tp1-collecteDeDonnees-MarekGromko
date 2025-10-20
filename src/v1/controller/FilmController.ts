import type { Request, Response } from "express";
import { FilmService } from "../service/FilmService";
import { wrapOk } from "../utility/ResponseWrapper";

/**
 * Controller for all films related endpoint
 * @requires FilmService
 */
class FilmController {
    static readonly inject = ['FilmService'] as const;
    constructor(
        private service: FilmService
    ){
        this.postAddFilm = this.postAddFilm.bind(this);
    }
    /**
     * Endpoint to add a film
     */
    public postAddFilm(req: Request, res: Response){
        const film = req.body
        this.service.addFilm(film);
        wrapOk(res).NoContent();
    }
}

export {
    FilmController
}