import type * as React from 'react';

import type { TPoint, TRectParams } from './dragSelectionController/types';
import {
    getDragStartParams,
    getNewOffset,
    getRectParams,
    getEndPoint,
    getDragEndParams,
    canSelectCellByDrag
} from './dragSelectionController/helpers';

import type { TResizerDirection } from './shared/types';
import type { TColumnKey, TItemKey, TKeyPair } from '../shared/types';

import { TSelectionBounds, ISelection } from '../SelectionModel';

type TKeyMask = '$key$';
const KEY_MASK_TOKEN: TKeyMask = '$key$';
type TSelectorMask = `${string}${TKeyMask}${string}`;

const DRAG_INDICATOR_TAG = 'div';
const DRAG_INDICATOR_CLASSNAME = 'ControlsLists-dynamicGrid__selection__dragIndicator';

interface IDragSelectionControllerProps {
    itemKeyAttribute: string;
    itemSelector: string;
    itemSelectorMask: TSelectorMask;

    columnKeyAttribute: string;
    columnSelector: string;
    columnSelectorMask: TSelectorMask;

    containerRef: React.MutableRefObject<HTMLDivElement>;
    onDragEnd?: (newPartialPlainSelection: ISelection) => void;
}

export { DragSelectionController, IDragSelectionControllerProps };

class DragSelectionController {
    private readonly _props: IDragSelectionControllerProps;

    private _startPoint: TPoint;
    private _startKeyPairs: {
        topLeft: TKeyPair;
        bottomRight: TKeyPair;
    };
    private _xOffset: number;
    private _yOffset: number;
    private _xMinOffset: number;
    private _yMinOffset: number;
    private _direction: TResizerDirection;
    private _selectionElement: HTMLDivElement;

    constructor(props: IDragSelectionControllerProps) {
        this._props = props;
        this._bindListeners();
    }

    manageStart(
        mouseEvent: React.MouseEvent,
        selectionBounds: TSelectionBounds,
        direction: TResizerDirection
    ): void {
        this._startKeyPairs = {
            topLeft: {
                itemKey: selectionBounds.startItemKey,
                columnKey: selectionBounds.startColumnKey,
            },
            bottomRight: {
                itemKey: selectionBounds.endItemKey,
                columnKey: selectionBounds.endColumnKey,
            }
        };

        const startParams = getDragStartParams(
            this._props.containerRef.current,
            this._getCellContainerByKey(
                this._startKeyPairs.topLeft.itemKey,
                this._startKeyPairs.topLeft.columnKey
            ).getBoundingClientRect(),
            this._getCellContainerByKey(
                this._startKeyPairs.bottomRight.itemKey,
                this._startKeyPairs.bottomRight.columnKey
            ).getBoundingClientRect(),
            direction
        );

        this._direction = direction;
        this._startPoint = startParams.startPoint;
        this._xOffset = startParams.xOffset;
        this._yOffset = startParams.yOffset;
        this._xMinOffset = startParams.xMinOffset;
        this._yMinOffset = startParams.yMinOffset;

        this._selectionElement = this._getElement();
        this._applyPosition();
        this._props.containerRef.current.appendChild(this._selectionElement);
        this._initListeners();
    }

    manageMove(e: React.MouseEvent): void {
        if (!this._startPoint || !canSelectCellByDrag(e)) {
            return;
        }

        const newOffset = getNewOffset(
            this._getCellContainerByTarget(e.target as Element).getBoundingClientRect(),
            this._startPoint,
            this._direction,
            this._xMinOffset,
            this._yMinOffset
        );

        this._xOffset = newOffset.x;
        this._yOffset = newOffset.y;

        this._applyPosition();
    }

    destroy(): void {
        this._resetState();
    }

    private _manageStop() {
        if (this._props.onDragEnd) {
            const selection = this._getPlainSelection();
            this._resetState();
            this._props.onDragEnd(selection);
        } else {
            this._resetState();
        }
    }

    private _getPlainSelection(): ISelection {
        // Имея точки границ с которыми начали можно получить точку завершения, по ней - ключ элемента и ячейки.
        // Зная пары граничных ячеек с которых началось выделение и пару ключей ячейки на которой завершилось,
        // можно пересобрать пары, приведя к виду левая верхняя и правая нижняя.
        const dragEndCell = this._getCellContainerFromPoint(
            getEndPoint(this._startPoint, this._direction, this._xOffset, this._yOffset)
        );
        const { topLeft, bottomRight } = getDragEndParams(
            this._startKeyPairs,
            this._getKeyPairByCell(dragEndCell),
            this._direction
        );

        const items = Array.from(
            this._props.containerRef.current.querySelectorAll(this._props.itemSelector)
        );

        const startItemIndex = items.findIndex(
            (i) => i.getAttribute(this._props.itemKeyAttribute) === `${topLeft.itemKey}`
        );
        const endItemIndex = items.findIndex(
            (i) => i.getAttribute(this._props.itemKeyAttribute) === `${bottomRight.itemKey}`
        );

        const result: ISelection = {};

        for (let i = startItemIndex; i <= endItemIndex; i++) {
            let startColumnIndex: number = -1;
            let endColumnIndex: number = -1;

            const item = items[i];

            // В каждой строке трансформируем массивы ячеек в массивы ключей и одновременно ищем индексы.
            const cellKeys = Array.from(item.querySelectorAll(this._props.columnSelector)).map(
                (cell, index) => {
                    const key = cell.getAttribute(this._props.columnKeyAttribute);

                    startColumnIndex =
                        startColumnIndex === -1 && key === `${topLeft.columnKey}`
                            ? index
                            : startColumnIndex;
                    endColumnIndex =
                        endColumnIndex === -1 && key === `${bottomRight.columnKey}`
                            ? index
                            : endColumnIndex;
                    return key;
                }
            );
            if (!cellKeys.length) {
                continue;
            }

            result[item.getAttribute(this._props.itemKeyAttribute)] = cellKeys.slice(
                startColumnIndex,
                endColumnIndex + 1
            );
        }

        return result;
    }

    private _getCellContainerByKey(itemKey: TItemKey, columnKey: TColumnKey): HTMLDivElement {
        return this._props.containerRef.current.querySelector(
            this._props.itemSelectorMask.replace(KEY_MASK_TOKEN, itemKey.toString()) +
                ' ' +
                this._props.columnSelectorMask.replace(
                    KEY_MASK_TOKEN,
                    columnKey as unknown as string
                )
        );
    }

    private _getRectParams(): TRectParams {
        return getRectParams(this._startPoint, this._xOffset, this._yOffset);
    }

    private _onMouseUp() {
        this._manageStop();
    }

    private _onMouseLeave() {
        this._manageStop();
    }

    private _getElement(): HTMLDivElement {
        const element = document.createElement(DRAG_INDICATOR_TAG);
        element.classList.add(DRAG_INDICATOR_CLASSNAME);
        return element;
    }

    private _getCellContainerByTarget(target: Element): HTMLDivElement {
        const selector =
            this._props.columnSelector[0] === '.'
                ? this._props.columnSelector.slice(1)
                : this._props.columnSelector;

        return (target.className.indexOf(selector) !== -1
            ? target
            : target.closest &&
              target.closest(this._props.columnSelector)) as unknown as HTMLDivElement;
    }

    private _getCellContainerFromPoint(point: TPoint): HTMLDivElement | undefined {
        const elements = document.elementsFromPoint(point.x, point.y);
        for (let i = 0; i < elements.length; i++) {
            const cell = this._getCellContainerByTarget(elements[i]);
            if (cell) {
                return cell;
            }
        }
    }

    private _getKeyPairByCell(cell: HTMLDivElement): TKeyPair {
        const item = cell.closest(this._props.itemSelector);

        return {
            itemKey: item.getAttribute(this._props.itemKeyAttribute),
            columnKey: cell.getAttribute(this._props.columnKeyAttribute),
        };
    }

    private _applyPosition(): void {
        const selectionRect = this._getRectParams();
        this._selectionElement.style.top = `${selectionRect.y}px`;
        this._selectionElement.style.left = `${selectionRect.x}px`;
        this._selectionElement.style.width = `${selectionRect.width}px`;
        this._selectionElement.style.height = `${selectionRect.height}px`;
    }

    private _bindListeners(): void {
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
    }

    private _initListeners(): void {
        window.addEventListener('mouseup', this._onMouseUp);
        window.addEventListener('mouseleave', this._onMouseLeave);
    }

    private _removeListeners(): void {
        window.removeEventListener('mouseup', this._onMouseUp);
        window.removeEventListener('mouseleave', this._onMouseLeave);
    }

    private _resetState(): void {
        if (this._selectionElement) {
            this._props.containerRef.current.removeChild(this._selectionElement);
        }
        this._selectionElement = undefined;
        this._startPoint = undefined;
        this._startKeyPairs = undefined;
        this._xOffset = undefined;
        this._yOffset = undefined;
        this._xMinOffset = undefined;
        this._yMinOffset = undefined;
        this._direction = undefined;
        this._removeListeners();
    }
}
