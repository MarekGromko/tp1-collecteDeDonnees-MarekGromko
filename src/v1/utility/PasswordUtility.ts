/**
 * @file Codec for the password digest with metadata
 */
import crypto from 'node:crypto';

/**
 * Decoded format of the password
 */
interface UnwrapPasswordDigest {
    attempts: number;
    lastTry:  number;
    readonly hash: string;
    readonly salt: string
}

/**
 * Utility class to handle all encoding/decoding of password
 *  
 * the digest format is the following, values are in `base64`
 * 
 * `[attempts]:[lastTry]:[hash]:[salt]`
 * 
 * `attempts` & `lastTry` are considered meta data,
 * while `hash` & `salt` are integral part of the password digest
 */
class PasswordUtility{
    /**
     * Generate a random salt (64 bit)
     * 
     * @returns the random salt
     */
    private generateSalt() {
        return crypto.generateKeySync('hmac', {length: 64}).export().toString('base64');
    }
    /**
     * Mix the plain password, the salt then hash it using sha256
     * @param plain - the plain password
     * @param salt - the salt
     * @returns the hash
     */
    private computeHash(plain: string, salt: string): string {
        return crypto.createHash('sha256').update(plain).update(salt).digest('base64');
    }
    /**
     * Compare a digest & a plain password
     * @param digest - the digest
     * @param plain - the plain password
     */
    compare(digest: string, plain: string): boolean {
        const {hash, salt} = this.unwrap(digest);
        return hash === this.computeHash(plain, salt);
    }
    /**
     * Update the metadata of the digest
     * 
     * Set the nb of attempts, and set the lastTry to now
     * 
     * @param digest the digest
     * @param attempts set the number of attempts, or increase the current by 1
     * @returns 
     */
    update(digest: string, attempts: number | 'INCREMENT' ): string {
        let data = this.unwrap(digest);
        if(attempts === 'INCREMENT') 
            data.attempts++
        else 
            data.attempts = attempts;
        data.lastTry = Date.now();
        return this.wrap(data);
    }
    /**
     * Generate a new digest from a plainPassword
     * 
     * @param plainPassword 
     * @returns the digest
     */
    digest(plainPassword: string): string {
        const salt = this.generateSalt();
        const hash = this.computeHash(plainPassword, salt);
        return this.wrap({
            salt,
            hash,
            lastTry: Date.now(),
            attempts: 0
        })
    }
    /**
     * Unwrap the digest to access the metadata, hash & salt
     * @param digest 
     * @returns the unwrap password object
     */
    unwrap(digest: string): UnwrapPasswordDigest {
        const data = digest.split(':');
        const attempts  = Buffer.from(data[0], 'base64').readUInt32BE();
        const lastTry   = Number(Buffer.from(data[1], 'base64').readBigUint64BE());
        const hash      = data[2];
        const salt      = data[3];
        return {attempts, lastTry, hash, salt};
    }
    /**
     * Wrap a UnwrapPassowrdDigest into a string
     * 
     * @param unwrapped - the object
     * @returns the digest
     */
    wrap(unwrapped: UnwrapPasswordDigest) {
        const buf = Buffer.alloc(8);
        buf.writeInt32BE(unwrapped.attempts);
        const attempts = buf.subarray(0,4).toString('base64');
        buf.writeBigInt64BE(BigInt(unwrapped.lastTry));
        const lastTry  = buf.toString('base64');
        return `${attempts}:${lastTry}:${unwrapped.hash}:${unwrapped.salt}`
    }
}

export {
    PasswordUtility
}