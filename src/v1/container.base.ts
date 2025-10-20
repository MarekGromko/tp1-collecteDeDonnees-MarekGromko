/**
 * @file Base functional Service container for DI
 */

import { Container } from "@snap/ts-inject";
import { FieldValidation } from "./utility/FieldValidation";
import { DataLayerImpl } from "./data/DataLayerImpl";
import { PasswordUtility } from "./utility/PasswordUtility";
import loggerFactory from "./utility/LoggerFactory";

export const baseContainer = Container
    .providesValue('FieldValidation', new FieldValidation)
    .providesValue('IDataLayer', new DataLayerImpl)
    .providesValue('PasswordUtility', new PasswordUtility)
    .providesValue('LoggerFactory', loggerFactory);