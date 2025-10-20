/**
 * @file Common type & interface accross the project
 */

/**
 * Common type for services which return an error string
 * and void/data on success
 * 
 * this is limited if the service return a string
 * 
 * @example
 * // expect 'DataNotFound' or 'InternalError' on error
 * // expect an array of Data on success
 * function getDataById(id: number): ServiceResult<'DataNotFound', 'InternalError', Data[]>
 */
type ServiceResult<F extends string, S = void> = 
    F | S;

export { ServiceResult };