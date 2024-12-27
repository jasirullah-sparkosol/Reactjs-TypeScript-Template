// project import
import reducers from './reducers';

// third-party
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// @ts-ignore
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiMiddlewares } from '../api/services';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const APP_NAME = import.meta.env.VITE_APP_NAME as string;

const persistConfig = {
    keyPrefix: APP_NAME.replaceAll(' ', '-').toLowerCase() + '-',
    key: 'store',
    storage: createWebStorage('local'),
    transforms: [
        // For Store Encryption in LocalStorage
        encryptTransform({
            secretKey: 'Developed-By-Jasir-Ullah-Khan',
            onError: function (error: any) {
                console.log('Error during encryption', error);
            }
        })
    ]
    // whitelist : ["amount"],
    // blacklist : ["users"],
};

// Persist All reducers
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(...apiMiddlewares);
    }
});

// Setup React Query listeners for re-fetching on app focus or network change etc
setupListeners(store.dispatch);

// @ts-ignore
const persistor = persistStore(store) as Persistor;

const { dispatch } = store;

interface ReduxPersistedProps {
    children: React.ReactNode;
}

const ReduxPersisted = ({ children }: ReduxPersistedProps) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};

export { store, dispatch, ReduxPersisted };
