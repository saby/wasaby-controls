import { RecordSet } from 'Types/collection';
import { Record, adapter as EntityAdapter, format as EntityFormat } from 'Types/entity';
import { IDynamicColumnsNavigation } from './IDynamicGridFactory';
import { INavigationSourceConfig, TNavigationDirection } from 'Controls/interface';
import { IDynamicColumnsFilter } from '../../dynamicGrid';
import { Logger } from 'UICommon/Utils';
import { date as formatDate } from 'Types/formatter';

interface IApplyColumnsDataParams {
    items: RecordSet;
    loadedItems: RecordSet;
    columnsDataProperty: string;
    dynamicColumnsGridData: (number | object)[];
    direction: Exclude<TNavigationDirection, 'bothways'>;
}

export function applyLoadedColumnsData(
    currentColumnsData: RecordSet,
    newColumnsData: RecordSet,
    loadedDirection: Exclude<TNavigationDirection, 'bothways'>,
    startColumnDataKey: string,
    endColumnDataKey: string
): void {
    currentColumnsData.setEventRaising(false, true);

    if (loadedDirection === 'forward') {
        const startIndex = currentColumnsData.getIndexByValue(
            currentColumnsData.getKeyProperty(),
            startColumnDataKey
        );
        for (let i = 0; i < startIndex; i++) {
            currentColumnsData.removeAt(0);
        }

        currentColumnsData.append(newColumnsData);
    } else {
        const endIndex = currentColumnsData.getIndexByValue(
            currentColumnsData.getKeyProperty(),
            endColumnDataKey
        );
        const columnsDataCount = currentColumnsData.getCount();
        for (let i = endIndex; i < columnsDataCount && endIndex !== -1; i++) {
            currentColumnsData.removeAt(currentColumnsData.getCount() - 1);
        }

        currentColumnsData.prepend(newColumnsData);
    }

    currentColumnsData.setEventRaising(true, true);
}

export function applyLoadedItems(props: IApplyColumnsDataParams): void {
    const { items, loadedItems, columnsDataProperty, dynamicColumnsGridData, direction } = props;

    if (!items) {
        return;
    }

    const startColumnDataKey = dynamicColumnsGridData[0];
    const endColumnDataKey = dynamicColumnsGridData[dynamicColumnsGridData.length - 1];
    const startColumnDataKeyString =
        startColumnDataKey instanceof Date
            ? formatDate(startColumnDataKey, 'YYYY-MM-DD HH:mm:ss')
            : startColumnDataKey;
    const endColumnDataKeyString =
        endColumnDataKey instanceof Date
            ? formatDate(endColumnDataKey, 'YYYY-MM-DD HH:mm:ss')
            : endColumnDataKey;

    if (loadedItems) {
        loadedItems.forEach((columnsDataItem) => {
            const originalItem = items.getRecordById(columnsDataItem.getKey());
            if (originalItem) {
                const currentColumnsData = originalItem.get(columnsDataProperty);
                const newColumnsData = columnsDataItem.get(columnsDataProperty);
                // У узлов нет данных по колонкам
                if (!currentColumnsData) {
                    return;
                }
                if (!newColumnsData) {
                    Logger.error(
                        `При подгрузке колонок не вернули columnsData для записи="${originalItem.getKey()}"`
                    );
                    return;
                }

                applyLoadedColumnsData(
                    currentColumnsData,
                    newColumnsData,
                    direction,
                    startColumnDataKeyString,
                    endColumnDataKeyString
                );
            } else {
                items.add(columnsDataItem);
            }
        });

        const itemsToRemove = [];
        items.forEach((item) => {
            const hasItemInLoadedItems = loadedItems.getRecordById(item.getKey());
            if (!hasItemInLoadedItems) {
                itemsToRemove.push(item);
            }
        });
        itemsToRemove.forEach((it) => items.remove(it));
    }
}

export interface IPrepareDynamicColumnsFilter<TPosition = number> {
    columnsNavigation: IDynamicColumnsNavigation<TPosition>;
    actualPosition?: unknown;
    actualDirection?: TNavigationDirection;
}

export function prepareDynamicColumnsFilter<TPosition = number>(
    props: IPrepareDynamicColumnsFilter
): IDynamicColumnsFilter<TPosition> {
    const { direction, limit, position } = props.columnsNavigation.sourceConfig;
    const { actualPosition, actualDirection } = props;

    return {
        direction: actualDirection !== undefined ? actualDirection : direction,
        position: actualPosition !== undefined ? actualPosition : position,
        limit,
    };
}

export function prepareDynamicColumnsFilterRecord<
    TPositionFieldFormat extends EntityFormat.Field,
    TPosition = number
>(
    dynamicColumnsFilter: IDynamicColumnsFilter<TPosition>,
    adapter: EntityAdapter.IAdapter,
    positionFieldFormat: new (props: unknown) => TPositionFieldFormat
): Record {
    const result = new Record({ adapter });
    result.addField(
        new EntityFormat.StringField({ name: 'direction' }),
        null,
        dynamicColumnsFilter.direction
    );
    result.addField(
        new positionFieldFormat({ name: 'position' }),
        null,
        dynamicColumnsFilter.position
    );
    result.addField(
        new EntityFormat.IntegerField({ name: 'limit' }),
        null,
        dynamicColumnsFilter.limit
    );

    return result;
}

export function prepareLoadColumnsNavigation(
    items: RecordSet,
    verticalNavigationConfig: INavigationSourceConfig
): INavigationSourceConfig {
    const itemsCount = items.getCount();
    if (verticalNavigationConfig?.limit) {
        return {
            field: verticalNavigationConfig.field,
            position: itemsCount ? items.at(0).get(verticalNavigationConfig.field) : undefined,
            limit: itemsCount,
            direction: 'forward',
            multiNavigation: verticalNavigationConfig.multiNavigation,
        };
    } else {
        return {
            page: 0,
            pageSize:
                Math.ceil(itemsCount / verticalNavigationConfig.pageSize) *
                verticalNavigationConfig.pageSize,
            direction: 'forward',
            multiNavigation: verticalNavigationConfig.multiNavigation,
        };
    }
}
