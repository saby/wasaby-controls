import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { ITreeControlItem } from 'Controls-Lists-editors/_columnsEditor/utils/markup';
export interface IColumnValue {
    initCaption: string;
    displayProperty: string;
}

type TEditorActions = 'edit' | 'add' | 'delete' | 'move';
interface IEditorSavedOptions {
    emptyFolders?: ITreeControlItem[];
}
interface IEditorActions {
    items: ITreeControlItem | ITreeControlItem[];
    action: TEditorActions;
    savedOptions?: IEditorSavedOptions;
}

export interface IEditingValue {
    caption?: string;
    columnValue?: IColumnValue;
    columnSeparatorSize?: {
        left: string | null;
        right: string | null;
    };
    width?: string;
    textOverflow?: boolean;
    align?: string;
    subTree?: IEditorActions;
}

export abstract class BaseEditor {
    _value: IEditingValue = {};
    getValue(): object {
        return this._value;
    }
    abstract getMetaType(): object;
    abstract updateValue(oldValue: IMarkupValue, newProperties: IEditingValue): IMarkupValue;
}
