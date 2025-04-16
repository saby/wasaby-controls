/*
 * Файл содержит приватный хук useWatchRecord и вспомогательные методы.
 * Хук useWatchRecord используется внутри публичного хука useItemData
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import type { GridRow } from 'Controls/grid';
import { Object as EventObject } from 'Env/Event';
import { hooks } from 'Controls/listsCommonLogic';

// Тип принимает в себя тип рекорда и извлекает из него тип "сырых" данных
export type RawData<T> = T extends Model<infer DataType> ? DataType : never;

type TPropertiesArray = string[];

/**
 * Данные, возвращаемые в хуке для рендера записи
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

/*
 * Функция, для получения renderValues
 * https://online.sbis.ru/shared/disk/8e5e35eb-5b17-4d11-b7bc-b4978659280b#toc_68e837ec-ccf5-4411-a8de-5091067b1c18
 */
export function getRenderValues(
    item: GridRow<Model>,
    itemContents: Model | undefined,
    properties?: TPropertiesArray
): Partial<RawData<Model>> {
    const renderValues: Partial<RawData<Model>> = {};
    if (properties?.length && itemContents && itemContents['[Types/_entity/Model]']) {
        properties.forEach((property) => {
            const isVisibleForLadder = item.isVisibleForLadder?.(property);
            renderValues[property] = isVisibleForLadder ? itemContents.get(property) : null;
        });
    }
    return renderValues;
}

/*
 * Функция, возвращающая обработчик подписки на событие ladderChange
 */
function getLadderChangeHandler(setRenderValuesVersion: Function): Function {
    return (_: unknown) => {
        setRenderValuesVersion((prev: number) => prev + 1);
    };
}

/*
 * Функция, возвращающая обработчик подписки на событие contentsChange
 */
function getContentsChangeHandler(
    properties: TPropertiesArray,
    setRenderValuesVersion: Function
): Function {
    return (_: EventObject, item: Model) => {
        const propertyChangeHandler = hooks.getPropertyChangeHandler(
            item,
            properties,
            setRenderValuesVersion
        );
        item.subscribe('onPropertyChange', propertyChangeHandler);
        setRenderValuesVersion((prev: number) => prev + 1);
    };
}

/*
 * Внутренний платформенный хук для отслеживания изменения полей записи.
 * Вне списка нужно использовать Controls/grid:useItemData.
 * @param item Отслеживаемая запись.
 * @param properties Отслеживаемые поля записи. При изменении значений этих полей будет вызываться хук.
 */
export function useWatchRecord(
    item: GridRow<Model>,
    itemContents: Model,
    properties?: TPropertiesArray
): IRenderData<Model, Partial<RawData<Model>>> {
    // Изнутри подписок инициализируем перерисовку этим стейтом и при рендере мемо синхронно пересчитает renderValues
    const [renderValuesVersion, setRenderValuesVersion] = React.useState(0);

    // Используем memo, т.к. при смене рекорда нам нужно синхронно пересчитать renderValues
    const renderValues = React.useMemo(() => {
        return getRenderValues(item, itemContents, properties);
    }, [itemContents, renderValuesVersion, item?.isDragged?.()]);

    // ToDo. В react 18.x перейти на useSyncExternalStore (https://beta.reactjs.org/reference/react/useSyncExternalStore).
    React.useLayoutEffect(() => {
        if (!properties?.length || !itemContents?.['[Types/_entity/Model]']) {
            return;
        }

        if (item) {
            const propertyChangeHandler = hooks.getPropertyChangeHandler(
                itemContents,
                properties,
                setRenderValuesVersion
            );
            const ladderChangeHandler = getLadderChangeHandler(setRenderValuesVersion);
            const contentsChangeHandler = getContentsChangeHandler(
                properties,
                setRenderValuesVersion
            );

            itemContents.subscribe('onPropertyChange', propertyChangeHandler);
            item.subscribe('ladderChange', ladderChangeHandler);
            item.subscribe('contentsChange', contentsChangeHandler);

            return () => {
                itemContents.unsubscribe('onPropertyChange', propertyChangeHandler);
                item.unsubscribe('ladderChange', ladderChangeHandler);
                item.unsubscribe('contentsChange', contentsChangeHandler);
            };
        }
    }, [item]);

    return {
        item: itemContents,
        renderValues,
    };
}
