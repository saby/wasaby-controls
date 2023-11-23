import { CrudEntityKey } from 'Types/source';
import { TColumnKey as TBaseColumnKey } from 'Controls/gridReact';

export type TItemKey = CrudEntityKey;
export type TColumnKey = TBaseColumnKey;
export type TColumnKeys = TColumnKey[];

//TODO: отнести к timelineGrid.
export type TQuantumType = 'hour' | 'day' | 'month';

export type TColumnDataDensity = 'empty' | 'default' | 'advanced';
