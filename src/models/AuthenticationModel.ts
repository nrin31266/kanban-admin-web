import { Role, UserInfoModel } from "./UserModel";

export interface AuthModel{
    accessToken: string,
    userInfo: UserInfoModel,
}

export interface LogoutRequest{
    token: string
}