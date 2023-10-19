/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { detection } from 'Env/Env';
import { IDialogPopupOptions, IPopupPosition, IPopupSizes, Controller as ManagerController } from 'Controls/popup';
import {
    getPositionProperties,
    HORIZONTAL_DIRECTION,
    VERTICAL_DIRECTION,
} from '../Util/DirectionUtil';
import { IDialogItem } from 'Controls/_popupTemplateStrategy/Dialog/DialogController';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

interface ILimitingSizes {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}

type Position = ILimitingSizes & IDialogPosition;

interface IDialogPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    width: number;
    height: number;
}

const POSITION_COORDINATES = ['top', 'left', 'right', 'bottom'];

export class DialogStrategy {
    /**
     * Returns popup position
     * @function Controls/_popupTemplateStrategy/Dialog/Opener/DialogStrategy#getPosition
     * @param windowData The parameters of the browser window
     * @param containerSizes Popup container sizes
     * @param item Popup configuration
     */
    getPosition(
        windowData: IPopupPosition = {},
        containerSizes: IPopupSizes,
        item: IDialogItem
    ): Position {
        const limitedSizes = this._calculateLimitOfSizes(item, windowData);
        const { minWidth, maxWidth, minHeight, maxHeight } = limitedSizes;

        const positionCoordinates = this._getPositionCoordinates(
            windowData,
            containerSizes,
            item,
            limitedSizes
        );
        const position = this._validateCoordinate(
            positionCoordinates,
            limitedSizes,
            windowData,
            containerSizes
        );

        this._resetMargins(item, position);

        // TODO: Разломали вьюпорт, окно не видно, т.к. оно позиционируется где-то снизу
        // https://online.sbis.ru/opendoc.html?guid=02d50c15-f20b-4585-8dda-23cc067fc709&client=3
        if (position.top && !ManagerController.getIsAdaptive()) {
            position.top = 100;
        }

        return {
            ...position,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
        };
    }

    private _validateCoordinate(
        position: IDialogPosition,
        limitedSizes: ILimitingSizes,
        windowData: IPopupPosition = {},
        containerSizes: IPopupSizes
    ): IDialogPosition {
        const { maxWidth, maxHeight } = limitedSizes;
        const height = position.height || containerSizes.height;
        const outsideBottomBorderValue = position.top + height - windowData.height;
        if (outsideBottomBorderValue > 0) {
            position.top -= outsideBottomBorderValue;
        }
        if (position.height > maxHeight) {
            position.height = maxHeight;
        }
        if (position.width > maxWidth) {
            position.width = maxWidth;
        }

        // Не даем краю диалога позиционироваться за видимой областью
        POSITION_COORDINATES.forEach((coordName) => {
            if (position[coordName] !== undefined && position[coordName] < 0) {
                position[coordName] = 0;
            }
        });
        return position;
    }

    private _resetMargins(item: IDialogItem, position: IDialogPosition): void {
        const topOffset =
            (item.sizes?.margins?.top || 0) + (item.popupOptions?.offset?.vertical || 0);
        const horizontalOffset =
            (item.sizes?.margins?.left || 0) + (item.popupOptions.offset?.horizontal || 0);
        // Сбрасываю все отступы, которые заданы на css. Они уже учтены в позиции
        if (item.targetCoords || topOffset || horizontalOffset) {
            position.margin = 0;
        }
    }

    /**
     * Получение позиции диалога
     * @param {IPopupPosition} windowData
     * @param {IPopupSizes} containerSizes
     * @param {IDialogItem} popupItem
     * @param {ILimitingSizes} limitedSizes
     * @return {IDialogPosition}
     * @private
     */
    private _getPositionCoordinates(
        windowData: IPopupPosition,
        containerSizes: IPopupSizes,
        popupItem: IDialogItem,
        limitedSizes: ILimitingSizes
    ): IDialogPosition {
        const popupOptions = popupItem?.popupOptions || {};

        if (popupItem.fixPosition) {
            const position = popupItem?.position || {};

            const isRightProperty =
                position.right !== undefined || popupOptions.right !== undefined;
            const horizontalProperty = isRightProperty
                ? HORIZONTAL_DIRECTION.RIGHT
                : HORIZONTAL_DIRECTION.LEFT;

            const isBottomProperty =
                position.bottom !== undefined || popupOptions.bottom !== undefined;
            const verticalProperty = isBottomProperty
                ? VERTICAL_DIRECTION.BOTTOM
                : VERTICAL_DIRECTION.TOP;

            return this._getPositionForFixPositionDialog(
                position,
                windowData,
                containerSizes,
                popupItem,
                verticalProperty,
                horizontalProperty
            );
        } else {
            const properties = getPositionProperties(popupOptions.resizeDirection);
            const position: IDialogPosition = this._getDefaultPosition(
                windowData,
                containerSizes,
                popupItem,
                properties.vertical,
                properties.horizontal,
                limitedSizes
            );

            this._updateCoordsByOptions(windowData, popupItem, position);
            return position;
        }
    }

    private _getCoordinate(popupItem: IDialogItem, coordinate: string): number {
        if (popupItem.targetCoords && popupItem.targetCoords[coordinate]) {
            return popupItem.targetCoords[coordinate];
        }
        return popupItem.popupOptions[coordinate];
    }

    private _updateCoordsByOptions(
        windowData: IPopupPosition,
        popupItem: IDialogItem,
        position: IDialogPosition
    ): void {
        const topCoordinate = this._getCoordinate(popupItem, 'top');
        const isRightCoordinate = typeof popupItem.popupOptions.right !== 'undefined';
        const coordinate = isRightCoordinate ? 'right' : 'left';
        const horizontalCoordinate = this._getCoordinate(popupItem, coordinate);
        const isMaximizePopup = popupItem.popupOptions.maximize;

        if (
            (topCoordinate === undefined && horizontalCoordinate === undefined) ||
            isMaximizePopup
        ) {
            return;
        }

        const topOffset =
            (popupItem.sizes?.margins?.top || 0) + (popupItem.popupOptions.offset?.vertical || 0);
        const horizontalOffset =
            (popupItem.sizes?.margins?.left || 0) +
            (popupItem.popupOptions.offset?.horizontal || 0);
        const top = (topCoordinate || 0) + topOffset;
        const horizontalPosition = (horizontalCoordinate || 0) + horizontalOffset;

        if (topCoordinate !== undefined) {
            position.top = top;
        }
        if (horizontalCoordinate !== undefined) {
            const popupWidth = popupItem.popupOptions.width || popupItem.sizes?.width;
            // Calculating the position when reducing the size of the browser window
            const differenceWindowWidth: number =
                horizontalPosition + popupWidth - windowData.width - windowData.left;
            if (differenceWindowWidth > 0) {
                position[coordinate] = horizontalPosition - differenceWindowWidth;
            } else {
                position[coordinate] = horizontalPosition;
            }
        }
    }

    /**
     * Возвращает позицию для центрированного диалога(дефолтное состояние)
     * @param {IPopupPosition} windowData
     * @param {IPopupSizes} containerSizes
     * @param {IDialogItem} item
     * @param {string} verticalPositionProperty
     * @param {string} horizontalPositionProperty
     * @param {ILimitingSizes} limitedSizes
     * @return {IDialogPosition}
     * @private
     */
    private _getDefaultPosition(
        windowData: IPopupPosition,
        containerSizes: IPopupSizes,
        item: IDialogItem,
        verticalPositionProperty: string,
        horizontalPositionProperty: string,
        limitedSizes: ILimitingSizes
    ): IDialogPosition {
        const popupOptions = item.popupOptions;
        const height = this._calculateValue(
            popupOptions,
            containerSizes.height,
            windowData.height,
            parseInt(popupOptions.height, 10),
            limitedSizes.maxHeight,
            limitedSizes.minHeight,
            'height'
        );
        const width = this._calculateValue(
            popupOptions,
            containerSizes.width,
            windowData.width,
            parseInt(popupOptions.width, 10),
            limitedSizes.maxWidth,
            limitedSizes.minWidth,
            'width'
        );
        const position = { height, width };

        // Если диалоговое окно открыто через touch, то позиционируем его в самом верху экрана.
        // Это решает проблемы с показом клавиатуры и прыжком контента из-за изменившегося scrollTop.
        // Даем возможность некоторые окна отображать по центру ( например, окно подтверждения)
        // кроме ios, android
        if (
            item.contextIsTouch &&
            !popupOptions.isCentered &&
            !detection.isMobileIOS &&
            !detection.isMobileAndroid
        ) {
            position[verticalPositionProperty] =
                verticalPositionProperty === VERTICAL_DIRECTION.TOP ? 0 : containerSizes.height;
        } else {
            position[verticalPositionProperty] = this._getVerticalPostion(
                windowData,
                height || containerSizes.height,
                popupOptions,
                verticalPositionProperty
            );
        }
        position[horizontalPositionProperty] = this._getHorizontalPosition(
            windowData,
            width || containerSizes.width,
            popupOptions,
            horizontalPositionProperty
        );
        return position;
    }

    /**
     * Получение новой позиции диалога при перетаскивании,
     * с учетом того что он не должен вылететь за родительский контейнер
     * @param {IPopupPosition} popupPosition
     * @param {IPopupPosition} windowData
     * @param {IPopupSizes} containerSizes
     * @param {IDialogItem} popupItem
     * @param {string} verticalPositionProperty
     * @param {string} horizontalPositionProperty
     * @return {IDialogPosition}
     * @private
     */
    private _getPositionForFixPositionDialog(
        popupPosition: IPopupPosition = {},
        windowData: IPopupPosition,
        containerSizes: IPopupSizes,
        popupItem: IDialogItem,
        verticalPositionProperty: string,
        horizontalPositionProperty: string
    ): IDialogPosition {
        const width = popupPosition.width;
        const height = popupPosition.height;
        const horizontalPosition =
            typeof popupPosition[horizontalPositionProperty] !== 'undefined'
                ? popupPosition[horizontalPositionProperty]
                : popupItem.popupOptions[horizontalPositionProperty];
        const verticalPosition =
            typeof popupPosition[verticalPositionProperty] !== 'undefined'
                ? popupPosition[verticalPositionProperty]
                : popupItem.popupOptions[verticalPositionProperty];
        let horizontalValue = Math.max(0, horizontalPosition);
        let verticalValue = Math.max(0, verticalPosition);

        let diff;
        // check overflowX
        const containerWidth = Math.min(containerSizes.width, width || containerSizes.width);
        diff = horizontalPosition + containerWidth - (windowData.width + windowData.left);
        horizontalValue -= Math.max(0, diff || 0);
        if (horizontalValue < 0) {
            horizontalValue = 0;
        }

        // check overflowY
        const containerHeight = Math.min(containerSizes.height, height || containerSizes.height);
        diff = verticalPosition + containerHeight - (windowData.height + windowData.top);
        verticalValue -= Math.max(0, diff || 0);
        if (verticalValue < 0) {
            verticalValue = 0;
        }

        return {
            height,
            width,
            [horizontalPositionProperty]: horizontalValue,
            [verticalPositionProperty]: verticalValue,
        };
    }

    private _calculateLimitOfSizes(item: IDialogItem, windowData: IPopupPosition): ILimitingSizes {
        const popupOptions = item.popupOptions;
        let maxHeight = popupOptions.maxHeight || windowData.height;
        if (!maxHeight && (popupOptions.top || popupOptions.maximize || maxHeight === null)) {
            maxHeight = windowData.height;
        }
        const itemMinHeight = this._getMinHeight(item, windowData);
        if (popupOptions.fittingMode === 'overflow') {
            maxHeight = windowData.height;
        } else {
            const positionTop = Math.min(
                item.startPosition?.top || item.position?.top || popupOptions.top,
                popupOptions.top
            );
            if (windowData.height < positionTop + maxHeight) {
                maxHeight = windowData.height - positionTop;
            }
        }
        const minHeight = Math.min(
            itemMinHeight,
            typeof maxHeight === 'number' ? maxHeight : itemMinHeight
        );
        maxHeight = Math.min(maxHeight, windowData.height);

        if (minHeight) {
            maxHeight = Math.max(minHeight, maxHeight);
        }

        const sizes = {
            minWidth: popupOptions.minWidth,
            maxHeight,
            maxWidth: Math.min(popupOptions.maxWidth || windowData.width, windowData.width),
        };

        if (unsafe_getRootAdaptiveMode().device.isPhone()) {
            sizes.minWidth = popupOptions.minWidth
                ? Math.min(popupOptions.minWidth || windowData.width, windowData.width)
                : undefined;
        }

        // TODO: https://online.sbis.ru/opendoc.html?guid=749f06a2-eafd-47be-a3d2-4961e3cff130
        if (
            !item.popupOptions.ignoreMinHeight &&
            item.popupOptions.resizeDirection?.vertical !== 'top'
        ) {
            if (maxHeight) {
                sizes.minHeight = Math.min(itemMinHeight, maxHeight);
            } else {
                sizes.minHeight = itemMinHeight;
            }
        } else if (item.popupOptions.minHeight) {
            sizes.minHeight = item.popupOptions.minHeight;
        }

        return sizes;
    }

    private _getMinHeight(item: IDialogItem, windowData: IPopupPosition): number {
        // Размер, который сохраняется при развороте не должен ломать ресайзы рабочей области и вылезать за нее
        if (item.resizeMinHeight) {
            return Math.min(item.resizeMinHeight, windowData.height);
        }
        return item.popupOptions.minHeight;
    }

    private _calculateValue(
        popupOptions: IDialogPopupOptions = {},
        containerValue: number,
        windowValue: number,
        popupValue: number,
        maxValue: number,
        minValue: number,
        type: string
    ): number {
        // Если 0, NaN, null ставлю undefined, чтобы шаблонизатор не добавил в аттрибуты
        let value = popupValue || undefined;
        const availableMaxSize = maxValue ? Math.min(windowValue, maxValue) : windowValue;
        const availableMinSize = minValue ? minValue : 0;
        if (popupOptions.maximize) {
            return windowValue;
        } else if (!containerValue && !popupValue) {
            // Если считаем размеры до построения контрола и размеры не задали на опциях
            return undefined;
        }
        if (
            type === 'width' &&
            (containerValue >= availableMaxSize || popupValue >= availableMaxSize)
        ) {
            value = Math.max(availableMaxSize, availableMinSize);
        }

        if (containerValue < availableMinSize || popupValue < availableMinSize) {
            value = availableMinSize;
        }
        return value;
    }

    private _isIOS13(): boolean {
        return detection.isMobileIOS && detection.IOSVersion > 12;
    }

    /**
     * Получение горизонтального отступа для центрированного диалога с учетом resizeDirection
     * @param windowData
     * @param width
     * @param popupOptions
     * @param horizontalPositionProperty
     * @return {number}
     * @private
     */
    private _getHorizontalPosition(
        windowData: IPopupPosition,
        width: number,
        popupOptions: IDialogPopupOptions,
        horizontalPositionProperty: string
    ): number {
        // Position from prop storage
        const optionsPosition = popupOptions[horizontalPositionProperty];
        if (popupOptions[horizontalPositionProperty]) {
            return optionsPosition;
        }
        if (!width) {
            return;
        }

        const wWidth = windowData.width;
        const windowOffset = windowData.left || 0;
        if (popupOptions.maximize) {
            return windowOffset;
        }
        return windowOffset + Math.max(Math.round((wWidth - width) / 2), 0);
    }

    private _getVerticalPostion(
        windowData: IPopupPosition,
        height: number,
        popupOptions: IDialogPopupOptions,
        verticalPositionProperty: string
    ): number {
        // Position from prop storage
        const optionsPosition = popupOptions[verticalPositionProperty];
        if (popupOptions[verticalPositionProperty]) {
            return optionsPosition;
        }

        if (popupOptions.maximize) {
            return 0;
        }
        if (!height) {
            return;
        }
        const middleCoef = 2;
        const top = windowData.topScroll + windowData.top;
        let scrollTop: number = top || 0;

        // только на ios13 scrollTop больше чем нужно. опытным путем нашел коэффициент
        if (this._isIOS13()) {
            scrollTop /= middleCoef;
        }
        return Math.round((windowData.height - height) / middleCoef) + scrollTop;
    }
}

export default new DialogStrategy();
