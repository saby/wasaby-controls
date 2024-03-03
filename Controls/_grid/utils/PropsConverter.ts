import { IOptions as IGridOptions } from 'Controls/_baseGrid/display/mixins/Grid';
import type { IGridProps as IReactGridProps } from 'Controls/gridReact';

import Collection from 'Controls/_baseGrid/display/Collection';

type TColumnsProps = Pick<IGridOptions & IReactGridProps, 'columns' | 'header'>;

export function isReactColumns(columns: TColumnsProps[keyof TColumnsProps]): boolean {
    return (
        columns &&
        columns.length &&
        columns.some((it) => {
            return (it.key || it.render || it.getCellProps) && !it.template;
        })
    );
}

export function isReactView(props: IGridOptions | IReactGridProps): boolean {
    // Флаг для отладки, чтобы проверять обратную совместимость. Сейчас нельзя сразу всем включить новое представление.
    const allowUseReactGridForOldOptions = false;

    const newProps = props as IReactGridProps;

    if (newProps.getRowProps || isReactColumns(newProps.columns)) {
        return true;
    }

    if (allowUseReactGridForOldOptions) {
        // TODO в этом случае нужно делать конвертацию опций и лучше бы ее сделать на этом уровне сразу же
        const oldOptions = props as IGridOptions;
        const hasTemplateInColumns =
            oldOptions.columns &&
            oldOptions.columns.some((it) => {
                return !!it.template;
            });
        return (
            !oldOptions.itemTemplate && !oldOptions.itemTemplateProperty && !hasTemplateInColumns
        );
    }

    return false;
}

export function updateCollectionIfReactView<TCollection extends Collection = Collection>(
    collection: TCollection,
    prevProps: IGridOptions | IReactGridProps,
    nextProps: IGridOptions | IReactGridProps,
    doAfterReloadCallback: Function
): void {
    if (isReactView(nextProps)) {
        const prevReactProps = prevProps as IReactGridProps;
        const nextReactProps = nextProps as IReactGridProps;
        if (prevReactProps.columns !== nextReactProps.columns) {
            doAfterReloadCallback(() => collection.setColumns(nextReactProps.columns));
        }
        if (prevReactProps.header !== nextReactProps.header) {
            doAfterReloadCallback(() => collection.setHeader(nextReactProps.header));
        }
        if (prevReactProps.emptyView !== nextReactProps.emptyView) {
            doAfterReloadCallback(() =>
                collection.setEmptyTemplateColumns(nextReactProps.emptyView)
            );
        }

        doAfterReloadCallback(() => {
            collection.setEmptyViewProps(nextReactProps.emptyViewProps);
            collection.setEditingConfig(nextReactProps.editingConfig);
            collection.setFooter(nextReactProps);
            collection.setResults(nextReactProps.results);
            collection.setGetRowPropsCallback(nextReactProps.getRowProps);
            collection.setGetGroupPropsCallback(nextReactProps.getGroupProps);
            collection.setColspanCallback(nextReactProps.colspanCallback);
            collection.setResultsPosition(nextReactProps.resultsPosition);
            collection.setResultsVisibility(nextReactProps.resultsVisibility);
            collection.setColumnSeparatorSize(nextReactProps.columnSeparatorSize);
        });
    }
}
