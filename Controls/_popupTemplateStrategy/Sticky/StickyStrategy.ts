/**
 * @kaizen_zone 75e61337-2408-4b9e-b6c7-556929cedca1
 */
import * as cMerge from 'Core/core-merge';
import { constants, detection } from 'Env/Env';
import { isTouchDesktop } from 'EnvTouch/EnvTouch';
import { IPopupPosition, IPopupSizes } from 'Controls/popup';
import { IStickyPositionConfig } from 'Controls/_popupTemplateStrategy/Sticky/StickyController';
import { ITargetCoords } from 'Controls/_popupTemplateStrategy/TargetCoords';
import { DEFAULT_ZOOM_VALUE, DimensionsMeasurer } from 'Controls/sizeUtils';
import getDirection from 'Controls/_popupTemplateStrategy/Util/getDirection';
import { getStore } from 'Application/Env';
import { findPopupParentId } from 'Controls/_popupTemplateStrategy/PopupController/Utils/findPopupParentId';

let TouchKeyboardHelper = {};

if (detection.isMobileIOS && detection.IOSVersion === 12) {
    import('Controls/Utils/TouchKeyboardHelper').then((module) => {
        return (TouchKeyboardHelper = module.default);
    });
}

type TDirection = 'vertical' | 'horizontal';
type TSizeProperty = 'width' | 'height';

interface IBody {
    width: number;
    height: number;
    scrollHeight: number;
    scrollWidth: number;
}

interface IVisualViewport {
    height: number;
    offsetLeft: number;
    offsetTop: number;
    pageLeft: number;
    pageTop: number;
    width: number;
}

const INVERTING_CONST = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
    center: 'center',
};

// Позиция, за пределами экрана, по которой происходит изначальное построение окна
const START_POSITION = -10000;

export class StickyStrategy {
    getPosition(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        targetElement: HTMLElement
    ): IPopupPosition {
        // Во время первого позиционирования, окно должно отобразиться рядом с таргетом,
        // даже если передали fixPosition = true.
        if (
            popupCfg.position?.top === START_POSITION &&
            popupCfg.position?.left === START_POSITION &&
            popupCfg.fixPosition
        ) {
            popupCfg.fixPosition = false;
        }
        const position = {
            zoom: this.getPopupZoom(targetCoords.zoom),
            // position: 'fixed'
        };
        this._prepareRestrictiveCoords(popupCfg, targetCoords);
        cMerge(
            position,
            this._calculatePosition(
                popupCfg,
                targetCoords,
                'horizontal',
                targetElement,
                position.zoom
            )
        );
        cMerge(
            position,
            this._calculatePosition(
                popupCfg,
                targetCoords,
                'vertical',
                targetElement,
                position.zoom
            )
        );
        this._setMaxSizes(popupCfg, position, targetElement);
        this._resetMargins(position);
        this._scalePositionToZoom(position);
        return position;
    }

    private _calculatePosition(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        direction: TDirection,
        targetElement: HTMLElement,
        zoom: number
    ): IPopupPosition {
        const property = direction === 'horizontal' ? 'width' : 'height';
        const position = this._getPosition(popupCfg, targetCoords, direction, targetElement, zoom);
        let resultPosition = position;
        let positionOverflow = this._checkOverflow(
            popupCfg,
            targetCoords,
            position,
            direction,
            targetElement,
            zoom
        );

        /*
         При масштабировании иногда браузер криво считает размеры контейнера,
         из-за чего возникают дробные размеры контейнеров > body,
         из-за которых позиционирование по какому-то краю приводит к overflow < 1px
       */
        if (positionOverflow >= 1) {
            if (popupCfg.fittingMode[direction] === 'fixed') {
                resultPosition = this._calculateFixedModePosition(
                    popupCfg,
                    property,
                    position,
                    positionOverflow
                );
            } else if (popupCfg.fittingMode[direction] === 'overflow' || popupCfg.fixPosition) {
                resultPosition = this._calculateOverflowModePosition(
                    popupCfg,
                    property,
                    position,
                    positionOverflow,
                    targetElement
                );
            } else {
                this._invertPosition(popupCfg, direction, resultPosition);
                const revertPosition = this._getPosition(
                    popupCfg,
                    targetCoords,
                    direction,
                    targetElement,
                    zoom
                );
                let revertPositionOverflow = this._checkOverflow(
                    popupCfg,
                    targetCoords,
                    revertPosition,
                    direction,
                    targetElement,
                    zoom
                );
                if (revertPositionOverflow > 0) {
                    if (positionOverflow <= revertPositionOverflow) {
                        this._invertPosition(popupCfg, direction, resultPosition);
                        this._fixPosition(position, targetCoords, targetElement, popupCfg);
                        positionOverflow = this._checkOverflow(
                            popupCfg,
                            targetCoords,
                            position,
                            direction,
                            targetElement,
                            zoom
                        );
                        if (positionOverflow > 0) {
                            if (popupCfg.fittingMode[direction] === 'adaptiveOverflow') {
                                resultPosition = this._calculateOverflowModePosition(
                                    popupCfg,
                                    property,
                                    position,
                                    positionOverflow,
                                    targetElement
                                );
                            } else {
                                this._restrictContainer(
                                    position,
                                    property,
                                    popupCfg,
                                    positionOverflow
                                );
                            }
                            if (direction === 'vertical') {
                                if (
                                    popupCfg.position?.minHeight &&
                                    position.height < popupCfg.position.minHeight
                                ) {
                                    const diff = popupCfg.position.minHeight - position.height;
                                    if (popupCfg.direction[direction] === 'top') {
                                        position.bottom -= diff;
                                    } else {
                                        position.top -= diff;
                                    }
                                    position.height = popupCfg.position.minHeight;
                                }
                            }
                        }
                        resultPosition = position;
                    } else {
                        // Fix position and overflow, if the revert position is outside of the window,
                        // but it can be position in the visible area
                        this._fixPosition(revertPosition, targetCoords, targetElement, popupCfg);
                        revertPositionOverflow = this._checkOverflow(
                            popupCfg,
                            targetCoords,
                            revertPosition,
                            direction,
                            targetElement,
                            zoom
                        );
                        if (revertPositionOverflow > 0) {
                            if (popupCfg.fittingMode[direction] === 'adaptiveOverflow') {
                                resultPosition = this._calculateOverflowModePosition(
                                    popupCfg,
                                    property,
                                    revertPosition,
                                    revertPositionOverflow,
                                    targetElement,
                                    zoom
                                );
                            } else {
                                this._restrictContainer(
                                    revertPosition,
                                    property,
                                    popupCfg,
                                    revertPositionOverflow
                                );
                            }
                        }
                        resultPosition = revertPosition;
                    }
                } else {
                    resultPosition = revertPosition;
                    if (revertPositionOverflow === 0) {
                        this._restrictContainer(
                            revertPosition,
                            property,
                            popupCfg,
                            revertPositionOverflow
                        );
                    }
                }
            }
        }
        this._checkOverlapsElements(
            popupCfg.preventOverlapsClassNames,
            position,
            direction,
            popupCfg.sizes
        );
        this._fixPosition(resultPosition, targetCoords, targetElement, popupCfg);
        this._calculateRestrictionContainerCoords(popupCfg, resultPosition, targetElement);
        return resultPosition;
    }

    private _getPosition(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        direction: TDirection,
        targetElement: HTMLElement,
        zoom: number
    ): IPopupPosition {
        const position = {};
        const isHorizontal = direction === 'horizontal';
        let coord: string = isHorizontal ? 'left' : 'top';
        if (popupCfg.customPosition?.[coord]) {
            return {
                [coord]: popupCfg.customPosition[coord],
            };
        }
        if (popupCfg.fixPosition) {
            if (popupCfg.direction[direction] === coord) {
                coord = isHorizontal ? 'right' : 'bottom';
            }
            position[coord] = popupCfg.position[coord];
        } else if (popupCfg.direction[direction] === 'center') {
            const targetCoord: number = targetCoords[coord];
            const targetSize: number = targetCoords[isHorizontal ? 'width' : 'height'];
            const popupSize: number = popupCfg.sizes[isHorizontal ? 'width' : 'height'];
            const margins: number = this._getMargins(popupCfg, direction, zoom);
            const middleCoef: number = 2;
            position[coord] =
                targetCoord + targetSize / middleCoef - popupSize / middleCoef + margins;
        } else {
            if (popupCfg.direction[direction] === coord) {
                coord = isHorizontal ? 'right' : 'bottom';
                const visualViewport = this._getVisualViewport(targetElement);
                const viewportOffset: number =
                    visualViewport[isHorizontal ? 'offsetLeft' : 'offsetTop'];
                let viewportPage: number = visualViewport[isHorizontal ? 'pageLeft' : 'pageTop'];
                // Если таргет находится в другом окне, не будем учитывать скролл страницы.
                if (findPopupParentId(targetElement)) {
                    viewportPage = 0;
                }
                const viewportSize: number = visualViewport[isHorizontal ? 'width' : 'height'];
                let topSpacing: number = viewportSize + viewportOffset;
                if (!getStore('AdaptiveInitializer').get('isScrollOnBody')) {
                    topSpacing += viewportPage;
                }
                const bottomSpacing: number =
                    this._getBody(targetElement)[isHorizontal ? 'width' : 'height'] - topSpacing;
                const targetCoord: number = this._getTargetCoords(
                    popupCfg,
                    targetCoords,
                    coord,
                    direction
                );
                const margins: number = this._getMargins(popupCfg, direction, zoom);
                position[coord] = topSpacing - targetCoord - margins;
                if (!getStore('AdaptiveInitializer').get('isScrollOnBody') || viewportOffset) {
                    position[coord] += bottomSpacing;
                }
            } else {
                const targetCoord: number = this._getTargetCoords(
                    popupCfg,
                    targetCoords,
                    coord,
                    direction
                );
                const margins: number = this._getMargins(popupCfg, direction, zoom);
                position[coord] = targetCoord + margins;

                if (detection.isMobilePlatform) {
                    if (getStore('AdaptiveInitializer').get('isScrollOnBody')) {
                        if (!isHorizontal) {
                            const temp1 =
                                targetCoord + popupCfg.sizes.height - window.visualViewport.height;
                            if (temp1 > 50) {
                                position.top = targetCoord - targetCoords.topScroll;
                                position.position = 'absolute';
                            }
                        } else {
                            position.left += targetCoords.leftScroll;
                        }
                    }
                }
            }
        }
        return position;
    }

    private _checkOverlapsElements(
        preventOverlapsClassNames: string[],
        position: IPopupPosition,
        direction: TDirection,
        sizes: IPopupSizes
    ): void {
        if (!preventOverlapsClassNames) {
            return;
        }
        preventOverlapsClassNames.forEach((className: string) => {
            const overlapsElement = document.querySelector(`.${className}`);
            if (!overlapsElement) {
                return;
            }
            const offsetElementPosition = overlapsElement.getBoundingClientRect();
            if (direction === 'horizontal') {
                const windowDimensions = DimensionsMeasurer.getWindowDimensions();
                const shouldOffsetLeft =
                    offsetElementPosition.right > position.left ||
                    windowDimensions.innerWidth - offsetElementPosition.left > position.right;
                const shouldOffsetRight =
                    offsetElementPosition.left < position.left + sizes.width ||
                    windowDimensions.innerWidth - offsetElementPosition.right <
                        position.right + sizes.width;
                if (shouldOffsetLeft && shouldOffsetRight) {
                    const offsetLeft =
                        offsetElementPosition.right - position.left ||
                        -(
                            position.right +
                            sizes.width -
                            (windowDimensions.innerWidth - offsetElementPosition.right)
                        );
                    const offsetRight =
                        -(position.left + sizes.width - offsetElementPosition.left) ||
                        windowDimensions.innerWidth - offsetElementPosition.left - position.right;
                    const offset =
                        Math.abs(offsetLeft) > Math.abs(offsetRight) ? offsetRight : offsetLeft;
                    if (typeof position.left === 'number') {
                        position.left += offset;
                    } else {
                        position.right += offset;
                    }
                }
            }
        });
    }

    private _checkOverflowNoFixPosition(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        position: IPopupPosition,
        direction: TDirection,
        targetElement: HTMLElement,
        zoom
    ): number {
        const isHorizontal = direction === 'horizontal';
        const popupDirection = popupCfg.direction[direction];
        const restrictiveContainerPosition = popupCfg.restrictiveContainerCoords;
        const restrictiveContainerCoord = restrictiveContainerPosition?.[popupDirection] || 0;
        const coordinate = position[isHorizontal ? 'right' : 'bottom'];
        if (coordinate < 0) {
            // Координата right/bottom может быть отрицательная, если на body находится скролл, т.к. позиция считается
            // относительно основного контейнера body.
            const body = this._getBody(targetElement);
            // Допустимые отрицательные координаты
            const negativeOverflowValue =
                body[isHorizontal ? 'scrollWidth' : 'scrollHeight'] -
                body[isHorizontal ? 'width' : 'height'];
            const dif = Math.abs(coordinate) - negativeOverflowValue;
            if (dif > 0) {
                if (detection.isMobileIOS) {
                    const windowSize =
                        this._getWindowSizes(targetElement)[isHorizontal ? 'width' : 'height'];
                    const containerSize: number = restrictiveContainerPosition
                        ? Math.min(restrictiveContainerCoord, windowSize)
                        : windowSize;
                    return dif + popupCfg.sizes[isHorizontal ? 'width' : 'height'] - containerSize;
                } else {
                    return dif;
                }
            }
        }
        const targetCoord = this._getTargetCoords(
            popupCfg,
            targetCoords,
            isHorizontal ? 'right' : 'bottom',
            direction
        );
        const margins = this._getMargins(popupCfg, direction);
        let topScroll = targetCoords.topScroll;
        const leftScroll = targetCoords.leftScroll;
        if (detection.isMobileSafari) {
            topScroll = Math.max(
                topScroll - DimensionsMeasurer.getVisualViewportDimensions(targetElement).offsetTop,
                0
            );
        }
        if (findPopupParentId(targetElement)) {
            topScroll = 0;
        }
        return (
            popupCfg.sizes[isHorizontal ? 'width' : 'height'] * zoom -
            margins -
            (targetCoord - (isHorizontal ? leftScroll : topScroll)) +
            restrictiveContainerCoord
        );
    }

    private _checkOverflowKeyboard(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        position: IPopupPosition,
        direction: TDirection,
        targetElement: HTMLElement
    ): number {
        const isHorizontal = direction === 'horizontal';
        const popupDirection = popupCfg.direction[direction];
        const restrictiveContainerPosition = popupCfg.restrictiveContainerCoords;
        const restrictiveContainerCoord = restrictiveContainerPosition?.[popupDirection] || 0;

        let taskBarKeyboardIosHeight = 0;
        // Над клавой в ios может быть показана управляющая панель высотой 30px (задается в настройках ios).
        // У нас нет никакой инфы про ее наличие и/или высоту.
        // Единственное решение учитывать ее всегда и поднимать окно от низа экрана на 45px.
        // С проектированием решили увеличить до 45.
        if (this._isIOS12()) {
            if (!isHorizontal && TouchKeyboardHelper.isKeyboardVisible(true)) {
                taskBarKeyboardIosHeight = 45;
            }
        }
        // При открытии клавиаутры происходит изменение размеров браузера по вертикали
        // Только в этом случае viewPortOffset находится вне windowSize, его нужно учитывать при подсчете размеров окна
        // Если контент страницы больше, чем боди, появляется нативный скролл,
        // В этом случае нужно учитывать viewPortPageTop
        const visualViewport = this._getVisualViewport(targetElement);
        let viewportOffset: number = isHorizontal ? 0 : visualViewport.offsetTop;
        if (
            !isHorizontal &&
            !getStore('AdaptiveInitializer').get('isScrollOnBody') &&
            detection.isMobilePlatform
        ) {
            viewportOffset = viewportOffset || visualViewport.pageTop;
        }

        let positionValue: number;
        if (popupCfg.fixPosition) {
            positionValue =
                position[isHorizontal ? 'left' : 'top'] ||
                position[isHorizontal ? 'right' : 'bottom'];
        } else {
            positionValue = position[isHorizontal ? 'left' : 'top'];
            if (typeof positionValue === 'undefined') {
                if (!isHorizontal) {
                    positionValue = position.bottom + popupCfg.sizes.height;
                } else {
                    positionValue = position.right;
                }
            }
        }
        const popupSize: number = popupCfg.sizes[isHorizontal ? 'width' : 'height'];
        const windowSize = this._getWindowSizes(targetElement)[isHorizontal ? 'width' : 'height'];
        // Размер restrictiveContainer не больше размера экрана
        const containerSize: number = restrictiveContainerPosition
            ? Math.min(restrictiveContainerCoord, windowSize)
            : windowSize;
        let overflow =
            positionValue + taskBarKeyboardIosHeight + popupSize - containerSize - viewportOffset;
        if (this._isIOS12()) {
            overflow -= targetCoords[isHorizontal ? 'leftScroll' : 'topScroll'];
        }
        return overflow;
    }

    private _checkOverflow(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        position: IPopupPosition,
        direction: TDirection,
        targetElement: HTMLElement,
        zoom: number
    ): number {
        const isHorizontal = direction === 'horizontal';
        const popupDirection = popupCfg.direction[direction];
        const restrictiveContainerPosition = popupCfg.restrictiveContainerCoords;
        const restrictiveContainerCoord = restrictiveContainerPosition?.[popupDirection] || 0;

        if (position.hasOwnProperty(isHorizontal ? 'right' : 'bottom') && !popupCfg.fixPosition) {
            // Если открыли окно на windows и есть touch, то скорей всего есть клавиатура
            if (detection.isWin && isHorizontal && isTouchDesktop()) {
                return this._checkOverflowKeyboard(
                    popupCfg,
                    targetCoords,
                    position,
                    direction,
                    targetElement
                );
            }
            return this._checkOverflowNoFixPosition(
                popupCfg,
                targetCoords,
                position,
                direction,
                targetElement,
                zoom
            );
        }
        if (position[isHorizontal ? 'left' : 'top'] < 0) {
            return -position[isHorizontal ? 'left' : 'top'];
        }
        return this._checkOverflowKeyboard(
            popupCfg,
            targetCoords,
            position,
            direction,
            targetElement
        );
    }

    private _invertPosition(
        popupCfg: IStickyPositionConfig,
        direction: TDirection,
        position: IPopupPosition
    ): void {
        popupCfg.targetPoint[direction] = INVERTING_CONST[popupCfg.targetPoint[direction]];
        popupCfg.direction[direction] = INVERTING_CONST[popupCfg.direction[direction]];
        // В случае, если нам нужно инвертировать позицию у окна, которое позиционируется по центру, попытаемся
        // расположить его слева от таргета.
        if (popupCfg.direction[direction] === 'center' && direction === 'horizontal') {
            if (position.left < 0) {
                popupCfg.targetPoint[direction] = 'left';
                popupCfg.direction[direction] = 'right';
            } else {
                popupCfg.targetPoint[direction] = 'right';
                popupCfg.direction[direction] = 'left';
            }
        }
        popupCfg.offset[direction] *= -1;
        if (popupCfg.sizes.margins) {
            popupCfg.sizes.margins[direction === 'horizontal' ? 'left' : 'top'] *= -1;
        }
    }

    private _moveContainer(
        popupCfg: IStickyPositionConfig,
        position: IPopupPosition,
        sizeProperty: TSizeProperty,
        positionOverflow: number
    ): void {
        const positionProperty = Object.keys(position)[0];
        let overflow = Math.ceil(positionOverflow);
        // Reset position and overflow, if the original position is outside of the window
        if (position[positionProperty] < 0) {
            position[positionProperty] = overflow = 0;
        }

        position[positionProperty] -= overflow;
        if (position[positionProperty] < 0) {
            this._restrictContainer(position, sizeProperty, popupCfg, -position[positionProperty]);
            position[positionProperty] = 0;
        }
    }

    private _calculateFixedModePosition(
        popupCfg: IStickyPositionConfig,
        property: TSizeProperty,
        position: IPopupPosition,
        positionOverflow: number
    ): IPopupPosition {
        this._restrictContainer(position, property, popupCfg, positionOverflow);
        return position;
    }

    private _calculateOverflowModePosition(
        popupCfg: IStickyPositionConfig,
        property,
        position: IPopupPosition,
        positionOverflow: number,
        targetElement: HTMLElement
    ): IPopupPosition {
        this._moveContainer(popupCfg, position, property, positionOverflow);

        // Если после перепозиционирования попап всё равно не влезает, то уменьшаем ему высоту до высоты окна
        const popupSize = position[property] || popupCfg.sizes[property] || 0;
        const windowSize = this._getWindowSizes(targetElement)[property];

        /*
         Фиксируем высоту, т.к. некоторые браузеры(ie) не могут понять высоту родителя без заданного height
         >= 0 из-за того, что висит max-height/max-width и в случае когда контейнер больше то у него размер
         будет равен размеру вью порта
       */
        if (popupSize >= windowSize) {
            position[property] = windowSize;
        }
        return position;
    }

    private _calculateRestrictionContainerCoords(
        popupCfg: IStickyPositionConfig,
        position: IPopupPosition,
        targetElement: HTMLElement
    ): void {
        const coords = popupCfg.restrictiveContainerCoords;
        const height = position.height > 0 ? position.height : popupCfg.sizes?.height;
        const width = position.width || popupCfg.sizes?.width;
        const body = this._getBody(targetElement);
        if (coords) {
            if (coords.top > position.top) {
                position.top = coords.top;
            }
            let dif = position.bottom + height - (body.height - coords.top);
            if (dif > 0) {
                position.bottom -= dif;
            } else if (position.top + height > coords.bottom) {
                // Не выше, чем верхняя граница restrictiveContainer'a
                position.top = Math.max(coords.bottom - height, coords.top);
            }

            if (coords.left > position.left) {
                position.left = coords.left;
            }
            dif = position.right + width - (body.width - coords.left);
            if (dif > 0) {
                position.right -= dif;
            } else if (position.left + width > coords.right) {
                // Не левее, чем левая граница restrictiveContainer'a
                position.left = Math.max(coords.right - width, coords.left);
            }
        }
    }

    private _restrictContainer(
        position: IPopupPosition,
        property: TSizeProperty,
        popupCfg: IStickyPositionConfig,
        overflow: number
    ): void {
        position[property] = popupCfg.sizes[property] - overflow;
    }

    private _getTargetCoords(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords,
        coord: string,
        direction: TDirection
    ): number {
        if (popupCfg.targetPoint[direction] === 'center') {
            if (coord === 'right' || coord === 'left') {
                return targetCoords.left + targetCoords.width / 2;
            }
            if (coord === 'top' || coord === 'bottom') {
                return targetCoords.top + targetCoords.height / 2;
            }
        }
        return targetCoords[popupCfg.targetPoint[direction]];
    }

    private _fixPosition(
        position: IPopupPosition,
        targetCoords: ITargetCoords,
        targetElement: HTMLElement,
        popupCfg: IStickyPositionConfig
    ): void {
        if (this._isMobileIOS()) {
            this._fixBottomPositionForIos(position, targetCoords);
        }

        // На сайте не должно быть нативного скролла на уровне body
        // + окно, увеличивая размер, само может выйти за пределы экрана, что приведет к появлению scrollHeight на body
        if (position.bottom) {
            position.bottom = Math.max(position.bottom, 0);
        }
        if (position.top) {
            position.top = Math.max(position.top, 0);
            if (
                !!detection.isMobilePlatform &&
                getStore('AdaptiveInitializer').get('isScrollOnBody')
            ) {
                position._position = position.position;
            }
        }
        if (position.left) {
            position.left = Math.max(position.left, 0);
        }
        if (position.right) {
            position.right = Math.max(position.right, popupCfg.externalButtonOffset || 0);
        }
    }

    protected _isKeyboardVisible() {
        if (constants.isBrowserPlatform && document.activeElement) {
            const isInput = document.activeElement.tagName === 'INPUT';
            const isTextArea = document.activeElement.tagName === 'TEXTAREA';
            const isContentEditable =
                document.activeElement.getAttribute('contenteditable') === 'true';

            if (isInput || isTextArea || isContentEditable) {
                return true;
            }
        }
        return false;
    }

    private _setMaxSizes(
        popupCfg: IStickyPositionConfig,
        position: IPopupPosition,
        targetElement: HTMLElement
    ): void {
        const windowSizes = this._getWindowSizes(targetElement);

        if (popupCfg.config.maxWidth) {
            position.maxWidth = Math.min(popupCfg.config.maxWidth, windowSizes.width);
        } else {
            let horizontalPadding = 0;
            if (popupCfg.fittingMode.horizontal !== 'overflow') {
                horizontalPadding = position.left || position.right || 0;
            }
            position.maxWidth = windowSizes.width - horizontalPadding;
        }

        if (popupCfg.config.minWidth) {
            position.minWidth = popupCfg.config.minWidth;
        }

        if (popupCfg.config.maxHeight) {
            position.maxHeight = Math.min(popupCfg.config.maxHeight, windowSizes.height);
        } else {
            // На ios возвращается неверная высота страницы, из-за чего накладывая maxWidth === windowSizes.height
            // окно визуально обрезается. Делаю по body, у него высота правильная
            let verticalPadding = 0;

            let verticalScroll;
            const visualViewport = this._getVisualViewport(targetElement);
            // Учитываем, какая часть страницы проскроллена снизу или сверху, в зависимости от точки позиционирования
            if (position.top) {
                verticalScroll = visualViewport.pageTop;
            } else {
                verticalScroll =
                    this._getBody(targetElement).height - this._getViewportHeight(targetElement);
                if (visualViewport.pageTop) {
                    // Если позиция по вертикали фиксированная, то нужно прибавлять проскроленной растояние при открытой клавиатуре
                    // Если этого не делать, то максимальная высота будет высчитываться не корректно, и окно может открыться поверх target
                    if (popupCfg.fittingMode.vertical === 'fixed') {
                        verticalScroll += visualViewport.pageTop;
                    } else {
                        verticalScroll -= visualViewport.pageTop;
                    }
                }
            }

            if (popupCfg.fittingMode.vertical !== 'overflow') {
                verticalPadding = position.top || position.bottom || 0;
            }

            position.maxHeight =
                this._getViewportHeight(targetElement) - verticalPadding + verticalScroll;
            if (detection.isMobileSafari) {
                position.maxHeight = Math.round(position.maxHeight * visualViewport.scale);
                if (typeof position.top !== 'undefined') {
                    position.top = Math.max(position.top - visualViewport.pageTop, 0);
                } else if (typeof position.bottom !== 'undefined') {
                    position.bottom += visualViewport.pageTop;
                };
            }
        }
        if (popupCfg.restrictiveContainerCoords) {
            if (!(detection.isMobileSafari && this._isKeyboardVisible())) {
                position.maxHeight -= popupCfg.restrictiveContainerCoords.top;
            }
            if (position.maxHeight > popupCfg.restrictiveContainerCoords.height) {
                position.maxHeight = popupCfg.restrictiveContainerCoords.height;
                position.maxHeight -= position.top - popupCfg.restrictiveContainerCoords.top;
                position.maxHeight /= popupCfg.position.zoom;
            }
            if (popupCfg.sizes.height > position.maxHeight) {
                position.height = position.maxHeight;
            }
        }

        if (popupCfg.config.minHeight) {
            position.minHeight = popupCfg.config.minHeight;
        }

        if (popupCfg.config.width) {
            position.width = popupCfg.config.width;
        }
        if (popupCfg.config.height) {
            position.height = popupCfg.config.height;
        }
    }

    private _prepareRestrictiveCoords(
        popupCfg: IStickyPositionConfig,
        targetCoords: ITargetCoords
    ): void {
        if (popupCfg.restrictiveContainerCoords) {
            // Полная проверка на 4 стороны позволит удалить calculateRestrictionContainerCoords
            if (popupCfg.restrictiveContainerCoords.top > targetCoords.top) {
                targetCoords.top = popupCfg.restrictiveContainerCoords.top;
            }
            if (popupCfg.restrictiveContainerCoords.bottom < targetCoords.bottom) {
                targetCoords.bottom = popupCfg.restrictiveContainerCoords.bottom;
            }
        }
    }

    private _resetMargins(position: IPopupPosition): void {
        // Сбрасываю все отступы, которые заданы на css. Они уже учтены в позиции
        position.margin = 0;
    }

    private _getKeyboardHeight(): number {
        return TouchKeyboardHelper.getKeyboardHeight(true);
    }

    /**
     * Оффсеты нужно посчитать с учетом зума, т.к. они высчитываются с контейнера без учета его зума.
     * @param popupCfg
     * @param direction
     * @param zoom
     */
    private _getMargins(
        popupCfg: IStickyPositionConfig,
        direction: TDirection,
        zoom: number = 1
    ): number {
        const horizontalMarginDirection = getDirection('left');
        const margins =
            (popupCfg.sizes.margins &&
                popupCfg.sizes.margins[
                    direction === 'horizontal' ? horizontalMarginDirection : 'top'
                ]) ||
            0;
        const offset = popupCfg.offset[direction] || 0;
        return (margins + offset) * zoom;
    }

    private _getWindow(): Window {
        return window;
    }

    private _getTopScroll(targetCoords): number {
        // in portrait landscape sometimes(!) screen.availHeight < innerHeight =>
        // screen.availHeight / innerHeight < 2 incorrect. We expectation what availHeight > innerHeight always.
        if (this._considerTopScroll()) {
            return targetCoords.topScroll;
        }
        return 0;
    }

    private _considerTopScroll(): boolean {
        return (
            constants.isBrowserPlatform &&
            window.screen.availHeight / window.innerHeight < 2 &&
            window.screen.availHeight > window.innerHeight
        );
    }

    private _getWindowSizes(targetElement: HTMLElement): {
        width: number;
        height: number;
    } {
        // Ширина берется по body специально. В случае, когда уменьшили окно браузера и появился горизонтальный скролл
        // надо правильно вычислить координату right. Для высоты аналогично.
        let height = this._getViewportHeight(targetElement);
        if (this._isIOS12()) {
            height -= TouchKeyboardHelper.getKeyboardHeight(true);
        }
        return {
            width: DimensionsMeasurer.getElementDimensions(document.body).clientWidth,
            height,
        };
    }

    /**
     * Координаты боди нужно скейлить к зуму самого попапа, чтобы считать в одной координатной сетке
     * @param targetElement
     * @private
     */
    private _getBody(targetElement: HTMLElement): IBody {
        const targetZoom = DimensionsMeasurer.getZoomValue(targetElement);
        const popupZoom = this.getPopupZoom(targetZoom);
        const bodyZoom = DimensionsMeasurer.getZoomValue();

        // relative тут потому, что мы уже посчитали свой зум с учетом компенсации зума боди
        // и нам надо его размеры подскалирвоать под нашу координатную сетку
        const bodyDimensions = DimensionsMeasurer.getRelativeElementDimensions(
            document.body,
            bodyZoom !== DEFAULT_ZOOM_VALUE ? popupZoom : bodyZoom
        );
        return {
            height: bodyDimensions.clientHeight,
            scrollHeight: bodyDimensions.scrollHeight,
            scrollWidth: bodyDimensions.scrollWidth,
            width: bodyDimensions.clientWidth,
        };
    }

    getScrollContainer(target: HTMLElement): HTMLElement {
        let parent = target?.parentElement;
        while (parent && parent !== document.body) {
            const parentStyle = window.getComputedStyle(parent);
            if (
                (parentStyle.overflowY === 'auto' ||
                    parentStyle.overflowY === 'scroll' ||
                    parent.classList.contains('controls-Scroll__content_hidden')) &&
                parent.scrollHeight > parent.clientHeight
            ) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    private _getViewportHeight(element: HTMLElement): number {
        return this._getVisualViewport(element).height;
    }

    private _getVisualViewport(element: HTMLElement): IVisualViewport {
        return DimensionsMeasurer.getVisualViewportDimensions(element);
    }

    private _isIOS13(): boolean {
        return this._isMobileIOS() && detection.IOSVersion > 12;
    }

    private _isIOS12(): boolean {
        return this._isMobileIOS() && detection.IOSVersion === 12;
    }

    private _isMobileIOS(): boolean {
        return detection.isMobileIOS;
    }

    private _isMobileDevices(): boolean {
        return detection.isMobileIOS || detection.isMobileAndroid;
    }

    private _isPortrait(): boolean {
        return TouchKeyboardHelper.isPortrait();
    }

    /**
     * Т.к. попап строится в боди, то на него будет накладываться zoom с body(zoom накладывается мультипликативно)
     * Поэтому, чтобы при построении попапа построить его в зуме таргета нужно еще компенсировать на zoom body
     * @param targetZoom
     * @private
     */
    getPopupZoom(targetZoom: number = 1): number {
        const bodyZoom = constants.isBrowserPlatform ? DimensionsMeasurer.getZoomValue() : 1;
        return targetZoom / bodyZoom;
    }

    /**
     * Т.к. Sticky по особому считает зум(он должен открываться в зуме таргета),
     * то приходится дополнительно скалировать его
     * @param position
     * @private
     */
    private _scalePositionToZoom(position: IPopupPosition): void {
        const POSITION_PROPERTIES = ['top', 'bottom', 'right', 'left'];
        const zoomValue = position.zoom;
        POSITION_PROPERTIES.forEach((property) => {
            if (typeof position[property] === 'number') {
                position[property] = position[property] / zoomValue;
            }
        });
    }

    private _fixBottomPositionForIos(position: IPopupPosition, targetCoords: ITargetCoords): void {
        if (position.bottom) {
            if (this._isIOS12()) {
                const keyboardHeight = this._getKeyboardHeight();
                if (!this._isPortrait()) {
                    position.bottom += keyboardHeight;
                }
            }
            // on newer versions of ios(12.1.3/12.1.4), in horizontal orientation sometimes(!) keyboard with the display
            // reduces screen height(as it should be). in this case, getKeyboardHeight returns height 0, and
            // additional offsets do not need to be considered. In other cases,t is necessary to take into account the
            // height of the keyboard. only for this case consider a scrollTop
            if (this._isIOS12()) {
                const win = this._getWindow();
                if (win.innerHeight + win.scrollY > win.innerWidth) {
                    // fix for positioning with keyboard on vertical ios orientation
                    const dif = win.innerHeight - targetCoords.boundingClientRect.top;
                    if (position.bottom > dif) {
                        position.bottom = dif;
                    }
                }
                // } else if (keyboardHeight === 0) {
                //    position.bottom += this._getTopScroll(targetCoords);
                // }
            }
        }
    }
}

export default new StickyStrategy();
