import { ComponentClass, FunctionComponent } from 'react';

// material-ui
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// types
import { AuthProps } from './auth';
import { MenuProps } from './menu';
import { SnackbarProps } from './snackbar';

// ==============================|| ROOT TYPES ||============================== //

export type RootStateProps = {
    auth: AuthProps;
    menu: MenuProps;
    snackbar: SnackbarProps;
};

export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

export type OverrideIcon =
    | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
          muiName: string;
      })
    | ComponentClass<any>
    | FunctionComponent<any>;

export interface GenericCardProps {
    title?: string;
    primary?: string | number | undefined;
    secondary?: string;
    content?: string;
    image?: string;
    dateTime?: string;
    iconPrimary?: OverrideIcon;
    color?: string;
    size?: string;
}

export type FilterResponseType<T> = {
    page: number;
    pageSize: number;
    totalPages: number;
    data: T[];
    filters: Record<string, any>;
};

export type FilterRequestBodyType = {
    page: number;
    pageSize: number;
    filters?: Record<string, any>;
    populated?: Record<string, any>;
    usedFor?: string;
    withPopulate?: boolean;
};

export const filterOperators: Record<string, string> = {
    _id: 'like',
    name: 'like',
    createdAt: 'date',
    amount: 'range',
    tags: 'like',
    deletedAt: 'exists',
    phone: 'like',
    odooCustomerId: 'range',
    totalPoints: 'range',
    points: 'range',
    redeemedPoints: 'range',
    addedInOdoo: 'eq',
    title: 'like',
    user_name: 'like',
    performedBy_name: 'like',
    redeemedBy_name: 'like',
    gift_name: 'like',
    status: 'eq',
    isExpired: 'eq',
    role_name: 'like',
    customerPhone: 'like',
    invoiceNo: 'like',
    type: 'eq'
};
