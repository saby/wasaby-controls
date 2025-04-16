/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IRenderData, getRenderValues } from 'Controls/gridRender';
import { CollectionItemContext, useCollection } from 'Controls/baseList';
import { Collection } from 'Controls/display';
import { DynamicGridColumnContext } from '../context/DynamicGridColumnContext';

type RawData<T> = T extends Model<infer DataType> ? DataType : never;

/**
 * Хук для получения данных для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля, при изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<TItem extends Model = Model, TRawData = RawData<TItem>>(
    properties?: readonly (keyof TRawData)[]
): IRenderData<TItem, unknown> {
    const { renderData, columnIndex } = React.useContext(DynamicGridColumnContext);
    const item = renderData?.at(columnIndex);
    return {
        item,
        renderValues: getRenderValues(item, properties),
    };
}

/**
 * Хук для получения данных для ячейки динамического заголовка.
 * Данные для заголовка берутся из рекордсета headers метаданных коллекции.
 */
export function useDynamicHeaderData(): Model | undefined {
    const collection = useCollection<Collection>();
    const { columnIndex } = React.useContext(DynamicGridColumnContext);
    const items = collection.getCollection();
    const [, setMetaDataVersion] = React.useState(0);
    const prevMetaData = React.useRef(items.getMetaData());

    const callback = React.useCallback(() => {
        if (prevMetaData.current !== items.getMetaData()) {
            prevMetaData.current = items.getMetaData();
            setMetaDataVersion((prev) => prev + 1);
        }
    }, [items]);

    // Когда прикладники точечно вызывают setMetaData на слайсе ожидается обновление шапки,
    // но оно происходит не сразу. При сете новой меты стреляет событие onPropertyChange.
    // Подписываемся на него и если мета поменялась ре-рендерим шапку.
    React.useLayoutEffect(() => {
        items?.subscribe('onPropertyChange', callback);
        return () => {
            items?.unsubscribe('onPropertyChange', callback);
        };
    }, [items, callback]);

    if (items) {
        const headers = items.getMetaData().headers as RecordSet;
        if (headers) {
            return headers.at(columnIndex);
        }
    }
}

/**
 * Приватный хук. Используется внутри компонента динамической ячейки.
 * Отвечает за её перерисовку в поячеечном режиме редактировании относительно
 * состояния элемента коллекции.
 */
export function useDynamicEditCell(dynamicColumnIndex: number): {
    editingColumnIndex: number;
    editing: boolean;
    columnIndex: number;
} {
    const item = React.useContext(CollectionItemContext);
    const [cellVersion, setCellVersion] = React.useState(0);
    const previousEditColumnIndex = React.useRef(item.getEditingColumnIndex());

    const columnIndexWithStaticColumns = React.useMemo(() => {
        dynamicColumnIndex += 2; // 1 статическая + 1 динамическая;
        dynamicColumnIndex += +item?.hasMultiSelectColumn(); // + если есть мультиселект;
        return dynamicColumnIndex;
    }, [dynamicColumnIndex]);

    const callback = React.useCallback(() => {
        if (
            item.getEditingColumnIndex() === columnIndexWithStaticColumns ||
            previousEditColumnIndex.current === columnIndexWithStaticColumns
        ) {
            setCellVersion((prev) => prev + 1);
            previousEditColumnIndex.current = item.getEditingColumnIndex();
        }
    }, [cellVersion]);

    React.useLayoutEffect(() => {
        item?.subscribe('editColumnIndexChanged', callback);
        return () => {
            item?.unsubscribe('editColumnIndexChanged', callback);
        };
    }, [item]);

    return {
        editingColumnIndex: item.getEditingColumnIndex(),
        editing: item.isEditing(),
        columnIndex: columnIndexWithStaticColumns,
    };
}
