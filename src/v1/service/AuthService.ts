/**
 * @file Authentification services & session services
 * 
 * This must be a singleton throughout the app
 */

import { IDataLayer } from "../core/IDataLayer";
import { IUser } from "../core/IUser";
import { ServiceResult } from "../core/common";
import { LoggerFactory, Logger } from "../utility/LoggerFactory";
import { PasswordUtility } from "../utility/PasswordUtility";
import crypto from "node:crypto";
import User from "../model/User";
import env from "../utility/EnvStore";

// time before session are deleted
const SESSION_TIMEOUT_MS    = env.requiredInt('SESSION_TIMEOUT_MS') as number;
// maximum amount of wrong password attempts
const PWD_MAX_ATTEMPTS      = env.requiredInt('PWD_MAX_ATTEMPTS') as number;
// time to timeout the password attempts
const PWD_TIMEOUT_MS        = env.requiredInt('PWD_TIMEOUT_MS') as number;

/**
 * Detail of a session
 * @inner
 * @field `timeout` - future date that trigger timeout
 */
interface SessionDetails{
    timeout: number, 
    user: IUser
}

// TODO: Disallow multiple session for the same user

/**
 * Barebone authentification & session service
 * 
 * **WARNING** this is not coupled with the database, session will persist even if a user is deleted
 * 
 * @requires IDataLayer
 * @requires PasswordUtility
 * @requires LoggerFactory
 */
class AuthService {
    static readonly inject = ['IDataLayer', 'PasswordUtility', 'LoggerFactory'] as const;
    private logger: Logger
    private sessions: Map<string, SessionDetails>;
    constructor(
        private db: IDataLayer,
        private pwdUtil: PasswordUtility,
        loggerFactory: LoggerFactory
    ){
        this.logger            = loggerFactory.service('AuthService');
        this.sessions       = new Map<string, SessionDetails>();

        // TODO: allow for interval to only exists when there is active ssessions
        // there is no reason to keep such free form interval otherwise
        setInterval(()=>{
            this.cleanupSessions();
        }, 60000);
    }
    /**
     * remove inactive session (good for memory)
     */
    private cleanupSessions(): void {
        const {sessions}    = this;
        const entries       = sessions.entries();
        const now           = Date.now();
        this.logger.debug(`cleanup sessions [${sessions.size} open sessions]`)
        for(let [key, data] of entries) {
            if(data.timeout >= now)
                sessions.delete(key);
        }
    }
    /**
     * Generate a session key in hex using HMAC
     * 
     * @returns a session key
     */
    private generateKey(): string {
        let key: string;
        do {
            key = crypto.generateKeySync('hmac', {length: 256}).export().toString('hex');
        } while(this.sessions.has(key));
        return key;
    }
    /**
     * Get the active user for some session
     * 
     * @param skey - the key
     * @returns 
     */
    getSession(skey: any): IUser | undefined {
        const details = this.sessions.get(skey);
        if(!details) 
            return;
        // should not return the user either if the timeout was scheduled
        if(details.timeout <= Date.now()) {
            this.sessions.delete(skey);
            return;
        }
        details.timeout = Date.now() + SESSION_TIMEOUT_MS;
        return details.user;
    }
    /**
     * Generate a new session key for a user
     * 
     * @param user - user to match in the session 
     * @returns 
     */
    newSession(user: IUser): string {
        const key = this.generateKey();
        this.sessions.set(key, {
            timeout: Date.now() + SESSION_TIMEOUT_MS,
            user
        });
        return key;
    }
    /**
     * Delete a session
     * 
     * @param skey - session key
     */
    endSession(skey: string): void {
        this.sessions.delete(skey);
    }
    /**
     * Log in a user using email & plainPassword
     * 
     * @param email - the email
     * @param plainPassword - the plain password
     * 
     * ### Errors
     * @returns `UserNonexistent` - when the email matched no user in the db
     * @returns `BadPassword` - password did not match
     * @returns `UserTimeout` - User is in timeout, did not try to match the password
     * ### Sucess
     * @returns a session key
     */
    login(email: string, plainPassword: string): ServiceResult<'UserNonexistent' | 'BadPassword' | 'UserTimeout', string> {
        const {db, pwdUtil} = this;
        db.pullDb();
        // get the user
        const user = db.read('user', {
            map:    row=>User.from(row),
            where:  row=>row.email === email,
            limit: 1
        })[0];

        // if no user return error
        if(!user) 
            return db.abortDb(), 'UserNonexistent';

        // unwrap the password digest to get metadata on last tries & nb of attempts
        const pwd = pwdUtil.unwrap(user.password);

        // check if the user has exceeded the number of password attempts
        if(pwd.attempts >= PWD_MAX_ATTEMPTS && (Date.now() - pwd.lastTry) < PWD_TIMEOUT_MS) {
            return db.abortDb(), 'UserTimeout';
        }

        // compare password
        if(!pwdUtil.compare(user.password, plainPassword)) {
            // if comparaison fail, update the password metadata
            db.update<IUser>('user', {
                where: row=>row.id===user.id,
                set: (row)=>({...row, password: pwdUtil.update(row.password, "INCREMENT")})
            }),
            db.pushDb();
            return 'BadPassword';
        }
        
        // on sucess, update the user password 
        user.password = pwdUtil.update(user.password, 0);
        db.update<IUser>('user', {
            where: row=>row.id===user.id,
            set: (row)=>({...row, password: user.password})
        });
        db.pushDb();
        return this.newSession(user);
    }
    /**
     * Register a new user
     * 
     * @param email - the user's email
     * @param plainPassword - the plain password
     * ### Errors
     * @returns `UserAlreadyExists` - email already in use
     */
    register(email: string, plainPassword: string): ServiceResult<'UserAlreadyExists'> {
        const {db, pwdUtil} = this;
        db.pullDb();
        let user = db.read('user', {
            map:    row=>User.from(row),
            where:  row=>row.email == email,
            limit: 1
        })[0];

        // if user already exists, error
        if(user) return db.abortDb(), 'UserAlreadyExists';

        const pwdDigest = pwdUtil.digest(plainPassword);
        db.insert('user', {
            values: key=>[new User(key, email, pwdDigest, 'user', [])]
        })
        db.pushDb();
    }
}

export {
    AuthService
}