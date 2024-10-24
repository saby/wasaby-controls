import * as React from 'react';
import { SyntheticEvent } from 'UICommon/Events';
import { IColumnConfig } from 'Controls/gridReact';

const STATIC_CELLS_CLASS = '.js-ControlsLists-timelineGrid__staticCell';
const LAST_CELL_CLASS = '.controls-GridReact__cell_last';

type staticWorkspaceSizeType = 'default' | 'min';

interface ISwipeParams {
    isSwiping: boolean;
    minDistance: number;
    startSwipePosition: number | null;
}

interface ISwipeHandlers {
    onTouchStart?: (event: SyntheticEvent<TouchEvent>) => void;
    onTouchEnd?: (event: SyntheticEvent<TouchEvent>) => void;
    onTouchMove?: (event: SyntheticEvent<TouchEvent>) => void;
}

type ISwipeExports = [staticWorkspaceSizeType, ISwipeHandlers];

/**
 * Внутренний хук для создания touch-обработчиков и состояния ширины статических колонок
 * Используется, чтобы обработать свайп по статичной колонке
 * @param staticColumns Конфиг статических колонок.
 * @param staticColumnsWidth Итоговая ширина статических колонок.
 */
export function useSwipe(
    staticColumns: IColumnConfig[],
    staticColumnsWidth: number
): ISwipeExports {
    const [staticWorkspaceSize, setStaticWorkspaceSize] =
        React.useState<staticWorkspaceSizeType>('default');

    const swipeParams = React.useRef<ISwipeParams>({
        isSwiping: false,
        minDistance: staticColumnsWidth / 2,
        startSwipePosition: null,
    });

    const onItemTouchStart = React.useCallback(
        (event: SyntheticEvent<TouchEvent>) => {
            const touch = event.touches[0];
            swipeParams.current.startSwipePosition = touch.clientX;
        },
        [swipeParams.current]
    );

    const onItemTouchMove = React.useCallback(
        (event: SyntheticEvent<TouchEvent>) => {
            if (event.changedTouches && event.changedTouches.length) {
                swipeParams.current.isSwiping = true;
            }
        },
        [swipeParams.current]
    );

    const onItemTouchEnd = React.useCallback(
        (event: SyntheticEvent<TouchEvent>) => {
            const isTouchStaticCell = Boolean(event.target.closest(STATIC_CELLS_CLASS));
            const isTouchLastCell = Boolean(event.target.closest(LAST_CELL_CLASS));

            if (!isTouchStaticCell || (isTouchLastCell && isTouchStaticCell)) {
                swipeParams.current = {
                    ...swipeParams.current,
                    isSwiping: false,
                    startSwipePosition: null,
                };
                return;
            }

            const endSwipePosition = event.changedTouches[0].clientX;
            const { startSwipePosition, isSwiping, minDistance } = swipeParams.current;

            const absX = Math.abs(endSwipePosition - startSwipePosition);
            const direction = startSwipePosition > endSwipePosition ? 'left' : 'right';

            if (
                isSwiping &&
                absX > minDistance &&
                staticWorkspaceSize === 'default' &&
                direction === 'left'
            ) {
                setStaticWorkspaceSize('min');
            }
            if (isSwiping && staticWorkspaceSize === 'min' && direction === 'right') {
                setStaticWorkspaceSize('default');
            }
            swipeParams.current = {
                ...swipeParams.current,
                isSwiping: false,
                startSwipePosition: null,
            };
        },
        [swipeParams.current]
    );

    if (!staticColumns.every((col) => col.hasOwnProperty('minWidth'))) {
        return [staticWorkspaceSize, {}];
    }

    return [
        staticWorkspaceSize,
        {
            onTouchStart: onItemTouchStart,
            onTouchEnd: onItemTouchEnd,
            onTouchMove: onItemTouchMove,
        },
    ];
}