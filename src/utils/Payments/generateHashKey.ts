import crypto from 'crypto';


// export function generateHash(hashKey: string, dataToHash: string): string {
//   if (!hashKey || !dataToHash) {
//     throw new Error("HashKey or DataToHash missing for hash generation.");
//   }

//   // UTF-8 Buffer হিসেবে Secret Key এবং Data এনকোড করা
//   const hmac = crypto.createHmac("sha512", Buffer.from(hashKey.trim(), "utf-8"));
//   hmac.update(Buffer.from(dataToHash.trim(), "utf-8"));

//   return hmac.digest("base64");
// }



export function generateHash(hashKey: string, dataToHash: string): string {
  if (!hashKey || !dataToHash) {
    throw new Error("HashKey or DataToHash missing for hash generation.");
  }

  // 🎯 UTF-8 Buffer - এটি দিয়ে GetToken সফলভাবে কাজ করে
  const hmac = crypto.createHmac("sha512", Buffer.from(hashKey.trim(), "utf-8"));
  hmac.update(Buffer.from(dataToHash.trim(), "utf-8"));

  return hmac.digest("base64");
}