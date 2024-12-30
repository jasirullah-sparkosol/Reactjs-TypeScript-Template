import { Person } from './person';

export interface UserGift {
    _id?: string;
    user: string;
    gifts: string[];
    status: string;
    totalPoints: number;
    isExpired?: boolean;
    redeemedBy?: string | Person;
    performedBy?: string | Person;
    redeemedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
