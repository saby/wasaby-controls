import { ISelectionObject } from 'Controls/_interface/ISelectionType';
import { TSelectionModel } from './IAbstractSelectionState';

export const SelectionObjectChangeName = 'SET_SELECTION_OBJECT';
export type TSelectionObjectChangeName = typeof SelectionObjectChangeName;

export const SelectionMapChangeName = 'SET_SELECTION_MAP';
export type TSelectionMapChangeName = typeof SelectionMapChangeName;

/* Установить выделение по набору ключей */
export interface ISelectionChange {
    name: TSelectionObjectChangeName;
    args: {
        selectionObject: ISelectionObject;
    };
}

/* Установить выделение по набору ключей */
export interface ISelectionMapChange {
    name: TSelectionMapChangeName;
    args: {
        selectionModel: TSelectionModel;
    };
}

export type TSelectionChanges = ISelectionChange | ISelectionMapChange;
