/**
 * @file Final functional Service container for DI
 */
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
import { DataLayerImpl } from "./data/DataLayerImpl";

const final = baseContainer.createChildInjector()
    .provideClass("IDataLayer", DataLayerImpl)
    .provideClass('AuthService', AuthService)
    .provideClass('MediaService', MediaService)
    .provideClass('FilmService', FilmService)
    .provideClass('SerieService', SerieService)
    .provideClass('UserService', UserService)
    .provideClass('MediaController', MediaController)
    .provideClass('FilmController', FilmController)
    .provideClass('SerieController', SerieController)
    .provideClass('UserController', UserController)
    .provideClass('AuthController', AuthController)
    .provideClass('FilmValidationMiddleware', FilmValidationMiddleware)
    .provideClass('SerieValidationMiddleware', SerieValidationMiddleware)
    .provideClass('AuthMiddleware', AuthMiddleware);
    
export default final;