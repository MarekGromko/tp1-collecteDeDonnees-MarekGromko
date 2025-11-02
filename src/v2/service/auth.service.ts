import config from "config";
import { PasswordEncoder } from "../utility/password.utility";
import { User } from "../model/user.model";

const PWD_LOCKOUT      = Duration.parse(config.get<string>('auth.password.lockout-duration'));
const PWD_MAX_ATTEMPTS = config.get<number>('auth.password.max-attempts');

export namespace AuthError {
    export class UserNotFound extends Error{
        constructor(){ super("Could not find user"); }
    }
    export class PasswordMismatch extends Error{
        constructor(){ super("Password do not match"); }
    }
    export class UserLockout extends Error{
        constructor(){ super("User is lockout"); }
    }
    export class UserAlreadyExists extends Error{
        constructor(
            public readonly field: string
        ){ super("User already exists"); }
    }
}

export class AuthService{
    static readonly inject = ["PasswordEncoder"] as const;
    private pwdEncoder: PasswordEncoder;
    constructor( 
        pwdEncoder: PasswordEncoder
    ) {
        this.pwdEncoder = pwdEncoder;
    }
    public async login(username: string, plainPassword: string): Promise<User.Model> {
        const {pwdEncoder} = this;
        // check if user exist
        const user = await User.Model.findOne({ 'username': username }).exec();
        if(!user) 
            throw new AuthError.UserNotFound();
        
        // check if user is lockout
        if( user.password.attempts >= PWD_MAX_ATTEMPTS &&
            +PWD_LOCKOUT.addTo(user.password.lastAttempt) > Date.now()
        ) 
            throw new AuthError.UserLockout();
        
        // check password match
        if(!pwdEncoder.compare(plainPassword, user.password.digest))
            throw new AuthError.PasswordMismatch();
        
        user.password = {
            ...user.password,
            attempts: 0,
            lastAttempt: new Date()
        }
        await user.save();
        return user;
    }
    public async register(email: string, username: string, plainPassword: string): Promise<User.Model> {
        // check if user does not exists
        let user = await User.Model.findOne({ $or: [
            { username: username },
            { email: email }
        ]}).exec();
        if(user) throw new AuthError.UserAlreadyExists(user.email === email ? 'email' : 'username')
        //
        user = new User.Model({
            email,
            username,
            role: 'user',
            password: {
                lastAttempt: new Date(),
                attempts: 0,
                digest: this.pwdEncoder.encode(plainPassword)
            },
            favorites: []
        });
        await user.save();
        return user;
    }
}