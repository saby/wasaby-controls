/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { SyntheticEvent } from 'Vdom/Vdom';
import { detection } from 'Env/Env';
import { IContainers as IStyleContainers } from './StyleContainers/StyleContainers';
import { Logger } from 'UI/Utils';
import { IScrollBarOptions } from './ScrollBar/ScrollBar';

export interface IControllerOptions {
    stickyColumnsCount?: number;
    isEmptyTemplateShown?: boolean;
    isFullGridSupport?: boolean;
    stickyLadderCellsCount?: number;
    getFixedPartWidth: () => number;
    useFakeRender?: boolean;
    toggleScrollBarCallback: (state: boolean) => void;
    columnScrollViewMode: IScrollBarOptions['mode'];
    initialScrollPosition?: number;

    isRtl?: boolean;
    transformSelector?: string;
    backgroundStyle?: string;
    uniqueId: string;
}

interface IShouldDrawColumnScrollResult {
    status: boolean;
    sizes?: {
        scrollContainerSize: number;
        contentContainerSize: number;
        fixedColumnsWidth: number;
    };
}

interface IGetTransformStylesParams {
    oldPosition?: number;
    useAnimation?: boolean;
    animationState?: 'begin' | 'end';
}

interface IGetShadowsStylesParams {
    useAnimation?: boolean;
    animationState?: 'begin' | 'end';
    oldShadowState?: {
        start: boolean;
        end: boolean;
    };
}

interface IDrawTransformParams extends IGetTransformStylesParams, IGetShadowsStylesParams {}

/**
 * Набор СSS селекторов HTML элементов для обращения к ним через JS код.
 * @typedef {Object} JS_SELECTORS
 * @property {String} CONTENT Селектор, который должен присутствовать на контенте который будет скроллироваться по горизонтали.
 * @property {String} FIXED_ELEMENT Селектор, который должен присутствовать на элементах, которые не должны скроллироваться, например зафиксированные колонки.
 * @property {String} SCROLLABLE_ELEMENT Селектор, который должен присутствовать на элементах, которые должны скроллироваться.
 */
export const JS_SELECTORS = {
    CONTENT: 'controls-ColumnScroll__content',
    FIXED_ELEMENT: 'controls-ColumnScroll__fixedElement',
    SCROLLABLE_ELEMENT: 'controls-ColumnScroll__scrollableElement',
};

const WHEEL_DELTA_INCREASE_COEFFICIENT = 100;
const WHEEL_SCROLLING_SMOOTH_COEFFICIENT = 0.6;

type TScrollDirection = 'forward' | 'backward';

function getValueInBounds(value: number, bounds: [number, number]): number {
    return Math.max(bounds[0], Math.min(value, bounds[1]));
}

export default class ColumnScrollController {
    protected _options: IControllerOptions;
    private _isDestroyed: boolean = false;

    private readonly _transformSelector: string;

    private _scrollContainer: HTMLElement;
    private _contentContainer: HTMLElement;
    private _stylesContainer: HTMLStyleElement;
    private _transformStylesContainer: HTMLStyleElement;
    private _shadowsStylesContainer: HTMLStyleElement;

    private _contentSize: number = 0;
    private _containerSize: number = 0;
    private _scrollPosition: number;
    private _fixedColumnsWidth: number = 0;
    private _contentSizeForHScroll: number = 0;
    private _scrollWidth: number = 0;
    private _isAnimationInProcess: boolean = false;
    private _shadowState: { start: boolean; end: boolean } = {
        start: false,
        end: false,
    };
    private _currentScrollDirection: TScrollDirection;
    private _scrollableColumns: HTMLElement[];

    constructor(
        options: IControllerOptions & {
            containers: IStyleContainers & {
                scrollContainer: HTMLElement;
                contentContainer: HTMLElement;
            };
        }
    ) {
        this._options = { ...options };
        this._options.backgroundStyle = this._options.backgroundStyle || 'default';
        this._options.stickyColumnsCount = this._options.stickyColumnsCount || 1;
        this._options.isFullGridSupport = !!options.isFullGridSupport;
        this._options.toggleScrollBarCallback = options.toggleScrollBarCallback;
        this._scrollPosition = options.initialScrollPosition || 0;

        if (options.containers) {
            this.setContainers({
                scrollContainer: options.containers.scrollContainer,
                contentContainer: options.containers.contentContainer,
                stylesContainer: options.containers.staticStyles,
                transformStylesContainer: options.containers.transformStyles,
                shadowsStylesContainer: options.containers.shadowsStyles,
            });
            delete this._options.containers;
        }

        if (options.transformSelector) {
            this._transformSelector = options.transformSelector;
            delete this._options.transformSelector;
        } else {
            this._transformSelector = ColumnScrollController.createUniqSelector(options.uniqueId);
        }
    }
    /**
     * Возвращает флаг, указывающий должен ли быть виден горизонтальный скролл (ширина контента больше, чем его контейнер)
     */
    isVisible(): boolean {
        return this._contentSize > this._containerSize;
    }

    setContainers(containers: {
        scrollContainer?: HTMLElement;
        contentContainer?: HTMLElement;
        stylesContainer?: HTMLStyleElement;
        transformStylesContainer?: HTMLStyleElement;
        columnScrollShadowsStylesContainer: HTMLStyleElement;
    }): void {
        this._scrollContainer = containers.scrollContainer || this._scrollContainer;
        this._contentContainer = containers.contentContainer || this._contentContainer;
        this._stylesContainer = containers.stylesContainer || this._stylesContainer;
        this._transformStylesContainer = containers.transformStylesContainer;
        this._shadowsStylesContainer = containers.shadowsStylesContainer;
    }

    getScrollPosition(): number {
        return this._scrollPosition;
    }

    getScrollLength(): number {
        return this._contentSize - this._containerSize;
    }

    /**
     * Устанавливает новую позицию скролла.
     * @remark Переданная новая позиция скролла может отличаться от той, которая будет установлена.
     * Например, если было передано нецелое число, оно будет округлено.
     * @param newPosition Новая позиция скролла
     * @public
     */
    setScrollPosition(newPosition: number, immediate?: boolean, useAnimation?: boolean): number {
        return this._setScrollPosition(newPosition, immediate, useAnimation);
    }

    /**
     * Устанавливает новую позицию скролла.
     * @remark Переданная новая позиция скролла может отличаться от той, которая будет установлена.
     * Например, если было передано нецелое число, оно будет округлено.
     * @param newPosition Новая позиция скролла
     * @private
     */
    private _setScrollPosition(
        newPosition: number,
        immediate?: boolean,
        useAnimation?: boolean
    ): number {
        const newScrollPosition = getValueInBounds(Math.round(newPosition), [
            0,
            this._contentSize - this._containerSize,
        ]);
        if (this._scrollPosition !== newScrollPosition) {
            const oldScrollPosition = this._scrollPosition;
            const oldShadowState = { ...this._shadowState };
            this._currentScrollDirection =
                this._scrollPosition > newScrollPosition ? 'backward' : 'forward';
            this._scrollPosition = newScrollPosition;
            this._updateShadowState();
            this._drawTransform(this._scrollPosition, immediate, {
                oldPosition: oldScrollPosition,
                oldShadowState,
                useAnimation,
                animationState: 'begin',
            });
        }
        return this._scrollPosition;
    }

    setIsEmptyTemplateShown(newState: boolean): void {
        if (this._options.isEmptyTemplateShown !== newState) {
            this._options.isEmptyTemplateShown = newState;
        }
    }

    setColumnScrollViewMode(newState: IScrollBarOptions['mode']): void {
        if (this._options.columnScrollViewMode !== newState) {
            this._options.columnScrollViewMode = newState;
        }
    }

    setStickyColumnsCount(newStickyColumnsCount: number, silence: boolean = false): void {
        this._options.stickyColumnsCount = newStickyColumnsCount;
        if (!silence) {
            this._updateFixedColumnWidth(this._options.isFullGridSupport);
        }
    }

    private _updateShadowState(): void {
        this._shadowState.start = this._scrollPosition > 0;
        this._shadowState.end = this._contentSize - this._containerSize - this._scrollPosition >= 1;
    }

    getScrollPositionWithinContainer(container: HTMLElement): number {
        const scrollContainerRect = this._getScrollContainerRect();
        const scrollableColumns = this._getScrollableColumns(container);
        const scrollableColumnsSizes = scrollableColumns.map((column) => {
            return column.getBoundingClientRect();
        });

        // Фильтруем колонки в соответствии с направлением скролла
        const scrollContainerIntersectionSide =
            this._currentScrollDirection === 'backward'
                ? scrollContainerRect.left
                : scrollContainerRect.right;
        const filteredColumns = scrollableColumnsSizes.filter((rect) => {
            return (
                rect.left < scrollContainerIntersectionSide &&
                rect.right > scrollContainerIntersectionSide
            );
        });
        // Для multiHeader выбираем колонку с минимальной шириной
        const currentColumnRect = filteredColumns.reduce((acc, item) => {
            return !acc.width || item.width < acc.width ? item : acc;
        }, {} as DOMRect);

        if (currentColumnRect) {
            return this.getScrollPositionToColumnRectEdge(currentColumnRect);
        } else {
            return this._scrollPosition;
        }
    }

    /**
     * Набирает текущие параметры колонок внутри переданного контейнера
     * @private
     * @param container header или footer таблицы
     */
    private _getScrollableColumns(container: HTMLDivElement): HTMLElement[] {
        if (this._scrollableColumns) {
            return this._scrollableColumns;
        }
        this._scrollableColumns = [];
        if (!container) {
            return this._scrollableColumns;
        }
        const htmlColumns = Array.from(
            container.querySelectorAll(`.${JS_SELECTORS.SCROLLABLE_ELEMENT}`)
        );
        if (htmlColumns) {
            htmlColumns.forEach((column: HTMLElement) => {
                if (column.offsetWidth) {
                    this._scrollableColumns.push(column);
                }
            });
        }
        return this._scrollableColumns;
    }

    getShadowStyles(position: 'start' | 'end'): string {
        let shadowStyles = '';

        if (this._shadowState[position]) {
            shadowStyles += 'visibility: visible;';
        }

        if (position === 'start' && this._shadowState[position]) {
            const side = this._options.isRtl ? 'right' : 'left';
            shadowStyles += `${side}: ${this._fixedColumnsWidth}px;`;
        }
        if (this._options.isEmptyTemplateShown) {
            const emptyTemplate = this._scrollContainer.getElementsByClassName(
                'js-controls-GridView__emptyTemplate'
            )[0];
            shadowStyles += 'height: ' + (emptyTemplate as HTMLDivElement).offsetTop + 'px;';
        }
        return shadowStyles;
    }

    /**
     * Обновляет состояния горизонтального скролла при изменении размера контента и/или его контейнера. Может быть исполненна немедленно или отложено.
     */
    updateSizes(presetSizes?: {
        scrollContainerSize: number;
        contentContainerSize: number;
    }): boolean {
        return this._updateSizes(presetSizes);
    }

    //# region Обновление размеров. Приватные методы
    private _updateSizes(calculatedSizes: {
        scrollContainerSize: number;
        contentContainerSize: number;
    }): boolean {
        if (this._isDestroyed || !this._scrollContainer) {
            return false;
        }

        let newContentSize;
        let newContainerSize;
        const hasSizesPreSet = !!calculatedSizes;
        const isFullGridSupport = this._options.isFullGridSupport;
        let originStickyDisplayValue;

        if (!hasSizesPreSet) {
            // горизонтальный сколл имеет position: sticky и из-за особенностей grid-layout скрываем
            // скролл (display: none),что-бы он не распирал таблицу при изменении ширины
            originStickyDisplayValue = this._toggleStickyElementsForScrollCalculation(false);

            if (detection.safari) {
                this._fixSafariBug();
            }
            this._drawTransform(0);

            newContentSize = this._contentContainer.scrollWidth;
            newContainerSize = isFullGridSupport
                ? this._contentContainer.offsetWidth
                : this._scrollContainer.offsetWidth;
        } else {
            newContentSize = calculatedSizes.contentContainerSize;
            newContainerSize = calculatedSizes.scrollContainerSize;
            if (
                this._contentSize === newContentSize &&
                this._containerSize === newContainerSize &&
                this._fixedColumnsWidth === calculatedSizes.fixedColumnsWidth
            ) {
                return false;
            }
        }

        if (this._contentSize !== newContentSize || this._containerSize !== newContainerSize) {
            this._setBorderScrollPosition(newContentSize, newContainerSize);
            this._contentSize = newContentSize;
            this._containerSize = newContainerSize;

            // reset scroll position after resize, if we don't need scroll
            if (newContentSize <= newContainerSize) {
                this._scrollPosition = 0;
            }
        }
        this._updateShadowState();
        this._updateFixedColumnWidth(isFullGridSupport);

        if (newContainerSize + this._scrollPosition > newContentSize) {
            this._scrollPosition -= newContainerSize + this._scrollPosition - newContentSize;
        }

        this._contentSizeForHScroll = isFullGridSupport
            ? this._contentSize - this._fixedColumnsWidth
            : this._contentSize;
        this._drawTransform(this._scrollPosition, hasSizesPreSet);

        if (!hasSizesPreSet) {
            this._toggleStickyElementsForScrollCalculation(true, originStickyDisplayValue);
        }
        this._scrollableColumns = null;
        return true;
    }

    /**
     * Скрывает/показывает горизонтальный скролл (display: none),
     * чтобы, из-за особенностей sticky элементов, которые лежат внутри grid-layout,
     * они не распирали таблицу при изменении ширины.
     * @param {Boolean} visible Определяет, будут ли отображены sticky элементы
     */
    private _toggleStickyElementsForScrollCalculation(visible: false): string;
    private _toggleStickyElementsForScrollCalculation(visible: true, originValue?: string): void;
    private _toggleStickyElementsForScrollCalculation(
        visible: true | false,
        originValue?: string
    ): void | string {
        const stickyElements = this._contentContainer.querySelectorAll(
            '.js-controls-ColumnScroll__thumbWrapper'
        );
        let stickyElement;
        let originDisplayValue: string;

        for (let i = 0; i < stickyElements.length; i++) {
            stickyElement = stickyElements[i] as HTMLElement;
            if (visible) {
                if (originValue) {
                    stickyElement.style.display = originValue;
                } else {
                    stickyElement.style.removeProperty('display');
                }
            } else {
                originDisplayValue = stickyElement.style.display;
                stickyElement.style.display = 'none';
            }
        }

        return originDisplayValue;
    }

    private _setBorderScrollPosition(newContentSize: number, newContainerSize: number): void {
        // Если при расширении таблицы, скрол находился в конце, он должен остаться в конце.
        if (
            this._contentSize !== 0 &&
            this._scrollPosition !== 0 &&
            newContentSize > this._contentSize &&
            this._scrollPosition === this._contentSize - this._containerSize
        ) {
            this._scrollPosition = newContentSize - newContainerSize;
        }
    }

    private _updateFixedColumnWidth(isFullGridSupport: boolean): void {
        this._fixedColumnsWidth = !this._options.stickyColumnsCount
            ? 0
            : this._options.getFixedPartWidth();
        this._scrollWidth = isFullGridSupport
            ? this._scrollContainer.offsetWidth - this._fixedColumnsWidth
            : this._scrollContainer.offsetWidth;
    }

    private _fixSafariBug(): void {
        // Should init force reflow
        const header = this._contentContainer.getElementsByClassName(
            'controls-Grid__header'
        )[0] as HTMLElement;

        if (header) {
            header.style.display = 'none';
            // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
            this._contentContainer.offsetWidth;
            header.style.removeProperty('display');
        }
    }

    //# endregion

    getTransformStyles(
        position: number = this._scrollPosition,
        options: IGetTransformStylesParams = {}
    ): string {
        const isFullGridSupport = this._options.isFullGridSupport;
        const transformSelector = this._transformSelector;
        let newTransformHTML = '';
        const getPosition = (pos) => {
            return this._options.isRtl ? pos * -1 : pos;
        };

        // Горизонтальный скролл передвигает всю таблицу, но компенсирует скролл для некоторых ячеек, например для
        // зафиксированных ячеек

        if (isFullGridSupport && options.useAnimation && options.animationState === 'begin') {
            const ANIMATION_DURATION = '0.4s';
            const scrollAnimationId = 'scrollAnimation';
            const compensationAnimationId = 'compensationAnimation';

            newTransformHTML += `@keyframes ${scrollAnimationId} { from { transform: translateX(${getPosition(
                -options.oldPosition
            )}px); } to { transform: translateX(${getPosition(-position)}px); } }`;
            newTransformHTML += `@keyframes ${compensationAnimationId} { from { transform: translateX(${getPosition(
                options.oldPosition
            )}px); } to { transform: translateX(${getPosition(position)}px); } }`;

            // Скроллируется таблица
            newTransformHTML += `.${transformSelector}>.${JS_SELECTORS.CONTENT} { animation-duration: ${ANIMATION_DURATION}; animation-name: ${scrollAnimationId}; }`;

            // Не скроллируем зафиксированные элементы
            newTransformHTML += `.${transformSelector} .${JS_SELECTORS.FIXED_ELEMENT} { animation-duration: ${ANIMATION_DURATION}; animation-name: ${compensationAnimationId}; }`;

            // Не скроллируем операции над записью
            if (isFullGridSupport) {
                // Cкролируем скроллбар при полной поддержке гридов, т.к. он лежит в трансформнутой области. При
                // table-layout скроллбар лежит вне таблицы
                newTransformHTML += `.${transformSelector} .js-controls-GridView__emptyTemplate {animation-duration: ${ANIMATION_DURATION}; animation-name: ${compensationAnimationId};}`;

                // Safari (MacOS, IOS) вплоть до версии 15.4 считает координаты иначе,
                // чем другие браузеры и для него не нужно делать transition.
                // проверка на Object.hasOwn гарантирует, что версия 15.4 и выше,
                // по-другому проверить минорную версию нельзя.
                if (!detection.safari || !!Object.hasOwn) {
                    newTransformHTML += `.${transformSelector} .controls-Grid__itemAction {animation-duration: ${ANIMATION_DURATION}; animation-name: ${compensationAnimationId};}`;
                }
            }

            this._isAnimationInProcess = true;

            this._contentContainer.onanimationend = () => {
                if (this._isAnimationInProcess) {
                    this._drawTransform(position, false, {
                        useAnimation: true,
                        animationState: 'end',
                    });
                    this._isAnimationInProcess = false;
                }
            };
        } else {
            // Скроллируется таблица
            newTransformHTML += `.${transformSelector}>.${
                JS_SELECTORS.CONTENT
            } {transform: translateX(${getPosition(-position)}px);}`;

            // Не скроллируем зафиксированные элементы
            newTransformHTML += `.${transformSelector} .${
                JS_SELECTORS.FIXED_ELEMENT
            } {transform: translateX(${getPosition(position)}px);}`;

            // Не скроллируем операции над записью
            if (isFullGridSupport) {
                // Cкролируем скроллбар при полной поддержке гридов, т.к. он лежит в трансформнутой области. При
                // table-layout скроллбар лежит вне таблицы
                newTransformHTML += `.${transformSelector} .js-controls-GridView__emptyTemplate {transform: translateX(${getPosition(
                    position
                )}px);}`;

                // Safari (MacOS, IOS) вплоть до версии 15.4 считает координаты иначе,
                // чем другие браузеры и для него не нужно делать transition.
                // проверка на Object.hasOwn гарантирует, что версия 15.4 и выше,
                // по-другому проверить минорную версию нельзя.
                if (!detection.safari || !!Object.hasOwn) {
                    newTransformHTML += `.${transformSelector} .controls-Grid__itemAction {transform: translateX(${getPosition(
                        position
                    )}px);}`;
                }
            }
        }

        // скроллируем индикаторы загрузки
        // сбрасываем расстягивание на всю ширину контейнера индикатора, чтобы корректно его позиционировать
        newTransformHTML += `.${transformSelector} .controls-Grid__loadingIndicator-content { width: ${
            this._containerSize
        }px; transform: translateX(${getPosition(position)}px); }`;

        // Не скроллируем операции над записью и не анимируем пока не перешли на нативный скролл.
        // Отсутствие анимации в реальном кейсе почти невозможно заметить.
        if (!isFullGridSupport) {
            const maxVisibleScrollPosition = position - (this._contentSize - this._containerSize);
            newTransformHTML += ` .${transformSelector} .controls-Grid-table-layout__itemActions__container {transform: translateX(${getPosition(
                maxVisibleScrollPosition
            )}px);}`;
        }

        return newTransformHTML;
    }

    getColumnScrollStyles(): string {
        this._options.toggleScrollBarCallback(true);

        return ColumnScrollController._getColumnScrollStyles(
            this._transformSelector,
            this._options.useFakeRender,
            this._options.isFullGridSupport,
            this._scrollWidth
        );
    }

    getShadowsStyles(options: IGetShadowsStylesParams = {}): string {
        if (options.useAnimation && options.animationState === 'begin') {
            const isShadowShown =
                (!options.oldShadowState.start && this._shadowState.start) ||
                (!options.oldShadowState.end && this._shadowState.end);
            if (!isShadowShown) {
                return this._shadowsStylesContainer.innerHTML;
            }
        }

        const transformSelector = this._transformSelector;
        let newHTML = '';
        // Обновление теней не должно вызывать перерисовку
        if (!this._options.useFakeRender) {
            newHTML += `.${transformSelector}>.js-controls-ColumnScroll__shadows .js-controls-ColumnScroll__shadow_position-start {${this.getShadowStyles(
                'start'
            )}}`;
            newHTML += `.${transformSelector}>.js-controls-ColumnScroll__shadows .js-controls-ColumnScroll__shadow_position-end {${this.getShadowStyles(
                'end'
            )}}`;
        }

        return newHTML;
    }

    private _drawTransform(
        position: number,
        immediate?: boolean,
        params?: IDrawTransformParams
    ): void {
        // This is the fastest synchronization method scroll position and cell transform.
        // Scroll position synchronization via VDOM is much slower.
        const newHTML = this.getColumnScrollStyles();
        const newTransformHTML = this.getTransformStyles(position, params);
        const newShadowsHTML = this.getShadowsStyles(params);

        if (
            this._stylesContainer.innerHTML !== newHTML ||
            this._transformStylesContainer.innerHTML !== newTransformHTML ||
            this._shadowsStylesContainer.innerHTML !== newShadowsHTML
        ) {
            const update = () => {
                if (this._stylesContainer.innerHTML !== newHTML) {
                    this._stylesContainer.innerHTML = newHTML;
                }

                if (this._transformStylesContainer.innerHTML !== newTransformHTML) {
                    this._transformStylesContainer.innerHTML = newTransformHTML;
                }

                if (this._shadowsStylesContainer.innerHTML !== newShadowsHTML) {
                    this._shadowsStylesContainer.innerHTML = newShadowsHTML;
                }
            };
            if (immediate) {
                update();
            } else {
                window.requestAnimationFrame(() => {
                    update();
                });
            }
        }
    }

    disableFakeRender(): void {
        this._options.useFakeRender = false;
        this._drawTransform(this._scrollPosition, true);
    }

    scrollByWheel(e: SyntheticEvent<WheelEvent>): number {
        const nativeEvent = e.nativeEvent;

        if (nativeEvent.shiftKey || nativeEvent.deltaX) {
            e.stopPropagation();
            e.preventDefault();

            const maxPosition = this._contentSize - this._containerSize;
            let delta: number;

            // deltaX определена, когда качаем колесом мыши
            if (nativeEvent.deltaX) {
                delta = this._calcWheelDelta(detection.firefox, nativeEvent.deltaX);
            } else {
                delta = this._calcWheelDelta(detection.firefox, nativeEvent.deltaY);
            }
            // Новая позиция скролла должна лежать в пределах допустимых значений (от 0 до максимальной, включительно).
            return Math.max(0, Math.min(this._scrollPosition + delta, maxPosition));
        }
        return this._scrollPosition;
    }

    private _calcWheelDelta(isFirefox: boolean, delta: number): number {
        /**
         * Определяем смещение ползунка. В Firefox в дескрипторе события в свойстве deltaY лежит маленькое значение,
         * поэтому установим его сами. Нормальное значение есть в дескрипторе события MozMousePixelScroll в
         * свойстве detail, но на него нельзя подписаться.
         * TODO: https://online.sbis.ru/opendoc.html?guid=3e532f22-65a9-421b-ab0c-001e69d382c8
         */
        const correctDelta = isFirefox
            ? Math.sign(delta) * WHEEL_DELTA_INCREASE_COEFFICIENT
            : delta;
        return correctDelta * WHEEL_SCROLLING_SMOOTH_COEFFICIENT;
    }

    getSizes(): object {
        return {
            containerSize: this._containerSize,
            contentSize: this._contentSize,
            fixedColumnsWidth: this._fixedColumnsWidth,
            scrollableColumnsWidth: this._containerSize - this._fixedColumnsWidth,
            contentSizeForHScroll: this._contentSizeForHScroll,
            scrollWidth: this._scrollWidth,
        };
    }

    private getScrollPositionToColumnRectEdge(columnRect: DOMRect): number {
        const scrollableRect = this._getScrollContainerRect();

        // Граница ячейки за пределами видимой скроллируемой области.
        // Величина смещения может быть дробной, нужно по максимуму сдвинуть скролл в ту сторону.
        // Для этого округляем в соответствующую направлению скролла
        // сторону (у ячейкислева в меньшую, справа в большую, а у скроллконтейнера наоборот).
        if (columnRect.right > scrollableRect.right) {
            const newScrollPosition =
                this._scrollPosition +
                (Math.round(columnRect.right) - Math.floor(scrollableRect.right));
            return Math.min(newScrollPosition, this.getScrollLength());
        } else if (columnRect.left < scrollableRect.left) {
            const newScrollPosition =
                this._scrollPosition -
                (Math.floor(scrollableRect.left) - Math.round(columnRect.left));
            return Math.max(0, newScrollPosition);
        }
        return this._scrollPosition;
    }

    /**
     * Возвращает параметры области, в которой скроллится содержимое
     * @private
     */
    private _getScrollContainerRect(): DOMRect {
        const containerRect = this._scrollContainer.getBoundingClientRect();
        return {
            right: containerRect.right,
            left: containerRect.left + this._fixedColumnsWidth,
        } as DOMRect;
    }

    destroy(): void {
        this._options.toggleScrollBarCallback(false);
        if (this._stylesContainer) {
            this._stylesContainer.innerHTML = '';
        }
        if (this._transformStylesContainer) {
            this._transformStylesContainer.innerHTML = '';
        }
        if (this._shadowsStylesContainer) {
            this._shadowsStylesContainer.innerHTML = '';
        }
        this._isDestroyed = true;
        this._options = {} as IControllerOptions;
    }

    shouldDrawColumnScroll(
        viewContainers: object,
        getFixedPartWidth: Function,
        isFullGridSupport: boolean,
        task1184956815?: boolean
    ): IShouldDrawColumnScrollResult {
        this._drawTransform(0, true);
        const res = ColumnScrollController.shouldDrawColumnScroll(
            viewContainers,
            getFixedPartWidth,
            isFullGridSupport,
            task1184956815
        );
        this._drawTransform(this._scrollPosition, true);

        return res;
    }

    static createUniqSelector(uniqueId: string): string {
        return `controls-ColumnScroll__transform-${uniqueId}`;
    }

    static getPreRenderTransformStyles(
        uniqSelector: string,
        position: number,
        isRtl?: boolean
    ): string {
        let style = '';
        const getPosition = (pos) => {
            return isRtl ? pos * -1 : pos;
        };

        style += ColumnScrollController._getColumnScrollStyles(uniqSelector, true, true);
        style += `.${uniqSelector}>.${JS_SELECTORS.CONTENT} {transform: translateX(${getPosition(
            -position
        )}px);}`;
        style += `.${uniqSelector} .${
            JS_SELECTORS.FIXED_ELEMENT
        } {transform: translateX(${getPosition(position)}px);}`;
        style += `.${uniqSelector} .js-controls-GridView__emptyTemplate {transform: translateX(${getPosition(
            position
        )}px);}`;
        return style;
    }

    private static _getColumnScrollStyles(
        uniqSelector: string,
        useFakeRender: boolean,
        isFullGridSupport: boolean,
        scrollWidth?: number
    ): string {
        let styles = '';
        styles += ` .${uniqSelector} .controls-Grid__header-cell_withColumnScrollArrows { padding-bottom: calc( var(--inline_height_ArrowButton) + 2 * var(--offset_2xs) ); }`;
        if (useFakeRender) {
            styles += ` .${uniqSelector} .js-controls-ColumnScroll__thumb.controls-VScrollbar { visibility: hidden; }`;
        }
        if (!isFullGridSupport) {
            if (typeof scrollWidth !== 'undefined') {
                styles += ` .${uniqSelector} .js-controls-ColumnScroll__thumb {width: ${scrollWidth}px;}`;
            }
            // IE, Edge, и Yandex в WinXP нужно добавлять z-index чтобы они показались поверх других translated строк
            if (detection.isIE || detection.isWinXP) {
                styles += ` .${uniqSelector} .controls-Grid-table-layout__itemActions__container {z-index: 1}`;
            }
        } else if (typeof scrollWidth !== 'undefined') {
            styles += ` .${uniqSelector} .controls-ColumnScroll__thumbWrapper {width: ${scrollWidth}px;}`;
        }

        styles += ` .${uniqSelector} .${JS_SELECTORS.FIXED_ELEMENT}.controls-GridView__footer__fixed {z-index: 2}`;
        styles += ` .${uniqSelector} .${JS_SELECTORS.FIXED_ELEMENT}.controls-GridView__footer__fixed_singleCell {z-index: 1}`;
        styles += ` .${uniqSelector} .${JS_SELECTORS.FIXED_ELEMENT}.controls-TreeGrid__node-extraItem__fixed {z-index: 1}`;
        styles += ` .${uniqSelector} .${JS_SELECTORS.FIXED_ELEMENT} {z-index: 3;}`;
        return styles;
    }

    static getShadowClasses(
        position: 'start' | 'end',
        params: {
            isVisible?: boolean;
            needBottomPadding?: boolean;
            backgroundStyle?: string;
        }
    ): string {
        return (
            'controls-ColumnScroll__shadow tw-top-0 tw-absolute tw-pointer-events-none tw-box-border tw-invisible' +
            ` controls-ColumnScroll__shadow-${params.backgroundStyle}` +
            (params.needBottomPadding
                ? ' controls-ColumnScroll__shadow_with-bottom-padding'
                : ' tw-bottom-0') +
            ` controls-ColumnScroll__shadow_position-${position}` +
            ` js-controls-ColumnScroll__shadow_position-${position}`
        );
    }

    static shouldDrawColumnScroll(
        viewContainers: object,
        getFixedPartWidth: Function,
        isFullGridSupport: boolean,
        task1184956815?: boolean
    ): IShouldDrawColumnScrollResult {
        const fixHeaderBreadcrumbsNegativeOffset = (
            header: HTMLElement,
            contentContainerSize: number
        ): number => {
            // Controls/explorer:View добавляет хлебные крошки в шапку.
            // В силу особенностей GridLayout, при включенном множественном выборе они отображаются во второй
            // ячейке шапки, которой дан отрицательный отступ. Он учитывается как доп контент в
            // scrollWidth родителя. В таком кейсе искусственно уменьшаем ширину контента на ширину чекбокса.
            // UPD: Ошибка стала нестабильной, разломала много мест,
            // проще поправить под таской место для которого делалось, т.к. старый скролл будет удаляться.
            if (task1184956815) {
                const backButtonSelector = '.js-controls-Explorer__HeadingPathBack';
                const checkBoxCellSelector = '.js-controls-Grid__header-cell-checkbox';
                const backButtonHeader = header.querySelector(backButtonSelector);

                if (backButtonHeader) {
                    const checkBoxCell = header.querySelector(checkBoxCellSelector);
                    if (checkBoxCell) {
                        return contentContainerSize - checkBoxCell.getBoundingClientRect().width;
                    }
                }
            }
            return contentContainerSize;
        };

        const calculateContentContainerSize = (
            header: HTMLElement,
            contentContainerSize: number
        ): number => {
            let result = fixHeaderBreadcrumbsNegativeOffset(header, contentContainerSize);
            // В FireFox при подсчете scrollWidth учитываются элементы с абсолютным позиционированием.
            // Поэтому, если колонка шириной 0px обернута в StickyBlock, ее scrollWidth может быть больше нуля.
            // Демо-пример отрабатывает по-разному в Chrome и FireFox https://jsfiddle.net/0k35rLz2/
            if (header.children) {
                for (let i = 0; i < header.children.length; i++) {
                    const child: HTMLElement = header.children[i];
                    if (child.offsetWidth === 0 && child.scrollWidth > 0) {
                        result -= child.scrollWidth;
                    }
                }
            }
            return result;
        };

        const calcResult = (): object => {
            let contentContainerSize = 0;
            let scrollContainerSize = 0;
            let fixedColumnsWidth = 0;
            const header =
                'header' in viewContainers ? viewContainers.header : viewContainers.results;

            if (!header) {
                Logger.error('Header is missing!');
            } else {
                contentContainerSize = calculateContentContainerSize(
                    header,
                    viewContainers.grid.scrollWidth
                );
                scrollContainerSize = isFullGridSupport
                    ? viewContainers.grid.offsetWidth
                    : viewContainers.gridWrapper.offsetWidth;
                fixedColumnsWidth =
                    contentContainerSize > scrollContainerSize
                        ? getFixedPartWidth(viewContainers.gridWrapper, header)
                        : 0;
            }
            return {
                status: contentContainerSize > scrollContainerSize,
                sizes: {
                    scrollContainerSize,
                    contentContainerSize,
                    fixedColumnsWidth,
                },
            };
        };

        let result;
        const scrollBarContainer = viewContainers?.horizontalScrollBar?._container;

        // В IE поведение ядра отличается от современных браузеров.
        // В нем, на момент componentDidMount таблицы вложенные контролы еще не достроились по какой-то причине.
        // Все контролы строятся синхронно. Выписана ошибка.
        // https://online.sbis.ru/opendoc.html?guid=f1f72e85-9f91-4563-8b52-ae519e761655&client=3
        if (scrollBarContainer) {
            const origin = scrollBarContainer.style.display;
            scrollBarContainer.style.display = 'none';
            result = calcResult();
            scrollBarContainer.style.display = origin;
        } else {
            result = calcResult();
        }

        return result;
    }

    static getEmptyViewMaxWidth(viewContainers: object, options: IControllerOptions): number {
        return options.isFullGridSupport
            ? viewContainers.grid.offsetWidth
            : viewContainers.gridWrapper.offsetWidth;
    }
}
