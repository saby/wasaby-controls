/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { getWidth } from 'Controls/sizeUtils';
import { detection } from 'Env/Env';
import { default as CounterTemplate } from './CounterTemplate';
import { Model } from 'Types/entity';
import { ISelectedCollectionOptions } from 'Controls/_lookup/SelectedCollection';

const getItemGridRowStyles = (index: number, itemsLayout: string): object|null => {
    if (itemsLayout === 'twoColumns') {
        const elemIndex = index + 1;
        const rowIndex = elemIndex % 2 ? (elemIndex + 1) / 2 : elemIndex / 2;
        return {
            gridRow: rowIndex,
            msGridRow: rowIndex
        };
    }

    return null;
};

const getItemGridColumnStyles = (index: number, itemsLayout: string): object|null => {
    if (itemsLayout === 'twoColumns') {
        const elemIndex = index + 1;
        const columnIndex = elemIndex % 2 ? 1 : 2;
        return {
            gridColumn: columnIndex,
            msGridColumn: columnIndex
        };
    }

    return null;
};

export = {
    getCounterWidth(
        itemsCount: number,
        theme: string,
        fontSize: string,
        counterAlignment?: string
    ): number {
        const counterTemplate = [
            CounterTemplate.render({
                itemsCount,
                theme,
                fontSize,
                counterAlignment
            })
        ] as unknown as HTMLElement;
        return (
            itemsCount &&
            getWidth(counterTemplate)
        );
    },

    getItemMaxWidth(
        indexItem: number,
        itemsLength: number,
        maxVisibleItems: number,
        itemsLayout: string,
        counterWidth: number
    ): string | void {
        let itemMaxWidth;

        if (
            indexItem === 0 &&
            itemsLength > maxVisibleItems &&
            itemsLayout === 'default'
        ) {
            itemMaxWidth = `calc(100% - ${counterWidth}px)`;
        }

        return itemMaxWidth;
    },

    /**
     * В IE flex-end не срабатывает с overflow:hidden, поэтому показываем коллекцию наоборот,
     * чтобы поле в однострочном режиме могло сокращаться при ограниченной ширине
     * @param {number} index идекс элемента
     * @param {number} visibleItemsCount количество видимых записей
     * @param {string} itemsLayout режим отображения коллекции
     * @param {boolean} isStaticCounter признак для определения не фиксированного счетчика
     * @returns {number}
     */
    getItemOrder(
        index: number,
        visibleItemsCount: number,
        itemsLayout: string,
        isStaticCounter?: boolean
    ): number {
        const collectionReversed = detection.isIE && itemsLayout === 'oneRow';
        if (collectionReversed) {
            // не абсолютный счетчик должен иметь максимальный order, т.к коллекция перевернута
            return isStaticCounter
                ? visibleItemsCount + 1
                : visibleItemsCount - index;
        }
        return index;
    },

    getVisibleItems({
        items,
        maxVisibleItems,
        multiLine,
        itemsLayout,
    }: Partial<ISelectedCollectionOptions>): Model[] {
        const startIndex = Math.max(
            maxVisibleItems && multiLine
                ? items.getCount() - maxVisibleItems
                : 0,
            0
        );
        const resultItems = [];
        const ignoreMaxVisibleItems =
            multiLine ||
            itemsLayout === 'twoColumns' ||
            maxVisibleItems === undefined;

        items.each((item, index) => {
            // TODO: убрать проверку item.get после доработки Types/entity:SerializableMixin
            // https://online.sbis.ru/opendoc.html?guid=2d836505-01d8-438b-882a-aca80f709e47
            // Сейчас возможны случаи, когда при десериализации в RecordSet может лежать что-то кроме Record и Model
            if (
                index >= startIndex &&
                (index < maxVisibleItems || ignoreMaxVisibleItems) &&
                typeof item.get === 'function'
            ) {
                resultItems.push(item);
            }
        });

        return resultItems;
    },

    getItemGridRowStyles,
    getItemGridColumnStyles,

    getItemGridStyles(index: number, itemsLayout: string): object {
        const rowStyles = getItemGridRowStyles(index, itemsLayout);
        const columnStyles = getItemGridColumnStyles(index, itemsLayout);
        return {
            ...rowStyles,
            ...columnStyles
        };
    },
};
