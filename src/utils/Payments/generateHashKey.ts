import crypto from 'crypto';


export function generateHash(hashKey: string, dataToHash: string): string {

    const hmac = crypto.createHmac('sha512', hashKey); 
    hmac.update(dataToHash, 'utf8');
    return hmac.digest('base64');
}
