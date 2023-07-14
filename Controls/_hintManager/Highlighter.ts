/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import { IoC } from 'Env/Env';
import {
    HINT_TARGETS_CONTAINER_ID,
    HINT_TARGETS_CONTAINER_CLASS,
    TARGET_HIGHLIGHTER_CLASS,
    TARGET_ACTIVE_HIGHLIGHT_CLASS,
    TARGET_HIGHLIGHTER_BORDER_SIZE,
    DEFAULT_TARGET_HIGHLIGHTER_OFFSET,
    MIN_TARGET_SIZE,
    POPUP_TEMPLATE_CLASS,
    STICKY_TEMPLATE_CLASS,
    EXCEPTION_POPUP_LIST
} from 'Controls/_hintManager/Utils/Constants';
import { IHighlighterOffset } from 'Controls/_hintManager/interface/IStepModel';
import 'css!Controls/hintManager';

interface IElementConfig {
    id?: string;
    className?: string;
    innerHTML?: string;
}

interface IElementPosition {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

const DEFAULT_Z_INDEX = 1;

/**
 * Класс, обеспечивающий визуальное выделение таргета подсказки в маршруте.
 * @public
 */
class Highlighter {
    private _instanceId: string | null;

    private _routeTargetsContainer: HTMLElement | null;
    private _targetHighlighter: HTMLElement | null;

    private _activeTarget: HTMLElement | null;
    private _lastActiveTargetPosition: DOMRect | null;
    private _highlighterOffset: IHighlighterOffset | null;

    private _domObserver: MutationObserver | null;

    constructor(id: string) {
        this._instanceId = id;
    }

    destroy(): void {
        this._instanceId = null;
        this.removeRouteTargetsContainer();
    }

    /**
     * Метод возвращает активный таргет подсказки.
     * @return {?HTMLElement}
     */
    getActiveTarget(): HTMLElement | null {
        return this._activeTarget;
    }

    /**
     * Метод возвращает DOM-элемент, выделяющий таргет подсказки.
     * @return {?HTMLElement}
     */
    getTargetHighlighter(): HTMLElement | null {
        return this._targetHighlighter;
    }

    /**
     * Метод возвращает z-index элемента, выделяющего таргет подсказки.
     * @return {?Number}
     */
    getTargetHighlighterZIndex(): number | null {
        if (this._targetHighlighter) {
            const computedStyle = getComputedStyle(this._targetHighlighter);
            return Highlighter._getZIndex(computedStyle);
        }
        return null;
    }

    /**
     * Метод прокручивает контейнер родителя таргета так, чтобы элемент стал виден пользователю, если таргет за
     * пределами видимости.
     * @param {HTMLElement} target Таргет подсказки.
     */
    scrollIntoView(target: HTMLElement): void {
        if (!target) {
            IoC.resolve('ILogger').error('Controls/_hintManager/Highlighter:scrollIntoView - не передан таргет');
            return;
        }

        if (Highlighter._isTargetOutOfViewport(target)) {
            target.scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * Метод создает и добавляет в body div, который будет содержать в себе элементы, выделяющие таргеты маршрута
     * подсказок.
     */
    createRouteTargetsContainer(): void {
        if (!this._routeTargetsContainer) {
            this._routeTargetsContainer = Highlighter._createElement(document.body, {
                id: `${HINT_TARGETS_CONTAINER_ID}_${this._instanceId}`,
                className: HINT_TARGETS_CONTAINER_CLASS
            });
            this._subscribeToTargetPositionChange();
        }
    }

    /**
     * Метод удаляет div, который содержит в себе элементы, выделяющие таргеты маршрута подсказок.
     */
    removeRouteTargetsContainer(): void {
        this._routeTargetsContainer?.remove();
        this._routeTargetsContainer = null;

        this._targetHighlighter = null;

        this._unsubscribeToTargetPositionChange();
    }

    /**
     * Метод создает и добавляет в верстку div, который будет выделять активный таргет подсказки.
     */
    createTargetHighlighter(): void {
        this.createRouteTargetsContainer();

        if (!this._targetHighlighter) {
            this._targetHighlighter = Highlighter._createTargetHighlighter(this._routeTargetsContainer);
        }
    }

    /**
     * Метод позиционирует div, который выделяет активный таргет подсказки, относительно таргета подсказки, а также
     * запоминает папаметры активного таргета подсказки.
     * @param {HTMLElement} target Таргет подсказки.
     * @param {IHighlighterOffset} highlighterOffset Конфигурация отступов от границ целевого элемента до выделяющей рамки.
     */
    update(target: HTMLElement, highlighterOffset?: IHighlighterOffset): void {
        Highlighter._updateElementPosition(this._targetHighlighter, target, highlighterOffset);
        this._activeTarget = target;
        this._lastActiveTargetPosition = target.getBoundingClientRect();
        this._highlighterOffset = highlighterOffset;
    }

    /**
     * Метод добавляет класс на выделяющий div для визуального выделения активного таргета подсказки.
     */
    addHighlightToTarget(): void {
        if (this._targetHighlighter) {
            this._targetHighlighter.classList.add(TARGET_ACTIVE_HIGHLIGHT_CLASS);
        }
    }

    /**
     * Метод удаляет выделение с указанного таргета подсказки.
     * @param {HTMLElement} target Таргет подсказки.
     */
    removeHighlightFromTarget(target: HTMLElement): void {
        /*
        * Выделение может переместиться на другой элемент до того, как позовется снятие выделения у предыдущего
        * таргета.
        */
        if (target === this._activeTarget) {
            this.removeHighlight();
        }
    }

    /**
     * Метод удаляет выделение и очищает параметры активного таргета подсказки.
     */
    removeHighlight(): void {
        this._targetHighlighter?.classList.remove(TARGET_ACTIVE_HIGHLIGHT_CLASS);
        this._activeTarget = null;
        this._lastActiveTargetPosition = null;
        this._highlighterOffset = null;
    }

    private _subscribeToTargetPositionChange(): void {
        window.addEventListener('resize', this._targetPositionChangeHandler, true);
        document.addEventListener('scroll', this._targetPositionChangeHandler, true);

        if ('MutationObserver' in window) {
            this._domObserver = new MutationObserver(this._targetPositionChangeHandler);
            this._domObserver.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    private _unsubscribeToTargetPositionChange(): void {
        window.removeEventListener('resize', this._targetPositionChangeHandler, true);
        document.removeEventListener('scroll', this._targetPositionChangeHandler, true);

        if (this._domObserver) {
            this._domObserver.disconnect();
            this._domObserver = null;
        }
    }

    private _targetPositionChangeHandler = (): void => {
        if (
            Highlighter._isTargetPositionChanged(this._activeTarget, this._lastActiveTargetPosition)
        ) {
            this._lastActiveTargetPosition = this._activeTarget.getBoundingClientRect();
            Highlighter._updateElementPosition(this._targetHighlighter, this._activeTarget, this._highlighterOffset);
        }
    };

    static _isTargetOutOfViewport(target: HTMLElement): boolean {
        const targetPosition = target.getBoundingClientRect();

        const isTargetHigher = targetPosition.bottom < 0.5 * target.clientHeight;
        const isTargetLower = document.documentElement.clientHeight - targetPosition.top < 0.5 * target.clientHeight;

        return isTargetHigher || isTargetLower;
    }

    static _isTargetPositionChanged(target: HTMLElement | null, lastTargetPosition: DOMRect | null): boolean {
        if (target && lastTargetPosition) {
            const { top, left, bottom, right } = target.getBoundingClientRect();
            const { top: lastTop, left: lastLeft, bottom: lastBottom, right: lastRight } = lastTargetPosition;
            return top !== lastTop || left !== lastLeft || bottom !== lastBottom || right !== lastRight;
        }
        return false;
    }

    static _updateElementPosition(
        element: HTMLElement | null,
        target: HTMLElement | null,
        highlighterOffset?: IHighlighterOffset
    ): void {
        if (!element || !target) {
            return;
        }

        const targetPosition = target.getBoundingClientRect();
        const targetComputedStyle = getComputedStyle(target);

        const topArr = [ targetPosition.top ];
        const leftArr = [ targetPosition.left ];
        const bottomArr = [ targetPosition.bottom ];
        const rightArr = [ targetPosition.right ];
        const zIndexArr = [ DEFAULT_Z_INDEX, Highlighter._getZIndex(targetComputedStyle) ];

        let currentTarget = target;
        let restrictivePosition;

        while (currentTarget.parentElement) {
            const computedStyle = getComputedStyle(currentTarget.parentElement);

            /*
            * TODO: Разработать API взаимодействия с окнами в рамках проекта:
            * https://online.sbis.ru/opendoc.html?guid=4dd3b6d7-e8cd-4332-b332-8ad3cec887e0&client=3
            */
            const parentClassList = currentTarget.parentElement.classList;
            const isPopupParent = (
                parentClassList.contains(`${POPUP_TEMPLATE_CLASS}`) ||
                parentClassList.contains(`${STICKY_TEMPLATE_CLASS}`)
            ) && EXCEPTION_POPUP_LIST.every((item) => !parentClassList.contains(`${item}`));

            /*
            * Нужно выделять только видимую часть таргета подсказки, поэтому приходится учитывать родительские
            * элементы со стилями overflow: hidden.
            * Если элемент находится внутри всплывающего окна, его обводка не должна выходить за пределы окна.
            */
            if (isPopupParent || computedStyle.overflowX === 'hidden' || computedStyle.overflowY === 'hidden') {
                const parentElementPosition = currentTarget.parentElement.getBoundingClientRect();

                if (!restrictivePosition && isPopupParent) {
                    restrictivePosition = parentElementPosition;
                }

                if (computedStyle.overflowX === 'hidden') {
                    leftArr.push(parentElementPosition.left);
                    rightArr.push(parentElementPosition.right);
                }
                if (computedStyle.overflowY === 'hidden') {
                    topArr.push(parentElementPosition.top);
                    bottomArr.push(parentElementPosition.bottom);
                }
            }

            /*
            * Для корректного отображения выделения таргета во всплывающих окнах, нужно учитывать z-index всех
            * родительских элементов.
            */
            const parentElementZIndex = Highlighter._getZIndex(computedStyle);
            if (parentElementZIndex) {
                zIndexArr.push(parentElementZIndex);
            }

            currentTarget = currentTarget.parentElement;
        }

        const { top, bottom, left, right } = Highlighter._getElementPosition(
            topArr,
            bottomArr,
            leftArr,
            rightArr,
            restrictivePosition,
            highlighterOffset
        );

        const height = bottom - top;
        const width = right - left;

        if (height > MIN_TARGET_SIZE && width > MIN_TARGET_SIZE) {
            element.style.top = `${top}px`;
            element.style.left = `${left}px`;
            element.style.height = `${height}px`;
            element.style.width = `${width}px`;

            const resultZIndex = zIndexArr.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );
            element.style.zIndex = `${resultZIndex}`;

            element.style.visibility = 'visible';
        } else {
            element.style.visibility = 'hidden';
        }
    }

    static _getElementPosition(
        topArr: number[],
        bottomArr: number[],
        leftArr: number[],
        rightArr: number[],
        restrictivePosition: Partial<DOMRect> = {},
        highlighterOffset?: IHighlighterOffset
    ): IElementPosition {
        const maxTop = Math.max(...topArr);
        const minBottom = Math.min(...bottomArr);
        const maxLeft = Math.max(...leftArr);
        const minRight = Math.min(...rightArr);

        const top = maxTop - Highlighter._getOffsetValue(highlighterOffset?.top);
        const bottom = minBottom + Highlighter._getOffsetValue(highlighterOffset?.bottom);
        const left = maxLeft - Highlighter._getOffsetValue(highlighterOffset?.left);
        const right = minRight + Highlighter._getOffsetValue(highlighterOffset?.right);

        const restrictiveTop = restrictivePosition.top ?? top;
        const restrictiveBottom = restrictivePosition.bottom ?? bottom;
        const restrictiveLeft = restrictivePosition.left ?? left;
        const restrictiveRight = restrictivePosition.right ?? right;

        return {
            top: Math.max(top, restrictiveTop, 0),
            bottom: Math.min(bottom, restrictiveBottom, document.documentElement.clientHeight),
            left: Math.max(left, restrictiveLeft, 0),
            right: Math.min(right, restrictiveRight, document.documentElement.clientWidth)
        };
    }

    static _getOffsetValue(customValue?: number): number {
        return (customValue ?? DEFAULT_TARGET_HIGHLIGHTER_OFFSET) + TARGET_HIGHLIGHTER_BORDER_SIZE;
    }

    static _getZIndex(computedStyle: CSSStyleDeclaration): number {
        const zIndex = parseInt(computedStyle.zIndex, 10);
        if (!isNaN(zIndex)) {
            return zIndex;
        }
        return 0;
    }

    static _createTargetHighlighter(parent: HTMLElement): HTMLElement {
        return Highlighter._createElement(parent, { className: TARGET_HIGHLIGHTER_CLASS });
    }

    static _createElement(parent: HTMLElement, elementConfig: IElementConfig): HTMLElement {
        const element = document.createElement('div');

        const { id, className, innerHTML } = elementConfig;
        if (id) {
            element.id = id;
        }
        if (className) {
            element.className = className;
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }

        parent.append(element);
        return element;
    }
}

export default Highlighter;
