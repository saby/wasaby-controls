import * as React from 'react';
import { DataSetBindingFacade } from 'Frame/base';
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { ISeriesEntry } from '../interfaces/ISeriesEntry';

interface IUseSeriesMetaProp<TValue = ISeriesEntry> {
    value: TValue[];
    onChange: (value: TValue[]) => void;

    bindingFacade?: DataSetBindingFacade;
    valueProperty: string;
    displayProperty: string;
    columnsRS?: RecordSet;
    colorSelectionEnabled: boolean;
}

type TMetaUpdateFunc = (key: string, prop: string, value: unknown) => void;

/**
 * Хук для работы с мета-описанием измерений графика в свойстве виджета
 * @param props
 */
function useSeriesMetaProp<TValue extends ISeriesEntry = ISeriesEntry>(
    props: IUseSeriesMetaProp<TValue>
): [RecordSet, TMetaUpdateFunc] {
    const {
        value,
        bindingFacade,
        valueProperty,
        displayProperty,
        onChange,
        columnsRS,
        colorSelectionEnabled = true,
    } = props;

    React.useEffect(() => {
        // формируем мета-описание измерений в свойство виджета на основе колонок из фасада
        if (!columnsRS) {
            return;
        }

        const [frameColumn] = bindingFacade?.getFields() || [];
        const frameFields = bindingFacade?.getAggregate() || [];

        const newValues: TValue[] = frameFields.map((frameField) => {
            const columnDesc = columnsRS.getRecordById(frameField.name);

            const elementId = extractColumnId(columnDesc.get('Id'));

            const prevValue = value?.find((x) => {
                // @ts-ignore
                return x[valueProperty] === elementId;
            });

            if (!!prevValue) {
                return prevValue;
            }

            const newValue = {
                [valueProperty]: elementId,
                name: columnDesc.get('Title'),
                [displayProperty]: extractColumnId(frameColumn?.name),
            };

            if (colorSelectionEnabled) {
                // FIXME: такой магии точно быть не должно
                newValue.colorIndex = value?.length
                    ? value[value.length - 1]?.colorIndex || 0 + 1
                    : 1;
            }

            return newValue as unknown as TValue;
        });

        if (!isEqualMetaFields(newValues, value)) {
            onChange(newValues);
        }
    }, [bindingFacade, columnsRS, displayProperty, onChange, valueProperty]);

    const setSeriesMeta = React.useCallback<TMetaUpdateFunc>(
        (key: string, propertyName: string, fieldValue: unknown) => {
            const newValues = value.map((item) => {
                if (item[valueProperty] !== key) {
                    return item;
                }
                return {
                    ...item,
                    [propertyName]: fieldValue,
                };
            });

            onChange(newValues);
        },
        [value, onChange]
    );

    const seriesMeta = React.useMemo<RecordSet>(() => {
        return new RecordSet({
            keyProperty: 'name',
            rawData: value,
        });
    }, [value]);

    return [seriesMeta, setSeriesMeta];
}

function extractColumnId(nodeId: string = ''): string {
    return nodeId.split('.').pop() as string;
}

function isEqualMetaFields(before: ISeriesEntry[], after: ISeriesEntry[]): boolean {
    const beforeFields = before.map((x) => x?.name);
    const afterFields = after.map((x) => x?.name);

    return isEqual(beforeFields, afterFields);
}

export { useSeriesMetaProp };
