import * as React from 'react';

import type { View as Grid } from 'Controls/grid';
import type { IGridProps } from 'Controls/gridColumnScroll';

import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';
import { ColumnScrollViewModeSelector } from './selectors/ColumnScroll/ColumnScrollViewModeSelector';
import { StickyColumnsCountSelector } from './selectors/ColumnScroll/StickyColumnsCountSelector';
import { DragScrollingSelector } from './selectors/ColumnScroll/DragScrollingSelector';
import { ColumnScrollStartPositionSelector } from './selectors/ColumnScroll/ColumnScrollStartPositionSelector';
import { HorizontalScrollToSelector } from './selectors/ColumnScroll/HorizontalScrollToSelector';
import { SessionStorage } from 'Browser/Storage';

const SESSION_ID = 'gridReactColumnScrollConfig';

type TGridColumnScrollProps = Pick<
    IGridProps,
    | 'stickyColumnsCount'
    | 'columnScrollViewMode'
    | 'dragScrolling'
    | 'columnScrollStartPosition'
>;

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

    const horizontalScrollTo = React.useCallback(
        (position: number, smooth: boolean) => {
            props.gridRef.current.horizontalScrollTo(position, smooth);
        },
        []
    );

    const scrollToLeft = React.useCallback(() => {
        props.gridRef.current.scrollToLeft();
    }, []);

    const scrollToRight = React.useCallback(() => {
        props.gridRef.current.scrollToRight();
    }, []);

    const onSaveToSession = React.useCallback(() => {
        const res = { ...gridProps };

        Object.keys(res).forEach((key) => {
            res[key] =
                typeof gridProps[key] === 'undefined'
                    ? 'undefined'
                    : gridProps[key];
        });

        SessionStorage.set(SESSION_ID, res);
    }, [gridProps]);

    const onClearSession = React.useCallback(() => {
        SessionStorage.remove(SESSION_ID);
    }, []);

    return (
        <BaseEditor header={'Grid column scroll editor'} level={2}>
            <BaseSelector header={'columnScrollViewMode'}>
                <ColumnScrollViewModeSelector
                    value={gridProps.columnScrollViewMode}
                    onChange={(columnScrollViewMode) => {
                        return updateGridProps({ columnScrollViewMode });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'stickyColumnsCount'}>
                <StickyColumnsCountSelector
                    value={gridProps.stickyColumnsCount}
                    onChange={(stickyColumnsCount) => {
                        return updateGridProps({ stickyColumnsCount });
                    }}
                />
            </BaseSelector>
            <ColumnScrollStartPositionSelector
                value={gridProps.columnScrollStartPosition}
                onChange={(columnScrollStartPosition) => {
                    return updateGridProps({ columnScrollStartPosition });
                }}
            />
            <BaseSelector header={'dragScrolling'}>
                <DragScrollingSelector
                    value={gridProps.dragScrolling}
                    onChange={(dragScrolling) => {
                        return updateGridProps({ dragScrolling });
                    }}
                />
            </BaseSelector>
            <BaseSelector>
                <button
                    className={'controls-margin_right-s'}
                    onClick={onSaveToSession}
                >
                    Сохранить в сессию
                </button>
                <button onClick={onClearSession}>Очистить сессию</button>
            </BaseSelector>
            <HorizontalScrollToSelector
                horizontalScrollTo={horizontalScrollTo}
            />
            <BaseSelector>
                <button
                    className={'controls-margin_right-s'}
                    onClick={scrollToLeft}
                >
                    scrollToLeft()
                </button>
                <button onClick={scrollToRight}>scrollToRight()</button>
            </BaseSelector>
        </BaseEditor>
    );
}

interface IHookResult {
    gridColumnScrollPropsEditor: React.ReactElement;
    gridColumnScrollProps: Partial<TGridColumnScrollProps>;
}

function getOptionValue(
    name: keyof TGridColumnScrollProps,
    initialProps: TGridColumnScrollProps
) {
    const session = SessionStorage.get(SESSION_ID);
    if (session) {
        if (session[name] === 'undefined') {
            return undefined;
        }
        return name in session ? session[name] : initialProps[name];
    }
    return initialProps[name];
}

export function useColumnScrollGridPropsEditor(
    initialGridColumnScrollProps: Partial<TGridColumnScrollProps> = {},
    gridRef: React.MutableRefObject<Grid>
): IHookResult {
    const [gridColumnScrollProps, setGridColumnScrollProps] = React.useState<
        Partial<TGridColumnScrollProps>
    >({
        stickyColumnsCount: getOptionValue(
            'stickyColumnsCount',
            initialGridColumnScrollProps
        ),
        dragScrolling: getOptionValue(
            'dragScrolling',
            initialGridColumnScrollProps
        ),
        columnScrollViewMode: getOptionValue(
            'columnScrollViewMode',
            initialGridColumnScrollProps
        ),
        columnScrollStartPosition: getOptionValue(
            'columnScrollStartPosition',
            initialGridColumnScrollProps
        ),
    });

    const gridColumnScrollPropsEditor = (
        <Editor
            gridColumnScrollProps={gridColumnScrollProps}
            onChange={setGridColumnScrollProps}
            gridRef={gridRef}
        />
    );

    return { gridColumnScrollPropsEditor, gridColumnScrollProps };
}
