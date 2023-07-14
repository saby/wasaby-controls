import {TColumnKey as TBaseColumnKey} from 'Controls/gridReact';

export type TItemKey = string | number | null;
export type TColumnKey = Extract<TBaseColumnKey, string>;
export type TColumnKeys = TColumnKey[];

//TODO: отнести к timelineGrid.
export type TQuantumType = 'hour' | 'day' | 'month';
