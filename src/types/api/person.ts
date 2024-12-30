import { Role } from './role';

export interface Person {
    _id?: string;
    name: string;
    phone: string;
    dob?: string;
    address?: string;
    odooCustomerId?: string;
    email?: string;
    country?: string;
    password?: string;
    profilePicture?: string;
    role: string | Role;
    fcmTokens?: string[];
    points?: number;
    redeemedPoints?: number;
    addedInOdoo?: boolean;
    performedBy?: string | Person;
    session?: string;
    deletedAt?: string | boolean;
    createdAt?: string;
    updatedAt?: string;
}
