/*
 * Файл содержит приватный хук useWatchRecord и вспомогательные методы.
 * Хук useWatchRecord используется внутри публичного хука useItemData
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import type { GridRow } from 'Controls/grid';
import { Object as EventObject } from 'Env/Event';

// Тип принимает в себя тип рекорда и извлекает из него тип "сырых" данных
export type RawData<T> = T extends Model<infer DataType> ? DataType : never;

type TPropertiesArray = string[];

/**
 * Данные, возвращаемые в хуке для рендера записи
 * @interface Controls/_grid/gridReact/useWatchRecord/IRenderData
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
    properties?: TPropertiesArray
): Partial<RawData<Model>> {
    const renderValues: Partial<RawData<Model>> = {};
    if (properties?.length && item.contents && item.contents['[Types/_entity/Model]']) {
        properties.forEach((property) => {
            const isVisibleForLadder = item.isVisibleForLadder(property);
            renderValues[property] = isVisibleForLadder ? item.contents.get(property) : null;
        });
    }
    return renderValues;
}

/**
 * Функция, вычисляющая для отслеживаемых полей набор зависимых полей. Это актуально для расчётных полей записи.
 * @param item Запись
 * @param properties Отслеживаемые поля
 */
/*
    ┌────────────────────────────────────┐
    │ calculated props                   │
    └────────────────────────────────────┘
    fullName = surname + name
    surname = husbandSurname + fatherSurname

    ┌────────────────────────────────────┐
    │ model's deps                       │
    └────────────────────────────────────┘
    deps = {
         surname: ['fullName']
         husbandSurname: ['surname']
         fatherSurname: ['surname']
    }

    ┌────────────────────────────────────┐
    │ results deps                       │
    └────────────────────────────────────┘
    resultsDeps = ['surname', 'husbandSurname', 'fatherSurname']
*/
function getDependentProperties(item: Model, properties: TPropertiesArray): TPropertiesArray {
    const resultDependentProperties: TPropertiesArray = [];

    // @ts-ignore-next-line
    const itemDependentProperties = item._propertiesDependency;

    if (itemDependentProperties) {
        itemDependentProperties.forEach((value, prop: string) => {
            value.forEach((dependentProp: string) => {
                if (properties.includes(dependentProp)) {
                    const subDependentProperties = getDependentProperties(item, [prop]);

                    if (subDependentProperties.length) {
                        resultDependentProperties.concat(subDependentProperties);
                    } else {
                        resultDependentProperties.push(prop);
                    }
                }
            });
        });
    }

    return resultDependentProperties;
}

/*
 * Функция, возвращающая обработчик подписки на событие onPropertyChange
 */
function getPropertyChangeHandler(
    item: Model,
    properties: TPropertiesArray,
    setRenderValuesVersion: Function
): Function {
    const trackedProperties = [...properties, ...getDependentProperties(item, properties)];

    return (_: unknown, changedValues: Record<string, any>) => {
        const fields = Object.keys(changedValues);

        // В changedValues будут конкретные значение, если делали model.set('foo', 'bar');
        // Если делали model.setRawData({...}), то в changedValues будет пусто
        const isChanged =
            !fields.length ||
            fields.some((field) => {
                return trackedProperties.includes(field);
            });

        if (isChanged) {
            setRenderValuesVersion((prev: number) => prev + 1);
        }
    };
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
        const propertyChangeHandler = getPropertyChangeHandler(
            item,
            properties,
            setRenderValuesVersion
        );
        item.subscribe('onPropertyChange', propertyChangeHandler);
        setRenderValuesVersion((prev: number) => prev + 1);
    };
}

/*
 * Функция, формирующая результат выполнения хука
 */
function getUseWatchRecordResult(item: GridRow<Model>, renderValues: Partial<RawData<Model>>) {
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
export function useWatchRecord(
    item: GridRow<Model>,
    properties?: TPropertiesArray
): IRenderData<Model, Partial<RawData<Model>>> {
    // Изнутри подписок инициализируем перерисовку этим стейтом и при рендере мемо синхронно пересчитает renderValues
    const [renderValuesVersion, setRenderValuesVersion] = React.useState(0);
    // Используем memo, т.к. при смене рекорда нам нужно синхронно пересчитать renderValues
    const renderValues = React.useMemo(() => {
        return getRenderValues(item, properties);
    }, [item?.contents, renderValuesVersion, item?.isDragged?.()]);

    // ToDo. В react 18.x перейти на useSyncExternalStore (https://beta.reactjs.org/reference/react/useSyncExternalStore).
    React.useLayoutEffect(() => {
        if (!properties?.length || !item.contents?.['[Types/_entity/Model]']) {
            return;
        }

        if (item) {
            const propertyChangeHandler = getPropertyChangeHandler(
                item.contents,
                properties,
                setRenderValuesVersion
            );
            const ladderChangeHandler = getLadderChangeHandler(setRenderValuesVersion);
            const contentsChangeHandler = getContentsChangeHandler(
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
