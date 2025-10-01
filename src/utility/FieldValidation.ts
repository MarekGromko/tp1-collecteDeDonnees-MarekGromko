/**
 * @file Common validation for field type
 */

const titleRegex = /[a-zA-Z0-9 ]+/;
const platformRegex = /[a-zA-Z]+/;
const durationRegex = /[1-9][0-9]*/;
const statusRegex = /(ongoing)|(done)/;

const isStr = (x:unknown)=>typeof x === 'string'; 

const isInt = (x:unknown)=>typeof x === 'number' && Number.isInteger(x);

/**
 * Class to validation many field
 */
class FieldValidation {
    title(value: any): boolean {
        return isStr(value) && titleRegex.test(value);
    }
    genre(value: any): boolean {
        return isStr(value) && !!value.trim();
    }
    platform(value: any): boolean {
        return isStr(value) && platformRegex.test(value);
    }
    year(value: any): boolean {
        return (
            isInt(value) &&
            value > 0 && value <= (new Date()).getFullYear()
        )
    }
    rating(value: any): boolean {
        return (
            isInt(value) &&
            value >= 0 && value <= 5
        );
    }
    filmDuration(value: any): boolean{
        return isInt(value) && durationRegex.test(value.toString());
    }
    serieStatus(value: string): boolean {
        return statusRegex.test(value);
    }
}

export { 
    FieldValidation,
}