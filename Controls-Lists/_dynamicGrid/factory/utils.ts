import { RecordSet } from 'Types/collection';
import { Record, adapter as EntityAdapter, format as EntityFormat } from 'Types/entity';
import { IDynamicColumnsNavigation } from './IDynamicGridFactory';
import { CrudEntityKey } from 'Types/source';
import { INavigationPositionSourceConfig, TNavigationDirection } from 'Controls/interface';
import { IDynamicColumnsFilter } from '../../dynamicGrid';

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

    //items.setEventRaising(false, true);

    if (columnsData) {
        columnsData.forEach((columnsDataItem) => {
            const originalItem = items.getRecordById(columnsDataItem.getKey());
            if (originalItem) {
                originalItem.set(columnsDataProperty, columnsDataItem.get(columnsDataProperty));
            }
        });
    }

    //items.setEventRaising(true, true);
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
