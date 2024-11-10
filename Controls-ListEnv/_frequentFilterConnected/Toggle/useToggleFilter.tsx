import * as React from 'react';
import { IFilterItem } from 'Controls/filter';
import { Logger } from 'UI/Utils';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

export interface IToggleFilterProps {
    storeId?: string | string[];
    filterNames?: string[];
    items?: RecordSet;
    multiSelect?: boolean;
}

export interface IUseToggleFilter {
    toggleItem: IFilterItem;
    applyToggleFilterItem: Function;
}

const CONTROL_FILTER_NAME_INDEX = 0;

function getFilterName(filterNames: string[]): string {
    return filterNames[CONTROL_FILTER_NAME_INDEX];
}

function getTextValue(
    selectedKey: TKey | TKey[],
    { editorOptions }: IFilterItem,
    items: RecordSet
): string {
    const displayProperty = editorOptions.displayProperty || 'title';
    const item = (editorOptions.items || items).getRecordById(selectedKey);
    return item.get(displayProperty) || item.get('caption');
}

function getTextValues(
    selectedKeys: TKey | TKey[],
    toggleItem: IFilterItem,
    items: RecordSet
): string {
    if (Array.isArray(selectedKeys)) {
        const textValues = [];
        selectedKeys.forEach((key) => {
            const text = getTextValue(key, toggleItem, items);
            textValues.push(text);
        });
        return textValues.join(', ');
    }

    return getTextValue(selectedKeys, toggleItem, items);
}

function getFilterSourceByValue(
    items: RecordSet,
    selectedKeys: TKey | TKey[],
    filterSource: IFilterItem[],
    filterNames: string[],
    toggleItem: IFilterItem
): IFilterItem[] {
    if (!filterSource) {
        return;
    }
    return filterSource.map((item) => {
        const newItem = { ...item };

        if (newItem.name === getFilterName(filterNames)) {
            newItem.value = selectedKeys;
            newItem.textValue = getTextValues(selectedKeys, toggleItem, items);
        }

        return newItem;
    });
}

function validateStoreId(storeId: string | string[]) {
    if (storeId === undefined) {
        Logger.warn(
            'Для работы контролов' +
                ' Controls-ListEnv/frequentFilter:Chips и Controls-ListEnv/frequentFilter:Tumbler' +
                ' необходимо указать опцию storeId'
        );
    }
}

const { useMemo, useEffect, useCallback } = React;

/**
 * Хук для получения описания toggle фильтров.
 * @private
 */
export function useToggleFilter(props: IToggleFilterProps): IUseToggleFilter {
    const { filterDescription, applyFilterDescription } = useFilterDescription(props);

    useEffect(() => {
        validateStoreId(props.storeId);
    }, [props.storeId]);

    const toggleItem = useMemo(() => {
        const filterName = getFilterName(props.filterNames);
        return filterDescription.find(({ name }) => {
            return name === filterName;
        });
    }, [props.filterNames, filterDescription]);

    const applyToggleFilterItem = useCallback(
        (selectedKeys) => {
            const newFilterSource = getFilterSourceByValue(
                props.items,
                selectedKeys,
                filterDescription,
                props.filterNames,
                toggleItem
            );
            applyFilterDescription(newFilterSource);
        },
        [filterDescription, props.items, props.filterNames]
    );

    return {
        toggleItem,
        applyToggleFilterItem,
    };
}
