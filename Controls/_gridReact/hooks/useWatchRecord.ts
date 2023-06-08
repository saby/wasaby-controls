import * as React from 'react';
import { Model } from 'Types/entity';
import { GridRow } from 'Controls/grid';

// Тип принимает в себя тип рекорда и извлекает из него тип "сырых" данных
export type RawData<T> = T extends Model<infer DataType> ? DataType : never;

export interface IRenderData<TItem, TRenderValues> {
    item: TItem;
    renderValues: TRenderValues;
}

export function getRenderValues<
    TItem extends Model = Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(item: GridRow<TItem>, properties?: TProperties): Partial<TRawData> {
    const renderValues: Partial<TRawData> = {};
    if (
        properties?.length &&
        item.contents &&
        item.contents['[Types/_entity/Model]']
    ) {
        properties.forEach((property) => {
            const isVisibleForLadder = item.isVisibleForLadder(property);
            renderValues[property] = isVisibleForLadder
                ? item.contents.get(property)
                : null;
        });
    }
    return renderValues;
}

/**
 * Хук для отслеживания изменения полей записи
 * @param item Отслеживаемая запись.
 * @param properties Отслеживаемые поля записи. При изменении значений этих полей будет вызываться хук.
 */
export function useWatchRecord<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(
    item: GridRow<TItem>,
    properties?: TProperties
): IRenderData<TItem, Partial<TRawData>> {
    const [renderValues, setRenderValues] = React.useState(
        getRenderValues<TItem>(item, properties)
    );
    // ToDo. В react 18.x перейти на useSyncExternalStore (https://beta.reactjs.org/reference/react/useSyncExternalStore).
    React.useEffect(() => {
        if (
            properties &&
            properties.length &&
            item.contents &&
            item.contents['[Types/_entity/Model]']
        ) {
            setRenderValues(getRenderValues<TItem>(item, properties));

            if (item) {
                const handler = (
                    _: unknown,
                    changedValues: Partial<TRawData>
                ) => {
                    const isChanged = (
                        Object.keys(changedValues) as (keyof TRawData)[]
                    ).some((field) => {
                        return properties.includes(field);
                    });
                    if (isChanged) {
                        setRenderValues(
                            getRenderValues<TItem>(item, properties)
                        );
                    }
                };
                item.contents.subscribe('onPropertyChange', handler);

                return () => {
                    item?.contents.unsubscribe('onPropertyChange', handler);
                };
            }
        }
    }, [item]);

    return {
        item: item?.contents,
        renderValues,
    };
}
