/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/ScrollBar/ScrollBar';
import { JS_SELECTORS } from './../ColumnScrollController';

export type TScrollBarViewMode = 'scrollbar' | 'arrows';

export interface IScrollBarOptions extends IControlOptions {
    stickyHeader?: boolean;
    backgroundStyle: string;
    mode?: TScrollBarViewMode;
}

function roundInRange(value: number, range: [number, number]): number {
    return Math.max(range[0], Math.min(Math.round(value), range[1]));
}

export default class ScrollBar extends Control<IScrollBarOptions> {
    protected _template: TemplateFunction = template;
    private _position: number = 0;
    private _contentSize: number = 0;
    private _scrollWidth: number = 0;
    private _maxScrollPosition: number = 0;
    private _isColumnScrollVisible: boolean = false;
    private readonly _fixedClass = JS_SELECTORS.FIXED_ELEMENT;
    protected _scrollbarPadding: object = { start: true, end: true };

    private _isArrowsMode(): boolean {
        return !this._options.mode || this._options.mode === 'arrows';
    }

    /*
     * Устанавливает позицию thumb'a.
     * Метод существует как временное решение ошибки ядра, когда обновлениие реактивного состояния родителя
     * приводит к перерисовке всех дочерних шаблонов, даже если опция в них не передается.
     * https://online.sbis.ru/opendoc.html?guid=5c209e19-b6b2-47d0-9b8b-c8ab32e133b0
     *
     * Ошибка ядра приводит к крайне низкой производительности горизонтального скролла(при изменении позиции
     * перерисовываются записи)
     * https://online.sbis.ru/opendoc.html?guid=16907a96-816e-4c76-9bdb-26bd6c4370b4
     */
    setScrollPosition(scrollPosition: number): void {
        this.setSizes({ scrollPosition });
    }

    // Аналогично this.setScrollPosition, та же причина существования
    setSizes(params: {
        contentSize?: number;
        maxScrollPosition?: number;
        scrollWidth?: number;
        scrollPosition?: number;
    }): void {
        let shouldRecalcSizes = false;

        if (typeof params.contentSize !== 'undefined' && this._contentSize !== params.contentSize) {
            this._contentSize = params.contentSize;
            shouldRecalcSizes = true;
        }

        if (typeof params.scrollWidth !== 'undefined' && this._scrollWidth !== params.scrollWidth) {
            this._scrollWidth = params.scrollWidth;
            shouldRecalcSizes = true;
        }

        if (
            typeof params.scrollPosition !== 'undefined' &&
            this._position !== params.scrollPosition
        ) {
            this._position = params.scrollPosition;
        }

        if (
            typeof params.maxScrollPosition !== 'undefined' &&
            this._maxScrollPosition !== params.maxScrollPosition
        ) {
            this._maxScrollPosition = params.maxScrollPosition;
            shouldRecalcSizes = true;
        }

        if (shouldRecalcSizes) {
            this._recalcSizes();
        }
    }

    toggleVisibility(newVisibility: boolean): void {
        if (this._isColumnScrollVisible !== newVisibility) {
            this._isColumnScrollVisible = newVisibility;
        }
    }

    private _recalcSizes(): void {
        if (this._options.mode === 'arrows') {
            // В шаблоне не используются размеры напрямую, только методы без параметров, работающие по текущим опциям.
            // Т.е. в шаблоне нет реактивных переменных и при изменении опций он не перересуется.
            // Так сделано, чтобы в режиме скроллбара не было лишних перерисовок и
            // пересчетов размеров (на изменение скролла). Пересчет вызывается напрямую.
            // При режиме стрелок выводятся кнопки, которые при изменении опций тоже не обновятся.
            this._forceUpdate();
        }
    }

    protected _onDraggingChanged(e: Event, isDragging: boolean): void {
        if (!isDragging && !this._isArrowsMode()) {
            this._notify('customdragEnd', []);
        }
    }

    _isArrowActive(direction: 'left' | 'right'): boolean {
        return (
            !this._options.readOnly &&
            this._isArrowsMode() &&
            this._position !== (direction === 'left' ? 0 : this._maxScrollPosition)
        );
    }

    protected _onArrowClick(e: Event, direction: 'left' | 'right'): void {
        e.stopPropagation();
        if (!this._isArrowActive(direction)) {
            return;
        }
        const newScrollPosition =
            this._position + (direction === 'left' ? -this._scrollWidth : this._scrollWidth);
        this._updateScrollPosition(newScrollPosition);
    }

    protected _onPositionChanged(e: Event, newScrollPosition: number): void {
        this._updateScrollPosition(newScrollPosition);
    }

    private _updateScrollPosition(scrollPosition: number): void {
        const newScrollPosition = roundInRange(scrollPosition, [0, this._maxScrollPosition]);
        if (this._position !== newScrollPosition) {
            this._position = newScrollPosition;
            this._notify('positionChanged', [this._position]);
        }
    }
}
