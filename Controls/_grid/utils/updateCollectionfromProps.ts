import { IGridOptions, GridCollection as Collection } from 'Controls/gridDisplay';
import type { IGridProps as IReactGridProps } from 'Controls/_grid/gridReact/CommonInterface';
import { isEqual } from 'Types/object';
import { validateGridParts } from 'Controls/_grid/utils/ConfigValidation';

export function isGridCollection<TCollection extends Collection = Collection>(
    collection: TCollection
): boolean {
    return !!collection?.['[Controls/_display/grid/mixins/Grid]'];
}

/*
 * В режиме совместимости необходимо обновлять модель по старым опциям
 * @param collection
 * @param prevProps
 * @param nextProps
 * @param doAfterReloadCallback
 */
function updateCollectionIfCompatibleView<TCollection extends Collection = Collection>(
    collection: TCollection,
    prevProps: IGridOptions | IReactGridProps,
    nextProps: IGridOptions | IReactGridProps,
    doAfterReloadCallback: Function
): void {
    if (!isEqual(prevProps.emptyTemplateColumns, nextProps.emptyTemplateColumns)) {
        doAfterReloadCallback(() => {
            collection.setEmptyTemplateColumns(nextProps.emptyTemplateColumns);

            // проверяем соответствие колонок
            validateGridParts(nextProps, 'error', this);
        });
    }
}

/*
 * Утилита для обновления списочной коллекции по пропсам грида
 * @param collection
 * @param prevProps
 * @param nextProps
 * @param doAfterReloadCallback
 */
export function updateCollectionIfReactView<TCollection extends Collection = Collection>(
    collection: TCollection,
    prevProps: IGridOptions | IReactGridProps,
    nextProps: IGridOptions | IReactGridProps,
    doAfterReloadCallback: Function
): void {
    if (isGridCollection(collection)) {
        const prevReactProps = prevProps as IReactGridProps;
        const nextReactProps = nextProps as IReactGridProps;
        if (prevReactProps.columns !== nextReactProps.columns) {
            doAfterReloadCallback(() => collection.setColumns?.(nextReactProps.columns));
        }
        if (prevReactProps.header !== nextReactProps.header) {
            doAfterReloadCallback(() => collection.setHeader?.(nextReactProps.header));
        }
        if (prevReactProps.emptyView !== nextReactProps.emptyView) {
            doAfterReloadCallback(
                () => collection.setEmptyTemplateColumns?.(nextReactProps.emptyView)
            );
        }

        doAfterReloadCallback(() => {
            collection?.setEmptyViewProps?.(nextReactProps.emptyViewProps);
            collection.setEditingConfig(nextReactProps.editingConfig);
            collection.setFooter(nextReactProps);
            collection?.setResults?.(nextReactProps.results);
            collection?.setGetRowPropsCallback?.(nextReactProps.getRowProps);
            collection?.setGetGroupPropsCallback?.(nextReactProps.getGroupProps);
            collection?.setColspanCallback?.(nextReactProps.colspanCallback);
            collection?.setResultsPosition?.(nextReactProps.resultsPosition);
            collection?.setResultsVisibility?.(nextReactProps.resultsVisibility);
            collection?.setColumnSeparatorSize?.(nextReactProps.columnSeparatorSize);
            collection?.setRoundBorder?.(nextReactProps.roundBorder);
            collection?.setColumnScrollReact?.(
                nextReactProps.columnScrollReact || nextReactProps.columnScroll
            );

            collection?.setResultsTemplateOptions?.(nextProps.resultsTemplateOptions);
        });

        updateCollectionIfCompatibleView(collection, prevProps, nextProps, doAfterReloadCallback);
    }
}
