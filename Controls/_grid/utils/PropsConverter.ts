import { IGridOptions, GridCollection as Collection } from 'Controls/baseGrid';
import type { IGridProps as IReactGridProps } from 'Controls/gridReact';
import unsupportedProps from './gridReactUnsupportedProps';
import { Logger } from 'UI/Utils';

type TColumnsProps = Pick<IGridOptions & IReactGridProps, 'columns' | 'header' | 'footer'>;

export function hasReactColumns(columns: TColumnsProps[keyof TColumnsProps]): boolean {
    return !!(
        columns?.length &&
        columns.some((it) => {
            return it.key || it.render || it.getCellProps;
        })
    );
}

function hasWasabyColumns(columns: TColumnsProps[keyof TColumnsProps]): boolean {
    return !!(
        columns?.length &&
        columns.some((it) => it.template || it.resultTemplate || it.editorTemplate)
    );
}

// Проверяет, что заданы специфичные для gridReact опции грида.
export function hasReactSpecificProps(props: IGridOptions | IReactGridProps): boolean {
    return ['getRowProps', 'emptyView', 'emptyViewProps', 'groupRender', 'getGroupProps'].some(
        (prop: string) => {
            return prop in props;
        }
    );
}

export function isReactView(props: IGridOptions | IReactGridProps): boolean {
    const newProps = props as IReactGridProps;
    // Разрешаем при любых React опциях или React колонках.
    const hasAnyReactSpecificProps =
        hasReactSpecificProps(newProps) ||
        hasReactColumns(newProps.columns) ||
        hasReactColumns(newProps.header) ||
        hasReactColumns(newProps.footer);

    // Жёсткое условие hasAnyReactSpecificProps не позволяет включить GridReact при минимальной настройке колонок,
    // когда там нет ни разрешённых опций ни запрещённых.
    // Для проверки старых демок с новым GridReact, необходимо поменять && на || и добавить import 'Controls/gridReact'.
    // Для проверки ColumnScroll ещё необходимо добавить import 'Controls/gridColumnScroll'.
    const canBeReact =
        hasAnyReactSpecificProps &&
        !hasWasabyColumns(newProps.columns) &&
        !hasWasabyColumns(newProps.header) &&
        !hasWasabyColumns(newProps.footer);

    // Выводим warning при любых неподдрживаемых React Опциях
    if (canBeReact) {
        // Реестры на EDO3 уже давно используют GridReact, при этом из EDO3 летит много
        // неподдерживаемых опций. Но GridReact там строится несмотря ни на что.
        // Соответственно, запрещать построение GridReact с неподдерживаемыми опциями - бессмысленная идея.
        // Лучше просто кидать предупреждение в консоль.
        const propNames = Object.keys(props).filter((el) => el[0] !== '_');
        const unsupportedOptions = propNames.filter((prop) => {
            return unsupportedProps.includes(prop);
        });
        if (unsupportedOptions.length) {
            Logger.warn(
                'При построении GridReact обнаружены опции, для которых не поддержана совместимость. ' +
                    'Компонент может работать некорректно: ' +
                    unsupportedOptions.join(', ')
            );
        }
    }
    return canBeReact;
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
