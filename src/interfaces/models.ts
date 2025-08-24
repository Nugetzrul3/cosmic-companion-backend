export interface UserAttributes {
    id?: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string
}

export interface UserJWTPayload {
    id?: number,
    email?: string
}
