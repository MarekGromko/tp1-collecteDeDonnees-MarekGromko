import { expect } from 'chai';
import { RegisterRequest } from "../../../src/v2/dto/auth.dto";

describe("auth.dto", ()=>{
    describe("RegisterRequest", ()=>{
        const GOOD_PASSWORD = "P@assword123"
        const GOOD_USERNAME = "test_username"
        const GOOD_EMAIL    = "test@test.com"
        const GOOD_REQUEST  = Object.freeze({
            email:      GOOD_EMAIL,
            username:   GOOD_USERNAME,
            password:   GOOD_PASSWORD
        });
        it("should validate with valid RegisterRequest", ()=>{
            // arrange
            const req = GOOD_REQUEST

            // act & assert
            expect(RegisterRequest.validate(req)).to.be.true;
        });
        it("should not validate with mssing required field (email, username, password", ()=>{
            // arrange
            const reqNoEmail = {...GOOD_REQUEST} as any;
            delete reqNoEmail.email;
            const reqNoUsername = {...GOOD_REQUEST} as any;
            delete reqNoUsername.username;
            const reqNoPassword = {...GOOD_REQUEST} as any;
            delete reqNoPassword.password;

            // act 
            const resultNoEmail     = RegisterRequest.validate(reqNoEmail);
            const resultNoUsername  = RegisterRequest.validate(reqNoUsername);
            const resultNoPassword  = RegisterRequest.validate(reqNoPassword);

            // assert
            expect(resultNoEmail).to.be.false;
            expect(resultNoUsername).to.be.false;
            expect(resultNoPassword).to.be.false;
        })
        it("should not validate ill-formed email", ()=>{
            // arrange
            const reqs = [{
                ...GOOD_REQUEST, 
                email: "bad@email"
            }, {
                ...GOOD_REQUEST, 
                email: "bad.email.com"
            }, {
                ...GOOD_REQUEST, 
                email: "bad@bad@email.com"
            }]

            // act & assert
            reqs.forEach(req=>{
                expect(RegisterRequest.validate(req)).to.be.eq(false, req.email);
            });
        })
        it("should not validate ill-formed username", ()=>{
            // arrange
            const reqs = [{
                ...GOOD_REQUEST, 
                username: "bl" // too short
            }, {
                ...GOOD_REQUEST, 
                username: "abcdefghijklmnoqrstuvwxyz1234567890123124235678977654" // too long
            }, {
                ...GOOD_REQUEST, 
                username: "qqwwee%" // illegal chars
            }]

            // act & assert
            reqs.forEach(req=>{
                expect(RegisterRequest.validate(req)).to.be.eq(false, req.username);
            });
        })
        it("should not validate ill-formed password", ()=>{
            // arrange
            const reqs = [{
                ...GOOD_REQUEST, 
                password: "Qw@1345" // too short
            }, {
                ...GOOD_REQUEST, 
                password: "qweasdzxc@123" // no upper case
            }, {
                ...GOOD_REQUEST, 
                password: "QWEASDZCX@123" // no lower case
            }, {
                ...GOOD_REQUEST, 
                password: "QWEASDzxcCX123" // no special
            }, {
                ...GOOD_REQUEST, 
                password: "QWEASDzxcCX!!@" // no number
            }]

            // act & assert
            reqs.forEach(req=>{
                expect(RegisterRequest.validate(req)).to.be.eq(false, req.password);
            });
        })
        it("should trim email", ()=>{
            // arrange
            const req = {...GOOD_REQUEST};

            // act
            var result = RegisterRequest.validate(req)

            // assert
            expect(result).to.be.true
            expect(req.email).to.be.eq("test@test.com");

        })
    })
})