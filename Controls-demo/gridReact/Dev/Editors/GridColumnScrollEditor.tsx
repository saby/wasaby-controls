import * as React from 'react';

import type { View as Grid } from 'Controls/grid';
import type { IGridColumnScrollProps } from 'Controls/gridColumnScroll';

import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';
import { HorizontalScrollToSelector } from './selectors/ColumnScroll/HorizontalScrollToSelector';
import { SessionStorage } from 'Browser/Storage';
import { useTumbler as useBaseTumbler } from './Tumbler';
import type { TScrollIntoViewAlign } from 'Controls/columnScrollReact';

const SESSION_ID = 'gridReactColumnScrollConfig';

type TGridColumnScrollProps = Pick<
    IGridColumnScrollProps,
    | 'stickyColumnsCount'
    | 'endStickyColumnsCount'
    | 'columnScrollViewMode'
    | 'dragScrolling'
    | 'columnScrollStartPosition'
    | 'resultsPosition'
    | 'resizerVisibility'
    | 'rowSeparatorSize'
    | 'columnSeparatorSize'
    | 'multiSelectVisibility'
> & {
    stickyHeader?: boolean;
    columnsCount?: number;
    viewportWidth?: number;
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

    const [viewportWidth, _setViewportWidth] = React.useState<number>(
        props.gridColumnScrollProps.viewportWidth
    );

    const setViewportWidth = (newWidth) => {
        _setViewportWidth(newWidth);
        updateGridProps({
            viewportWidth: newWidth,
        });
    };

    const horizontalScrollTo = React.useCallback((position: number, smooth: boolean) => {
        props.gridRef.current.horizontalScrollTo(position, smooth);
    }, []);

    const scrollToElement = React.useCallback(
        (target, align: TScrollIntoViewAlign, smooth?: boolean) => {
            props.gridRef.current.horizontalScrollToElement(target, align, smooth);
        },
        []
    );

    const scrollToLeft = React.useCallback((smooth?: boolean) => {
        props.gridRef.current.scrollToLeft(smooth);
    }, []);

    const scrollToRight = React.useCallback((smooth?: boolean) => {
        props.gridRef.current.scrollToRight(smooth);
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

    const ColumnsCountTumbler = useTumbler(
        'columnsCount',
        [5, 10, 15, 20, 25, 30, 40, 50, 90, 180]
    );

    const ColumnScrollViewModeTumbler = useTumbler('columnScrollViewMode', [
        undefined,
        'scrollbar',
        'arrows',
        'unaccented',
    ]);

    const StickyColumnsCountTumbler = useTumbler('stickyColumnsCount', [0, 1, 2, 3, 4]);

    const EndStickyColumnsCountTumbler = useTumbler('endStickyColumnsCount', [0, 1, 2, 3, 4]);

    const DragScrollingTumbler = useTumbler('dragScrolling', [undefined, true, false]);

    const ResultsPositionTumbler = useTumbler('resultsPosition', [undefined, 'top', 'bottom']);

    const StickyHeaderTumbler = useTumbler('stickyHeader', [true, false]);

    const MultiSelectVisibilityTumbler = useTumbler('multiSelectVisibility', [
        'visible',
        'hidden',
        'onhover',
    ]);

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
            {EndStickyColumnsCountTumbler}
            {MultiSelectVisibilityTumbler}
            {StickyHeaderTumbler}
            {ColumnScrollStartPositionTumbler}
            {DragScrollingTumbler}
            {ResultsPositionTumbler}
            {ResizerTumbler}
            {RowSeparatorSizeTumbler}
            {ColumnSeparatorSizeTumbler}

            <BaseSelector>
                <div>
                    Viewport:
                    <input
                        type={'range'}
                        max={1300}
                        min={500}
                        value={viewportWidth}
                        onChange={(e) => {
                            setViewportWidth(Number(e.target.value));
                        }}
                    />
                </div>
            </BaseSelector>

            {/* Хранение настроек в сессии */}
            <BaseSelector>
                <button className={'controls-margin_right-s'} onClick={onSaveToSession}>
                    Сохранить в сессию
                </button>
                <button onClick={onClearSession}>Очистить сессию</button>
            </BaseSelector>

            <div
                style={{
                    width: '100%',
                }}
            >
                <BaseEditor header={'Scroll methods'} level={3} expanded={true}>
                    <HorizontalScrollToSelector
                        horizontalScrollTo={horizontalScrollTo}
                        scrollToLeft={scrollToLeft}
                        scrollToRight={scrollToRight}
                        scrollToElement={scrollToElement}
                        columnsCount={gridProps.columnsCount}
                        stickyColumnsCount={gridProps.stickyColumnsCount}
                        endStickyColumnsCount={gridProps.endStickyColumnsCount}
                    />
                </BaseEditor>
            </div>
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
                'endStickyColumnsCount',
                'dragScrolling',
                'columnScrollViewMode',
                'columnScrollStartPosition',
                'stickyHeader',
                'resultsPosition',
                'resizerVisibility',
                'rowSeparatorSize',
                'columnSeparatorSize',
                'multiSelectVisibility',
                'viewportWidth',
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

    return {
        gridColumnScrollPropsEditor,
        gridColumnScrollProps,
    };
}
