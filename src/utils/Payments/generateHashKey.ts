import crypto from 'crypto';

// ১. সঠিক ফাংশন স্ট্রাকচার
export function generateHash(hashKey: string, dataToHash: string): string {
    // Step 1 & 2: UTF8 এনকোডেড কি দিয়ে HMACSHA512 তৈরি করা
    const hmac = crypto.createHmac('sha512', hashKey); 

    // Step 3: Compute Hash using data (userName)
    hmac.update(dataToHash, 'utf8');
    
    // Step 4: Return Base64 string of Hash
    return hmac.digest('base64');
}
