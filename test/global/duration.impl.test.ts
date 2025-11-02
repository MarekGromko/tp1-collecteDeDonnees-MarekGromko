import { expect } from 'chai';
import "@src/global/duration.impl"

describe("duration.impl", ()=>{
    describe("parseISO - ISO 8601 implemention", ()=>{
        it("should parse date without times (YMD)", ()=>{
            // arrange 
            const entries = {
                "P1Y":      Duration.YEAR_MS,
                "P4Y7M1D":  4*Duration.YEAR_MS + 7*Duration.MONTHS_MS + 1*Duration.DAY_MS,
                "P16M":     16*Duration.MONTHS_MS,
                "P58D":     58*Duration.DAY_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
        it("should parse time without date (HMS)", ()=>{
            // arrange 
            const entries = {
                "PT1H":         Duration.HOURS_MS,
                "PT3H30M10S":   3*Duration.HOURS_MS + 30*Duration.MINUTE_MS + 10*Duration.SECOND_MS,
                "PT100M":       100*Duration.MINUTE_MS,
                "PT10S20M":     10*Duration.SECOND_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
        it("should parse date and time (YMDHMS)", ()=>{
            // arrange 
            const entries = {
                "P1YT1H":           Duration.YEAR_MS + Duration.HOURS_MS,
                "P4Y7M1DT3H30M10S": 4*Duration.YEAR_MS + 7*Duration.MONTHS_MS + 1*Duration.DAY_MS + 3*Duration.HOURS_MS + 30*Duration.MINUTE_MS + 10*Duration.SECOND_MS,
                "P20DT5S":          20*Duration.DAY_MS + 5*Duration.SECOND_MS,
                "P3MT3M":           3*Duration.MINUTE_MS + 3*Duration.MONTHS_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
    });
    describe("parseISO - ISO 8601 extension", ()=>{
        it("should parse floating point number", ()=>{
            // arrange 
            const entries = {
                "P10.5Y":      10.5*Duration.YEAR_MS,
                "PT0.05M":     0.05*Duration.MINUTE_MS,
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
        it("should parse without starting P", ()=>{
            const entries = {
                "5Y":       5*Duration.YEAR_MS,
                "T40H3S":   40*Duration.HOURS_MS + 3*Duration.SECOND_MS,
                "1D":       Duration.DAY_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
        it("should ignore white spaces", ()=>{
            const entries = {
                "1D T 4S":      Duration.DAY_MS + 4*Duration.SECOND_MS,
                "2Y 10M":       2*Duration.YEAR_MS + 10*Duration.MONTHS_MS,
                "T 1H 30M":     Duration.HOURS_MS + 30*Duration.MINUTE_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
        it("should ignore case", ()=>{
            const entries = {
                "T5m30s":        5*Duration.MINUTE_MS + 30*Duration.SECOND_MS,
                "1m20d":         1*Duration.MONTHS_MS + 20*Duration.DAY_MS,
                "p4y t20m":      4*Duration.YEAR_MS + 20*Duration.MINUTE_MS
            } as Record<string, number>;

            // act
            const durations = Object.keys(entries).map(Duration.parse);

            // assert
            Object.keys(entries).forEach((key: string, i)=>{
                expect(+durations[i]).to.be.eq(entries[key], key);
            });
        });
    });
})