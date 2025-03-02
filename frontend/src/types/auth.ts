export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    message: string;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export interface Profile {
    email: string;
    username: string;
    name?: string;
    gender?: string;
    birthday?: string;
    height?: number;
    weight?: number;
    interests: string[];
    zodiac?: string;
    horoscope?: string;
    profileImage?: string;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface User {
    id?: string;
    name?: string;
    email: string;
    username: string;
    profileImage?: string;
    gender?: string;
    interests?: string[];
    zodiac?: string;
    horoscope?: string;
}
