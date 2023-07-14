/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';

export interface IOperationsPanelOptions extends IControlOptions {
    source?: Memory;
    items?: RecordSet;
    menuBackgroundStyle: string;
    closeButtonVisible?: boolean;
    menuIcon: string;
    keyProperty: string;
    selectedKeys: TKey[];
    iconSize: string;
    excludedKeys: TKey[];
    itemTemplate?: TemplateFunction;
    operationsPanelOpenedCallback: () => void;
    counterMode: 'menu' | 'link';
    selectionViewMode?: string;
    isAllSelected?: boolean;
    selectedKeysCount?: number | null;
    itemTemplateProperty?: string;
    parentProperty?: string;
    listParentProperty?: string;
    listMarkedKey?: TKey;
    root: TKey;
    fontColorStyle?: string;
    expanded?: boolean;
}
