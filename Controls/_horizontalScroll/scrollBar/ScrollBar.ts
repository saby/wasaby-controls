/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Scrollbar as BaseScrollbar } from 'Controls/scrollbar';
import * as Template from 'wml!Controls/_horizontalScroll/scrollBar/ScrollBar';

const Z_INDEX = 6;

export interface IScrollBarOptions extends IControlOptions {
    scrollBarReadyCallback: (scrollBar: ScrollBar) => void;
    scrollPositionChangedCallback: (position: number) => void;

    scrollableWidth: number;
    fixedWidth: number;
    hasMultiSelect?: boolean;
    stickyColumnsCount: number;
    columnsLength: number;
    hasItemActionsCell: boolean;
    hasResizerCell: boolean;
}

export default class ScrollBar extends Control<IScrollBarOptions> {
    protected _template: TemplateFunction = Template;
    protected _position: number = 0;
    protected _scrollbarPadding: object = { start: true, end: true };
    private readonly _zIndex: number = Z_INDEX;

    protected _children: {
        scrollBar?: BaseScrollbar;
    };

    private readonly _stickyPosition: object = {
        horizontal: 'left',
        vertical: 'top',
    };

    setScrollPosition(position: number): void {
        this._position = position;
    }

    protected _isArrowsMode(): boolean {
        return !this._options.mode || this._options.mode === 'arrows';
    }

    protected _isArrowActive(direction: 'left' | 'right'): boolean {
        return (
            !this._options.readOnly &&
            this._isArrowsMode() &&
            this._position !==
                (direction === 'left'
                    ? 0
                    : this._options.contentWidth - this._options.viewportWidth)
        );
    }

    protected _onArrowClick(e: Event, direction: 'left' | 'right'): void {
        e.stopPropagation();
        if (!this._isArrowActive(direction)) {
            return;
        }
        const delta = this._options.viewportWidth - this._options.fixedWidth;
        const newScrollPosition =
            this._position + (direction === 'left' ? -delta : delta);
        this._options.scrollPositionChangedCallback(newScrollPosition);
    }

    protected _getStickiedPartStyles(options: IScrollBarOptions): string {
        const end = +options.hasMultiSelect + options.stickyColumnsCount + 1;

        return `z-index: ${this._zIndex}; grid-column: 1/${end};`;
    }

    protected _getScrollablePartStyles(options: IScrollBarOptions): string {
        const start =
            +options.hasMultiSelect +
            options.stickyColumnsCount +
            +!!options.hasResizerCell +
            1;
        const end =
            +options.hasMultiSelect +
            options.columnsLength +
            +!!options.hasItemActionsCell +
            1;

        return (
            `z-index: ${this._zIndex};` +
            `width: ${options.scrollableWidth}px;` +
            `grid-column: ${start}/${end};`
        );
    }

    protected _beforeMount(options: IScrollBarOptions): void {
        options.scrollBarReadyCallback(this);
    }

    protected _onPositionChanged(_: Event, position: number): void {
        this._options.scrollPositionChangedCallback(position);
    }
}
