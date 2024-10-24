import { createContext } from 'react';
import { IHotKey } from '../interface/IHotKey';
import { IHotKeyObserver } from '../interface/IHotKeyObserver';

export interface IHotKeysContext {
    observers: Set<IHotKeyObserver>;
    dispatch: (hotKey: IHotKey) => void;
    register: (newObserver: IHotKeyObserver) => void;
    unregister: (deletedObserver: IHotKeyObserver) => void;
}

export const HotKeysContext = createContext<IHotKeysContext>({});
