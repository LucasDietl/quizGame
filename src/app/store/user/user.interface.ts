export interface User {
    firstName: string;
    lastName: string;
    nickName: string;
}

export interface AuthUser  extends User {
    id: string;
}