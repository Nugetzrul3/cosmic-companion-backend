interface UserDTO {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name?: string;
}

export interface RegisterBody {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface AuthPayload {
    token?: string;
    refreshToken?: string;
    user?: UserDTO;
    error?: string;
}

export interface RefreshPayload {
    token?: string;
    user?: UserDTO;
    error?: string;
}
