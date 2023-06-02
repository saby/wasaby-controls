import * as React from 'react';

import type { View as Grid } from 'Controls/grid';
import type { IGridColumnScrollProps } from 'Controls/gridColumnScroll';

import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';
import { HorizontalScrollToSelector } from './selectors/ColumnScroll/HorizontalScrollToSelector';
import { SessionStorage } from 'Browser/Storage';
import { useTumbler as useBaseTumbler } from './Tumbler';

const SESSION_ID = 'gridReactColumnScrollConfig';

type TGridColumnScrollProps = Pick<
    IGridColumnScrollProps,
    | 'stickyColumnsCount'
    | 'columnScrollViewMode'
    | 'dragScrolling'
    | 'columnScrollStartPosition'
    | 'resultsPosition'
    | 'resizerVisibility'
    | 'rowSeparatorSize'
    | 'columnSeparatorSize'
> & {
    stickyHeader?: boolean;
    columnsCount?: number;
};

interface IEditorProps {
    gridColumnScrollProps: Partial<TGridColumnScrollProps>;
    onChange: (gridColumnScrollProps: Partial<TGridColumnScrollProps>) => void;
    gridRef: React.MutableRefObject<Grid>;
}

function Editor(props: IEditorProps): React.ReactElement {
    const gridProps = props.gridColumnScrollProps;
    const updateGridProps = (newProps: Partial<TGridColumnScrollProps>) => {
        props.onChange({
            ...gridProps,
            ...newProps,
        });
    };

    const horizontalScrollTo = React.useCallback((position: number, smooth: boolean) => {
        props.gridRef.current.horizontalScrollTo(position, smooth);
    }, []);

    const scrollToLeft = React.useCallback(() => {
        props.gridRef.current.scrollToLeft();
    }, []);

    const scrollToRight = React.useCallback(() => {
        props.gridRef.current.scrollToRight();
    }, []);

    const onSaveToSession = React.useCallback(() => {
        const res = { ...gridProps };

        Object.keys(res).forEach((key) => {
            res[key] = typeof gridProps[key] === 'undefined' ? 'undefined' : gridProps[key];
        });

        SessionStorage.set(SESSION_ID, res);
    }, [gridProps]);

    const onClearSession = React.useCallback(() => {
        SessionStorage.remove(SESSION_ID);
    }, []);

    const useTumbler = <T extends keyof TGridColumnScrollProps>(
        optionName: T,
        initialValue: TGridColumnScrollProps[T][]
    ) => {
        return useBaseTumbler(optionName as T, initialValue, gridProps[optionName], (v) =>
            updateGridProps({ [optionName]: v })
        )[1];
    };

    const ColumnsCountTumbler = useTumbler('columnsCount', [5, 10, 15, 20, 25, 30, 40, 50]);

    const ColumnScrollViewModeTumbler = useTumbler('columnScrollViewMode', [
        undefined,
        'scrollbar',
        'arrows',
        'unaccented',
    ]);

    const StickyColumnsCountTumbler = useTumbler('stickyColumnsCount', [1, 2, 3, 4]);

    const DragScrollingTumbler = useTumbler('dragScrolling', [undefined, true, false]);

    const ResultsPositionTumbler = useTumbler('resultsPosition', [undefined, 'top', 'bottom']);

    const StickyHeaderTumbler = useTumbler('stickyHeader', [true, false]);

    const ColumnScrollStartPositionTumbler = useTumbler('columnScrollStartPosition', [
        undefined,
        100,
        150,
        300,
        600,
        9000,
        'end',
    ]);

    const ResizerTumbler = useTumbler('resizerVisibility', [true, false]);

    const RowSeparatorSizeTumbler = useTumbler('rowSeparatorSize', ['null', 's', 'l']);

    const ColumnSeparatorSizeTumbler = useTumbler('columnSeparatorSize', ['null', 's']);

    return (
        <BaseEditor header={'Grid column scroll editor'} level={2}>
            {ColumnsCountTumbler}
            {ColumnScrollViewModeTumbler}
            {StickyColumnsCountTumbler}
            {StickyHeaderTumbler}
            {ColumnScrollStartPositionTumbler}
            {DragScrollingTumbler}
            {ResultsPositionTumbler}
            {ResizerTumbler}
            {RowSeparatorSizeTumbler}
            {ColumnSeparatorSizeTumbler}
            <HorizontalScrollToSelector horizontalScrollTo={horizontalScrollTo} />
            <BaseSelector>
                <button className={'controls-margin_right-s'} onClick={scrollToLeft}>
                    scrollToLeft()
                </button>
                <button onClick={scrollToRight}>scrollToRight()</button>
            </BaseSelector>

            {/* Хранение настроек в сессии */}
            <BaseSelector>
                <button className={'controls-margin_right-s'} onClick={onSaveToSession}>
                    Сохранить в сессию
                </button>
                <button onClick={onClearSession}>Очистить сессию</button>
            </BaseSelector>
        </BaseEditor>
    );
}

interface IHookResult {
    gridColumnScrollPropsEditor: React.ReactElement;
    gridColumnScrollProps: Partial<TGridColumnScrollProps>;
}

function getOptionValue<
    TKey extends keyof TGridColumnScrollProps,
    TValue extends TGridColumnScrollProps[TKey]
>(name: TKey, initialProps: TGridColumnScrollProps): TValue {
    const session = SessionStorage.get(SESSION_ID);
    if (session) {
        if (session[name] === 'undefined') {
            return undefined;
        }
        return name in session ? session[name] : initialProps[name];
    }
    return initialProps[name] as TValue;
}

export function useColumnScrollGridPropsEditor(
    initialGridColumnScrollProps: Partial<TGridColumnScrollProps> = {},
    gridRef: React.MutableRefObject<Grid>
): IHookResult {
    const [gridColumnScrollProps, setGridColumnScrollProps] = React.useState<
        Partial<TGridColumnScrollProps>
    >(
        (
            [
                'columnsCount',
                'stickyColumnsCount',
                'dragScrolling',
                'columnScrollViewMode',
                'columnScrollStartPosition',
                'stickyHeader',
                'resultsPosition',
                'resizerVisibility',
            ] as (keyof Partial<TGridColumnScrollProps>)[]
        ).reduce((props, currentPropsName) => {
            props[currentPropsName] = getOptionValue(
                currentPropsName,
                initialGridColumnScrollProps
            );
            return props;
        }, {} as Partial<TGridColumnScrollProps>)
    );

    const gridColumnScrollPropsEditor = (
        <Editor
            gridColumnScrollProps={gridColumnScrollProps}
            onChange={setGridColumnScrollProps}
            gridRef={gridRef}
        />
    );

    return { gridColumnScrollPropsEditor, gridColumnScrollProps };
}
