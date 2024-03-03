import { ISelectionObject } from 'Controls/_interface/ISelectionType';
import { TSelectionModel } from './IAbstractSelectionState';

export const SelectionChangeName = 'SET_SELECTED';
export type TSelectionChangeName = typeof SelectionChangeName;

/* Установить выделение по набору ключей */
export interface ISelectionChange {
    name: TSelectionChangeName;
    args: {
        selectionModel: TSelectionModel;
        selectionObject: ISelectionObject;
    };
}

export type TSelectionChanges = ISelectionChange;
