

import dotenv from 'dotenv'
import path from 'path'


dotenv.config({ path: path.join(process.cwd(), ".env") })


export default {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    resend_api_key : process.env.RESEND_API_KEY,


    cloude_name : process.env.CLOUDE_NAME,
    cloude_api_key : process.env.CLOUDE_API_KEY,
    cloude_secret_key : process.env.CLOUDE_SECRET_KEY , 


    jwt_access_secret : process.env.JWT_ACCESS_SECRET,
    jwt_access_expires : process.env.JWT_ACCESS_EXPIRSE,

    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires : process.env.JWT_REFRESH_EXPIRESE,
    
    admin_email : process.env.ADMIN_EMAIL,
    admin_pass : process.env.ADMIN_PASS,
    admin_phone : process.env.AMDIN_MOBILE,



    EPS_Store_Id : process.env.EPS_STORE_ID,
    EPS_Merchant_ID : process.env.EPS_MERCHANT_ID,
    EPS_USER_NAME :process.env.EPS_USER_NAME,
    EPS_HASH_KEY : process.env.EPS_HASH_KEY
}


