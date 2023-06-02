/**
 * @kaizen_zone c7f0da9e-2888-4829-ad87-bd0d8c22d857
 */
import { default as BaseController } from 'Controls/_popupTemplateStrategy/BaseController';
import {
    IDragOffset,
    IPopupItem,
    IPopupOptions,
    IPopupPosition,
} from 'Controls/popup';
import { List } from 'Types/collection';
import NotificationContent from 'Controls/_popupTemplateStrategy/Notification/Template/NotificationContent';
import NotificationStrategy from 'Controls/_popupTemplateStrategy/Notification/NotificationStrategy';
import {
    setSettings,
    getSettings,
} from 'Controls/Application/SettingsController';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { controller } from 'I18n/i18n';

interface INotificationItem extends IPopupItem {
    height: number;
    width: number;
    closeId: number;
    popupOptions: INotificationOptions;
    startPosition: IPopupPosition;
    container: HTMLElement;
}

interface INotificationOptions extends IPopupOptions {
    autoClose: boolean;
    maximize: boolean;
    isOutOfQueue: boolean;
}

/**
 * Notification Popup Controller
 * @class Controls/_popupTemplateStrategy/Notification/Opener/NotificationController
 *
 * @private
 * @extends Controls/_popupTemplateStrategy/BaseController
 */
class NotificationController extends BaseController {
    TYPE: string = 'Notification';
    _stack: List<INotificationItem> = new List();

    private _destroyPromiseResolvers: Function[] = [];

    private _historyCoords: {
        bottom: number;
        right: number;
    };
    private _direction: string = 'up';
    private _startPosition: {
        bottom: number;
        right: number;
    };

    private _filterItems(): void {
        const fixedItems = [];
        this._stack.forEach((item, index) => {
            if (item.popupOptions.isOutOfQueue) {
                fixedItems.unshift(item.id);
            }
        });
        fixedItems.forEach((id) => {
            const itemIndex = this._stack.getIndexByValue('id', id);
            this._stack.move(itemIndex, 0);
        });
    }

    elementCreated(
        item: INotificationItem,
        container: HTMLDivElement
    ): boolean {
        item.height = container.offsetHeight;
        item.width = container.offsetWidth;
        item.container = container;
        this._setNotificationContent(item);
        this._stack.add(item, 0);
        this._filterItems();
        this._calculateDirection(container);
        this._updatePositions();
        return true;
    }

    elementUpdated(
        item: INotificationItem,
        container: HTMLDivElement
    ): boolean {
        this._setNotificationContent(item);
        item.height = container.offsetHeight;
        this._updatePositions();
        return true;
    }

    elementDestroyed(item: INotificationItem): Promise<null> {
        this._stack.remove(item);
        this._updatePositions();
        super.elementDestroyed.call(item);
        return Promise.resolve();
    }

    elementAnimated(item: IPopupItem): boolean {
        const destroyResolve = this._destroyPromiseResolvers[item.id];
        if (destroyResolve) {
            this._updatePositions();
            destroyResolve();
            return true;
        }
    }

    getDefaultConfig(item: INotificationItem): void | Promise<void> {
        item.popupOptions.className =
            (item.popupOptions.className || '') +
            ' controls-Notification__animation_visible';
        super.getDefaultConfig.apply(this, arguments);
        this._setNotificationContent(item);
        if (!this._historyCoords) {
            return this._getPopupCoords().then((config: object) => {
                this._historyCoords = {
                    right: config.right || 0,
                    bottom: config.bottom || 0,
                };
            });
        }
    }

    popupDragEnd(item: INotificationItem, offset: number): void {
        this._savePopupCoords(item);
        this._startPosition = null;
    }

    popupDragStart(
        item: INotificationItem,
        container: HTMLElement,
        offset: IDragOffset
    ): void {
        if (!this._startPosition) {
            let bottom: number;
            let right: number;
            const restrictiveCoords = this._getRestrictiveCoords();
            if (restrictiveCoords && !(this._historyCoords.bottom || this._historyCoords.right)) {
                bottom = restrictiveCoords.bottom;
                right = restrictiveCoords.right;
            } else {
                bottom = this._historyCoords.bottom;
                right = this._historyCoords.right;
            }
            this._startPosition = {
                right,
                bottom,
            };
        }

        const horizontalOffset = -offset.x;
        const verticalOffset = -offset.y;

        const bottomPosition = this._startPosition.bottom + verticalOffset;
        let rightPosition;
        if (controller.currentLocaleConfig.directionality === 'rtl') {
            rightPosition = this._startPosition.right - horizontalOffset;
        } else {
            rightPosition = this._startPosition.right + horizontalOffset;
        }

        this._historyCoords = {
            bottom: bottomPosition,
            right: rightPosition,
        };
        this._updatePositions();
    }

    private _validatePosition(): void {
        let newBottomPosition = this._historyCoords.bottom;
        let newRightPosition = this._historyCoords.right;

        // Окна могут быть разной ширины, чтобы окна побольше не выходили за экран, будем делать расчеты по самой
        // большой ширине
        let maxWidth = 0;
        this._stack.each((listItem: INotificationItem) => {
            if (listItem.width > maxWidth) {
                maxWidth = listItem.width;
            }
        });

        const container = this._stack.at(0).container;
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(container);
        const restrictiveCoords = this._getRestrictiveCoords();
        if (restrictiveCoords) {
            newBottomPosition = newBottomPosition || restrictiveCoords.bottom;
            newRightPosition = newRightPosition ||restrictiveCoords.right;
            newBottomPosition = Math.max(restrictiveCoords.bottom, newBottomPosition);
            newBottomPosition = Math.min(restrictiveCoords.top - this._stack.at(0).height, newBottomPosition);

            newRightPosition = Math.max(restrictiveCoords.right, newRightPosition);
            newRightPosition = Math.min(restrictiveCoords.left - maxWidth, newRightPosition);
        } else {
            newRightPosition = Math.min(
                newRightPosition,
                windowDimensions.innerWidth - maxWidth
            );
            newBottomPosition = Math.min(
                newBottomPosition,
                windowDimensions.innerHeight - this._stack.at(0).height
            );

            newBottomPosition = Math.max(newBottomPosition, 0);
            newRightPosition = Math.max(newRightPosition, 0);
        }

        this._historyCoords = {
            bottom: newBottomPosition,
            right: newRightPosition,
        };
    }

    private _calculateDirection(container: HTMLElement): void {
        // Будем менять направление создания попапов только после открытия первого окна
        if (this._stack.getCount() === 1) {
            const windowDimensions =
                DimensionsMeasurer.getWindowDimensions(container);
            const windowHeight = windowDimensions.innerHeight;
            // Опеределяет, в какую сторорону по вертикале будут строится окна
            this._direction =
                windowHeight / 2 > this._historyCoords.bottom ? 'up' : 'down';
        }
    }

    private _savePopupCoords(item: INotificationItem): void {
        setSettings({
            notificationPopupCoords: {
                right: item.position.right,
                bottom: item.position.bottom,
            },
        });
        this._updatePositions();
    }

    private _getPopupCoords(): Promise<Object> {
        return new Promise((resolve) => {
            getSettings(['notificationPopupCoords']).then((storage: object) => {
                if (storage && storage.notificationPopupCoords) {
                    const bottom = storage.notificationPopupCoords.bottom;
                    const right = storage.notificationPopupCoords.right;
                    resolve({
                        bottom,
                        right,
                    });
                } else {
                    resolve({
                        bottom: 0,
                        right: 0,
                    });
                }
            });
        });
    }

    private _updatePositions(): void {
        if (this._stack.getCount()) {
            this._validatePosition();
            let bottom: number;
            let right: number;
            const restrictiveCoords = this._getRestrictiveCoords();
            if (restrictiveCoords && !(this._historyCoords.bottom || this._historyCoords.right)) {
                bottom = restrictiveCoords.bottom;
                right = restrictiveCoords.right;
            } else {
                bottom = this._historyCoords.bottom;
                right = this._historyCoords.right;
            }

            /*
             * In item.height is the height of the popup.
             * It takes into account the indentation between the notification popups,
             * specified in the template via css. This is done to support theming.
             */
            this._stack.each((item: INotificationItem) => {
                item.position = NotificationStrategy.getPosition(right, bottom);
                bottom += this._direction === 'up' ? item.height : -item.height;
            });
        }
    }

    private _getRestrictiveCoords(): {} {
        const getCoords = () => {
            const baseClassName = '.controls-Popup__notification__restrictiveContainer';
            return BaseController.getCoordsByContainer(baseClassName);
        };

        const coords = getCoords();
        if (!coords) {
            return;
        }
        const windowHeight = document.body.clientHeight;
        const windowWidth = document.body.clientWidth;

        const restrictiveContainerBottom = coords.bottom;
        const restrictiveContainerTop = coords.top;
        const restrictiveContainerLeft = coords.left;
        const restrictiveContainerRight = coords.right;

        return {
            top: windowHeight - restrictiveContainerTop,
            bottom: windowHeight - restrictiveContainerBottom,
            left: windowWidth - restrictiveContainerLeft,
            right: windowWidth - restrictiveContainerRight
        };
    }

    private _setNotificationContent(item: INotificationItem): void {
        item.popupOptions.content = NotificationContent;
    }
}
export default new NotificationController();
