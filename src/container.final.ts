/**
 * @file Final functional Service container for DI
 */
import { CONTAINER, Injectable } from "@snap/ts-inject";
import { FilmService } from "./service/FilmService";
import { MediaService } from "./service/MediaService";
import { SerieService } from "./service/SerieService";
import { UserService } from "./service/UserService";
import { MediaController } from "./controller/MediaController";
import { SerieController } from "./controller/SerieController";
import { UserController } from "./controller/UserController";
import { FilmController } from "./controller/FilmController";
import { FilmValidationMiddleware } from "./middleware/FilmValidationMiddleware";
import { SerieValidationMiddleware } from "./middleware/SerieValidationMiddleware";
import { AuthService } from "./service/AuthService";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { AuthController } from "./controller/AuthController";
import { baseContainer } from "./container.base";

const final = baseContainer
    // make AuthService a lazy singleton
    .provides(Injectable('AuthService', [CONTAINER], (()=>{
        let instance = undefined;
        return (base: typeof baseContainer)=>(
            instance ? instance : 
                (instance = new AuthService(
                    base.get('IDataLayer'), 
                    base.get('PasswordUtility'), 
                    base.get('LoggerFactory')
                ))
        )
    })()))
    .providesClass('MediaService', MediaService)
    .providesClass('FilmService', FilmService)
    .providesClass('SerieService', SerieService)
    .providesClass('UserService', UserService)
    .providesClass('MediaController', MediaController)
    .providesClass('FilmController', FilmController)
    .providesClass('SerieController', SerieController)
    .providesClass('UserController', UserController)
    .providesClass('AuthController', AuthController)
    .providesClass('FilmValidationMiddleware', FilmValidationMiddleware)
    .providesClass('SerieValidationMiddleware', SerieValidationMiddleware)
    .providesClass('AuthMiddleware', AuthMiddleware);
    
export default final;