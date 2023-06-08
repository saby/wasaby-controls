import { IOptions as IGridOptions } from '../display/mixins/Grid';
import type { IGridProps as IReactGridProps } from 'Controls/gridReact';

import Collection from 'Controls/_grid/display/Collection';

export function isReactView(props: IGridOptions | IReactGridProps): boolean {
    // Флаг для отладки, чтобы проверять обратную совместимость. Сейчас нельзя сразу всем включить новое представление.
    const allowUseReactGridForOldOptions = false;

    const newProps = props as IReactGridProps;
    if (
        newProps.getRowProps ||
        (newProps.columns.length &&
            newProps.columns.some((it) => {
                return (it.key || it.render || it.getCellProps) && !it.template;
            }))
    ) {
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
            !oldOptions.itemTemplate &&
            !oldOptions.itemTemplateProperty &&
            !hasTemplateInColumns
        );
    }

    return false;
}

export function updateCollectionIfReactView<TCollection extends Collection = Collection>(
   collection: TCollection,
   prevProps: IGridOptions | IReactGridProps,
   nextProps: IGridOptions | IReactGridProps
): void {
    if (isReactView(nextProps)) {
        const prevReactProps = prevProps as IReactGridProps;
        const nextReactProps = nextProps as IReactGridProps;
        if (prevReactProps.columns !== nextReactProps.columns) {
            collection.setColumns(nextReactProps.columns);
        }
        if (prevReactProps.header !== nextReactProps.header) {
            collection.setHeader(nextReactProps.header);
        }
        collection.setGetRowPropsCallback(nextReactProps.getRowProps);
        collection.setColspanCallback(nextReactProps.colspanCallback);
    }
}
