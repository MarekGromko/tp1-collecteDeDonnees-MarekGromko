import config from "config";
import jwt, {Jwt} from "jsonwebtoken"
import { Request } from "express";
import { User } from "../model/user.model";

const JWT_SECRET  = config.get<string>("auth.jwt.secret");
const JWT_EXPIRES = Duration(config.get<string>("auth.jwt.expires-in")).getSeconds();

interface TokenPayload{
    id: string,
}

export class JwtUtil {
    public static create(user: User.Model): string {
        return jwt.sign({id: user._id.toHexString()}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES 
        });
    }
    public static async parse(req: Request): Promise<User.Model | undefined> {
        let raw_token = req.headers.authorization;
        if(!raw_token || !raw_token.startsWith("Bearer "))
            return;
        raw_token = raw_token.slice(7);
        let payload: any
        try {
            payload = jwt.verify(raw_token, JWT_SECRET, { complete: false}) as TokenPayload;
        } catch (err: unknown) {
            return;
        }
        const user = await User.Model.findById(payload.id);
        if(!user) 
            return;
        return user;
    }
}