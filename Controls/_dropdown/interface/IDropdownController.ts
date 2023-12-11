/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { Control, IControlOptions } from 'UI/Base';
import { IMenuPopupOptions } from 'Controls/_menu/interface/IMenuPopup';
import { RecordSet } from 'Types/collection';
import { IStickyPosition } from 'Controls/popup';
import { Model } from 'Types/entity';
export type TKey = string | number | null;

export default interface IDropdownController {
    loadItems(): Promise<unknown>;
    reload(): Promise<RecordSet>;
    setItems(items?: RecordSet): Promise<RecordSet>;
    setHistoryItems(history?: RecordSet): void;
    update(newOptions: IDropdownControllerOptions): Promise<RecordSet> | void;
    loadDependencies(): Promise<unknown[]>;
    setMenuPopupTarget(target: HTMLElement): void;
    openMenu(popupOptions?: object): Promise<unknown[]>;
    closeMenu(): void;
    destroy(): void;
    getPreparedItem(item: Model): Model;
    handleSelectorResult(selectedItems: RecordSet): void;
    updateHistoryAndCloseMenu(selectedItem: Model): void;
    getItems(): RecordSet<Model>;
}

export interface IDropdownControllerOptions extends IControlOptions, IMenuPopupOptions {
    keyProperty: string;
    buildByItems?: boolean;
    notifyEvent?: Function;
    lazyItemsLoading?: boolean;
    reloadOnOpen?: boolean;
    selectedItemsChangedCallback?: Function;
    dataLoadErrback?: Function;
    historyId?: string;
    historyNew?: string;
    maxHistoryVisibleItems?: number;
    allowPin?: boolean;
    width?: number;
    popupClassName?: string;
    markerVisibility?: string;
    openerControl?: Control;
    targetPoint?: IStickyPosition;
    additionalProperty?: string;
    hasIconPin?: boolean;
    showHeader?: boolean;
    headConfig?: object;
    footerVisibility?: string;
}
