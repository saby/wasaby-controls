import { THandleItemClickParams } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';

export interface INewListSchemeProps {
    useCollection: boolean;
}

export interface INewListSchemeHandlers {
    onCheckboxClickNew(itemKey: CrudEntityKey): void;
    onItemClickNew(itemKey: CrudEntityKey, params?: THandleItemClickParams): void;
    onExpanderClick(itemKey: CrudEntityKey): void;
}
