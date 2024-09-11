import { IHotKey } from './IHotKey';

export interface IHotKeyObserver {
    canExecute: (hotKey: IHotKey) => string;
    execute: (actionId: string) => void;
}
