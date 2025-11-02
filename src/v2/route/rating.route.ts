import { ControllerFacade } from "@common/decorator/controller.decorator";
import { Router } from "express";
import { containerFinal } from "../container.final";

const router     = Router();
const controller = containerFinal.resolve('RatingController');

ControllerFacade.wireRouteEndpoint(router, controller);
ControllerFacade.wireErrorEndpoint(router, controller);

export default router;