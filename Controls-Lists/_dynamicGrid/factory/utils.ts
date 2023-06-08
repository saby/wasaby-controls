import { RecordSet } from 'Types/collection';
import { IColumnsNavigation } from './IDynamicGridFactory';
import { CrudEntityKey } from 'Types/source';
import {
    INavigationPositionSourceConfig,
    TNavigationDirection,
} from 'Controls/interface';
import { unstable_batchedUpdates } from 'react-dom';

interface IApplyColumnsDataParams {
    items: RecordSet;
    columnsData: RecordSet;
    columnsDataProperty: string;
}

export function applyColumnsData(props: IApplyColumnsDataParams): void {
    const { items, columnsData, columnsDataProperty } = props;

    if (!items) {
        return;
    }

    // unstable_batchedUpdates(() => {
    //items.setEventRaising(false, true);

    items.forEach((item) => {
        if (columnsData) {
            const columnsDataItem = columnsData.getRecordById(item.getKey());
            if (columnsDataItem) {
                item.set(
                    columnsDataProperty,
                    columnsDataItem.get(columnsDataProperty)
                );
            }
        } else {
            item.set(columnsDataProperty, null);
        }
    });

    //items.setEventRaising(true, true);
    // });
}

export interface IPrepareLoadColumnsFilter {
    filter: {};
    columnsNavigation: IColumnsNavigation;
    actualPosition?: CrudEntityKey;
    actualDirection?: TNavigationDirection;
}

export function prepareLoadColumnsFilter(props: IPrepareLoadColumnsFilter) {
    const { field, direction, limit, position } =
        props.columnsNavigation.sourceConfig;
    const { actualPosition, filter, actualDirection } = props;

    const dynamicColumnsFilter = {
        direction: actualDirection !== undefined ? actualDirection : direction,
        position: actualPosition !== undefined ? actualPosition : position,
        limit,
    };

    return {
        ...filter,
        [field]: dynamicColumnsFilter,
    };
}

export interface IPrepareLoadColumnsNavigation {
    field: string;
    itemsCount: number;
    position: CrudEntityKey;
}

export function prepareLoadColumnsNavigation(
    props: IPrepareLoadColumnsNavigation
): INavigationPositionSourceConfig {
    const { field, itemsCount, position } = props;
    return {
        field,
        position,
        limit: itemsCount,
        direction: 'forward',
    };
}
