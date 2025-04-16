/*
 * Файл содержит приватный хук useWatchRecord и вспомогательные методы.
 * Хук useWatchRecord используется внутри публичного хука useItemData
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import { CollectionItemContext } from '../CollectionItemContext';

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
    record: Model,
    properties?: TPropertiesArray
): Partial<RawData<Model>> {
    const renderValues: Partial<RawData<Model>> = {};
    if (properties?.length && record && record['[Types/_entity/Model]']) {
        properties.forEach((property) => {
            renderValues[property] = record.get(property);
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
    const resultDependentProperties: Set<string> = new Set();

    // @ts-ignore-next-line
    const itemDependentProperties = item._propertiesDependency;

    if (itemDependentProperties) {
        itemDependentProperties.forEach((value, prop: string) => {
            value.forEach((dependentProp: string) => {
                if (properties.includes(dependentProp)) {
                    const subDependentProperties = getDependentProperties(item, [prop]);

                    if (subDependentProperties.length) {
                        subDependentProperties.forEach(
                            resultDependentProperties.add,
                            resultDependentProperties
                        );
                    } else {
                        resultDependentProperties.add(prop);
                    }
                }
            });
        });
    }

    return Array.from(resultDependentProperties);
}

/*
 * Функция, возвращающая обработчик подписки на событие onPropertyChange
 */
export function getPropertyChangeHandler(
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
 * Внутренний платформенный хук для отслеживания изменения полей записи.
 * @param record Отслеживаемая запись.
 * @param properties Отслеживаемые поля записи. При изменении значений этих полей будет вызываться хук.
 */
function useWatchRecord<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[],
>(record: TItem, properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    // Изнутри подписок инициализируем перерисовку этим стейтом и при рендере мемо синхронно пересчитает renderValues
    const [renderValuesVersion, setRenderValuesVersion] = React.useState(0);
    // Используем memo, т.к. при смене рекорда нам нужно синхронно пересчитать renderValues
    const renderValues = React.useMemo(() => {
        return getRenderValues(record, properties as unknown as TPropertiesArray);
    }, [record, renderValuesVersion]);

    React.useLayoutEffect(() => {
        if (!properties?.length || !record?.['[Types/_entity/Model]']) {
            return;
        }

        const propertyChangeHandler = getPropertyChangeHandler(
            record,
            properties as unknown as TPropertiesArray,
            setRenderValuesVersion
        );
        record.subscribe('onPropertyChange', propertyChangeHandler);

        return () => {
            record.unsubscribe('onPropertyChange', propertyChangeHandler);
        };
    }, [record]);

    return {
        item: record,
        renderValues,
    };
}

export function useItemData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[],
>(properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    const itemContents = React.useContext(CollectionItemContext)?.itemContents as TItem;
    return useWatchRecord<TItem, TRawData, TProperties>(itemContents, properties);
}
