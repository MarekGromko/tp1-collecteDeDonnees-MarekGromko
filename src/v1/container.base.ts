/**
 * @file Base functional Service container for DI
 */
import { createInjector } from 'typed-inject';
import { FieldValidation } from "./utility/FieldValidation";
import { DataLayerImpl } from "./data/DataLayerImpl";
import { PasswordUtility } from "./utility/PasswordUtility";
import loggerFactory from "./utility/LoggerFactory";

export const baseContainer = createInjector()
    .provideValue('FieldValidation', new FieldValidation)
    .provideValue('IDataLayer', new DataLayerImpl)
    .provideValue('PasswordUtility', new PasswordUtility)
    .provideValue('LoggerFactory', loggerFactory);