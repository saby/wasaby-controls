import * as React from 'react';
import { Model } from 'Types/entity';
import { GridRow } from 'Controls/grid';
import { ILadderConfig, TLadderElement } from 'Controls/display';

// Тип принимает в себя тип рекорда и извлекает из него тип "сырых" данных
export type RawData<T> = T extends Model<infer DataType> ? DataType : never;

/**
 * Данные, возвращаемые в хуке для рендера записи
 * @interface Controls/_gridReact/useWatchRecord/IRenderData
 * @template TItem Запись списка
 * @template TRenderValues объект с наблюдаемыми значениями полей записи
 * @public
 */
export interface IRenderData<TItem, TRenderValues> {
    /**
     * Запись списка
     */
    item: TItem;
    /**
     * Наблюдаемые значения RecordSet
     */
    renderValues: TRenderValues;
}

export function getRenderValues<
    TItem extends Model = Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(item: GridRow<TItem>, properties?: TProperties): Partial<TRawData> {
    const renderValues: Partial<TRawData> = {};
    if (properties?.length && item.contents && item.contents['[Types/_entity/Model]']) {
        properties.forEach((property) => {
            const isVisibleForLadder = item.isVisibleForLadder(property);
            renderValues[property] = isVisibleForLadder ? item.contents.get(property) : null;
        });
    }
    return renderValues;
}

function getPropertyChangeHandler<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(item: GridRow<TItem>, properties: TProperties, setRenderValuesVersion: Function): Function {
    return (_: unknown, changedValues: Partial<TRawData>) => {
        const isChanged = (Object.keys(changedValues) as (keyof TRawData)[]).some((field) => {
            return properties.includes(field);
        });
        if (isChanged) {
            setRenderValuesVersion((prev) => prev + 1);
        }
    };
}

function getLadderChangeHandler<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(item: GridRow<TItem>, properties: TProperties, setRenderValuesVersion: Function): Function {
    return (_: unknown, ladder: TLadderElement<ILadderConfig>) => {
        setRenderValuesVersion((prev) => prev + 1);
    };
}

function getContentsChangeHandler<TItem extends Model>(
    item: GridRow<TItem>,
    properties: TProperties,
    setRenderValuesVersion: Function
): Function {
    return () => {
        const propertyChangeHandler = getPropertyChangeHandler(
            item,
            properties,
            setRenderValuesVersion
        );
        item.contents.subscribe('onPropertyChange', propertyChangeHandler);
        setRenderValuesVersion((prev) => prev + 1);
    };
}

function getUseWatchRecordResult<TItem extends Model, TRawData = RawData<TItem>>(
    item: GridRow<TItem>,
    renderValues: Partial<TRawData>
) {
    if (item['[Controls/tree:TreeNodeFooterItem]']) {
        return {
            item: item?.getParent?.()?.contents,
            renderValues,
        };
    }

    return {
        item: item?.contents,
        renderValues,
    };
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
>(item: GridRow<TItem>, properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    // Изнутри подписок инициализируем перерисовку этим стейтом и при рендере мемо синхронно пересчитает renderValues
    const [renderValuesVersion, setRenderValuesVersion] = React.useState(0);
    // Используем memo, т.к. при смене рекорда нам нужно синхронно пересчитать renderValues
    const renderValues = React.useMemo(() => {
        return getRenderValues<TItem>(item, properties);
    }, [item?.contents, renderValuesVersion]);

    // ToDo. В react 18.x перейти на useSyncExternalStore (https://beta.reactjs.org/reference/react/useSyncExternalStore).
    React.useEffect(() => {
        if (!properties?.length || !item.contents?.['[Types/_entity/Model]']) {
            return;
        }

        if (item) {
            const propertyChangeHandler = getPropertyChangeHandler(
                item,
                properties,
                setRenderValuesVersion
            );
            const ladderChangeHandler = getLadderChangeHandler(
                item,
                properties,
                setRenderValuesVersion
            );
            const contentsChangeHandler = getContentsChangeHandler(
                item,
                properties,
                setRenderValuesVersion
            );

            item.contents.subscribe('onPropertyChange', propertyChangeHandler);
            item.subscribe('ladderChange', ladderChangeHandler);
            item.subscribe('contentsChange', contentsChangeHandler);

            return () => {
                item.contents.unsubscribe('onPropertyChange', propertyChangeHandler);
                item.unsubscribe('ladderChange', ladderChangeHandler);
                item.unsubscribe('contentsChange', contentsChangeHandler);
            };
        }
    }, [item]);

    return getUseWatchRecordResult(item, renderValues);
}
