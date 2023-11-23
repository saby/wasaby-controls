/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import rk = require('i18n!Controls');
import Controller from 'Controls/_dropdown/_Controller';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { IDropdownControllerOptions } from './interface/IDropdownController';
import { process } from 'Controls/error';
import { TKey } from '../interface';

export function prepareEmpty(emptyText?: boolean | string): string {
    if (emptyText) {
        return emptyText === true ? rk('Не выбрано') : emptyText;
    }
}

export function isSingleSelectionItem(
    item: Model,
    text: string,
    keyProperty: string,
    key: TKey = null
): boolean {
    return text && (!item || item.get(keyProperty) === key);
}

export function loadItems(
    controller: Controller,
    options?: IDropdownControllerOptions
): Promise<unknown> | void {
    const source = options.source;
    const items = options.items;

    if (items && options.buildByItems) {
        controller.setItems(items);
    } else if (options.selectedItems) {
        controller.setSelectedItems(options.selectedItems);
    } else if (
        options.sourceController &&
        options.sourceController.getItems() &&
        // https://online.sbis.ru/opendoc.html?guid=a34c30d7-4a3f-44e4-9f5e-14e72f557bba&client=3
        (!options.task1189343904 || isEqual(options.filter, options.sourceController.getFilter()))
    ) {
        return controller.setItems(options.sourceController.getItems());
    } else if (source) {
        return controller.loadItems().catch((error) => {
            process({ error });
        });
    } else if (items) {
        controller.setItems(items);
    }
}

export function loadSelectedItems(
    controller: Controller,
    options?: IDropdownControllerOptions
): Promise<unknown> | void {
    if (
        (options.sourceController && options.sourceController.getItems()) ||
        options.items ||
        options.selectedItems
    ) {
        return loadItems(controller, options);
    } else if (options.source) {
        return controller.loadSelectedItems().catch((error) => {
            process({ error });
        });
    }
}
