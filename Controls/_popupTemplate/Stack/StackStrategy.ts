/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { detection } from 'Env/Env';
import { Controller, IPopupPosition } from 'Controls/popup';
import { getRightPanelWidth } from 'Controls/_popupTemplate/BaseController';
import { IStackItem } from 'Controls/_popupTemplate/Stack/StackController';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import getDirection from 'Controls/_popupTemplate/Util/getDirection';
import { getConfig } from 'Application/Env';

// Minimum popup indentation from the right edge
const MINIMAL_PANEL_DISTANCE = 48;

export class StackStrategy {
    /**
     * Returns popup position
     * @function Controls/_popupTemplate/Stack/Opener/StackController#getPosition
     * @param tCoords Coordinates of the container relative to which the panel is displayed
     * @param item Popup configuration
     * @param isAboveMaximizePopup {Boolean}
     */
    getPosition(
        tCoords,
        item: IStackItem,
        isAboveMaximizePopup: boolean = false
    ): IPopupPosition {
        const maxPanelWidth = this.getMaxPanelWidth(
            tCoords,
            item.popupOptions.hasDefaultStackTemplate,
            item.popupOptions.fullscreen
        );
        const width = item.popupOptions.fullscreen
            ? maxPanelWidth
            : this._getPanelWidth(item, tCoords, maxPanelWidth);
        let direction =
            item.popupOptions.stackPosition || Controller.getStackPosition();
        direction = getDirection(direction);
        let horizontalPosition = this._getHorizontalPosition(
            tCoords,
            isAboveMaximizePopup,
            direction,
            item.popupOptions.fullscreen
        );

        if (detection.isMobileIOS && horizontalPosition) {
            horizontalPosition = Math.max(
                horizontalPosition,
                getRightPanelWidth()
            );
        }

        const position: IPopupPosition = {
            width,
            [direction]: horizontalPosition,
            top: tCoords.top,
        };

        // Увеличиваю отзывчивость интерфейса за счет уменьшения кол-во перерисовок при ресайзе.
        // Если restrictiveContainer нет, то окно растягивается на всю высоту окна => не нужно менять height.
        if (item.calculatedRestrictiveContainer) {
            position.height = tCoords.height;
        } else {
            position.bottom = 0;
        }

        // on mobile device fixed container proxying scroll on bottom container
        if (!detection.isMobilePlatform) {
            position.position = 'fixed';
        }

        if (item.popupOptions.minWidth) {
            // todo: Delete minimizedWidth https://online.sbis.ru/opendoc.html?guid=8f7f8cea-b39d-4046-b5b2-f8dddae143ad
            position.minWidth =
                item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
            position.minWidth = Math.min(
                position.minWidth,
                this.getMaxPanelWidth(
                    tCoords,
                    item.popupOptions.hasDefaultStackTemplate,
                    item.popupOptions.fullscreen
                )
            );
        }
        position.maxWidth = this._calculateMaxWidth(
            item.popupOptions,
            tCoords,
            item
        );
        if (position.width && position.maxWidth < position.width) {
            position.width = position.maxWidth;
        }

        this._fixMinWidthForZoom(position, tCoords, item);
        return position;
    }

    isMaximizedPanel(item: IStackItem): boolean {
        const minWidth = item.popupOptions.minWidth;
        const maxWidth = item.popupOptions.maxWidth;
        const hasPropStorageId = !!item.popupOptions.propStorageId;
        return (
            (minWidth &&
                maxWidth &&
                minWidth !== maxWidth &&
                hasPropStorageId) ||
            // deprecated definition
            (!!item.popupOptions.minimizedWidth && !hasPropStorageId)
        );
    }

    /**
     * Returns the maximum possible width of popup
     * @function Controls/_popupTemplate/Stack/Opener/StackController#getMaxPanelWidth
     */
    getMaxPanelWidth(
        stackParentCoords: IPopupPosition,
        hasDefaultStackTemplate: boolean,
        fullscreen?: boolean
    ): number {
        const right = Math.max(stackParentCoords.right, getRightPanelWidth());
        // window.innerWidth брать нельзя, при масштабировании на ios значение меняется, что влияет на ширину панелей.
        if (!hasDefaultStackTemplate) {
            return document.body.clientWidth - right;
        }
        const maxWidth =
            document.body.clientWidth - MINIMAL_PANEL_DISTANCE - right;
        if (getConfig('isAdaptive')) {
            return maxWidth + MINIMAL_PANEL_DISTANCE;
        }
        if (fullscreen) {
            return document.body.clientWidth - getRightPanelWidth();
        }

        return maxWidth;
    }

    /**
     * В сучае когда для панели заданы статические значения размеров их нужно ограничить размером экрана,
     * чтобы у нас не оказалась панель шириной больше, чем размер доступной области.
     * Это происходит, т.к. размеры задают с учетом того, что экран не может быть меньше 1024,
     * а при зуме размеры пикселей увеличиваются и body занимает меньше пикселей, чем есть на экране
     * Пример:
     * Задают у панели ширину 950 с расчетом на то, что минимальная ширина экрана 1024
     * С учетом зума 1,5 ширина доступной области будет 1024 / 1,5 ~ 680, тогда панелль будет шире экрана.
     * @param position
     * @param parentCoords
     * @param item
     * @private
     */
    private _fixMinWidthForZoom(
        position: IPopupPosition,
        parentCoords: IPopupPosition,
        item: IStackItem
    ): void {
        const zoom = DimensionsMeasurer.getZoomValue(document?.body);
        const maxPanelWidth = this.getMaxPanelWidth(
            parentCoords,
            item.popupOptions.hasDefaultStackTemplate
        );
        if (
            zoom &&
            zoom !== 1 &&
            position.minWidth &&
            position.minWidth > maxPanelWidth
        ) {
            position.minWidth = maxPanelWidth;
            if (position.width) {
                position.width = maxPanelWidth;
            }
        }
    }

    private _getHorizontalPosition(
        tCoords,
        isAboveMaximizePopup: boolean,
        position: string,
        fullscreen: boolean
    ): number {
        if (isAboveMaximizePopup || fullscreen) {
            return position === 'right' ? getRightPanelWidth() : 0;
        }
        return tCoords[position];
    }

    private _getPanelWidth(
        item: IStackItem,
        tCoords,
        maxPanelWidth: number
    ): number {
        let panelWidth;
        let minWidth = parseInt(item.popupOptions.minWidth, 10);
        const rightPanelWidth = getRightPanelWidth();
        const minRightSpace = tCoords.right - (minWidth - maxPanelWidth);
        const rightCoord = Math.max(minRightSpace, rightPanelWidth);
        const maxWidth = parseInt(item.popupOptions.maxWidth, 10);

        if (this.isMaximizedPanel(item) && !item.popupOptions.propStorageId) {
            if (!this._isMaximizedState(item)) {
                panelWidth = item.popupOptions.minimizedWidth;
            } else {
                panelWidth = Math.min(maxWidth, maxPanelWidth);
                if (minWidth) {
                    panelWidth = Math.max(panelWidth, minWidth); // more then minWidth
                }
            }
            if (panelWidth > maxPanelWidth) {
                tCoords.right = rightCoord;
            }
            return panelWidth;
        }
        // If the minimum width does not fit into the screen - positioned on the right edge of the window
        if (minWidth > maxPanelWidth) {
            if (this.isMaximizedPanel(item)) {
                minWidth = item.popupOptions.minimizedWidth;
            }
            if (
                minWidth > maxPanelWidth &&
                !(
                    typeof item.popupOptions.hasDefaultStackTemplate ===
                        'boolean' && !item.popupOptions.hasDefaultStackTemplate
                )
            ) {
                tCoords.right = rightCoord;
            }
            panelWidth = minWidth;
        }
        if (item.popupOptions.width) {
            // todo: https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
            panelWidth = Math.min(item.popupOptions.width, maxPanelWidth); // less then maxWidth
            panelWidth = Math.max(
                panelWidth,
                item.popupOptions.minimizedWidth || minWidth || 0
            ); // more then minWidth
        }

        // Если родитель не уместился по ширине и спозиционировался по правому краю экрана -
        // все дети тоже должны быть по правому краю, не зависимо от своих размеров
        const parentPosition = this._getParentPosition(item);
        if (parentPosition?.right === rightCoord) {
            tCoords.right = rightCoord;
        }
        if (getConfig('isAdaptive')) {
            panelWidth = Math.min(panelWidth, document.body.clientWidth);
        }
        return panelWidth;
    }

    private _getParentPosition(item: IStackItem): IPopupPosition {
        const parentItem = Controller.find(item.parentId);
        return parentItem?.position;
    }

    private _isMaximizedState(item: IStackItem): boolean {
        return !!item.popupOptions.maximized;
    }
    private _calculateMaxWidth(popupOptions, tCoords): number {
        const maxPanelWidth = this.getMaxPanelWidth(
            tCoords,
            popupOptions.hasDefaultStackTemplate,
            popupOptions.fullscreen
        );
        let maxWidth = maxPanelWidth;

        // maxWidth limit on the allowable width
        if (popupOptions.maxWidth && !popupOptions.fullscreen) {
            maxWidth = Math.min(popupOptions.maxWidth, maxPanelWidth);
        }

        // Not less than minWidth
        if (popupOptions.minWidth) {
            maxWidth = Math.max(popupOptions.minWidth, maxWidth);
        }
        if (getConfig('isAdaptive')) {
            const adaptiveMaxWidth =
                document.body.clientWidth - getRightPanelWidth();
            if (adaptiveMaxWidth < maxWidth) {
                maxWidth = adaptiveMaxWidth;
            }
        }
        return maxWidth;
    }
}

export default new StackStrategy();
