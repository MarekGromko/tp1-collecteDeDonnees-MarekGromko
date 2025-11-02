import config from "config";
import bcryt from "bcrypt";

const BCRYPT_ROUNDS = config.get<number>("auth.password.salt-rounds");

export class PasswordEncoder {
    public encode(plainPassword: string): string {
        return bcryt.hashSync(plainPassword, BCRYPT_ROUNDS);
    }
    public compare(plainPassword: string, digest: string): boolean {
        return bcryt.compareSync(plainPassword, digest);
    }
}