export const SERVER_URL = "http://localhost:5000";
export const BASE_URL = `${SERVER_URL}/api`;

export const Endpoints ={
    Auth :{
        Login : '/auth/login',
        Register : '/auth/register',
        tockenVerify: '/auth/verify-token',
    },
    User :{
        GetProfile : '/user/profile',
        UpdateProfile : '/user/update-profile',
    },
}
