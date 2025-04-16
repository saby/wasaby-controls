import { URL } from 'Browser/Transport';
import { Serializer } from 'Types/serializer';
import type { IFilterDescriptionItem } from 'Controls/filter';
import { TKey } from 'Controls/interface';
import { Logger } from 'UI/Utils';

export interface IUrlResult {
    historyItems?: IFilterDescriptionItem[];
    expandedItems?: TKey[];
    root?: TKey;
}

export default function getStateFromUrl(id: string): IUrlResult {
    const urlFilter = URL.getQueryParam('listParams');
    if (urlFilter) {
        const applicationSerializer = new Serializer();
        try {
            // Наличие в строке единичного символа % ломает decodeURIComponent, заменяем его на закодированное значение
            const urlConfig = JSON.parse(
                decodeURIComponent(urlFilter.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25')),
                applicationSerializer.deserialize
            )?.[id];
            const resultState: IUrlResult = {};

            if (urlConfig) {
                resultState.historyItems = urlConfig.filterDescription;

                if (urlConfig.root !== undefined) {
                    resultState.root = urlConfig.root;
                }
                if (urlConfig.expandedItems !== undefined) {
                    resultState.expandedItems = urlConfig.expandedItems;
                }
            }

            return resultState;
        } catch (error) {
            Logger.warn('В url передан невалидный параметр listParams, он не будет применен');
            return {};
        }
    }
    return {};
}
