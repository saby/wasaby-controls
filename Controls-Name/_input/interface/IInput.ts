import { IControlOptions, TemplateFunction } from 'UI/Base';
import { ICrud } from 'Types/source';
import { IBaseOptions } from 'Controls/input';

export interface INameValue {
    firstName?: string;
    middleName?: string;
    lastName?: string;
}

export interface IInputOptions extends IBaseOptions, IControlOptions {
    value: INameValue;
    fields: string[];
    placeholders?: string[];
    inputOrder: string[];
    showReorderButton: boolean;
    source: ICrud;
    reorderButtonSize: string;
    rightFieldTemplate?: TemplateFunction | string;
    trim?: boolean;
}

export interface INameInputReceivedState {
    serverSide: boolean;
}

export interface INamePart {
    id: string;
    value: string;
    placeholder: string;
    placeholderWidth?: number;
    width?: number;
    marked?: boolean;
}

export interface ISpacePosition {
    offset: number;
    subStrBefore: string;
    subStrAfter: string;
    inputId: string;
    separator?: number;
}

export interface ISelection {
    start: number;
    end: number;
    length: number;
}

export interface IProcessKeyboardOption {
    keyCode: number;
    shiftKey?: boolean;
    selection: ISelection;
    inputValue: string;
    inputId: string;
}

export interface IKeyboardEventAction {
    input: string;
    position: string;
    preventDefault?: boolean;
}

export interface IDragAction {
    inputId: string;
    value: string;
}

export interface IDragObject {
    entity: { getOptions(): { idx: number } };
    offset: { x: number; y: number };
    position: { x: number; y: number };
}
