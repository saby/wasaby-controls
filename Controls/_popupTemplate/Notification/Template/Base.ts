/**
 * @kaizen_zone f4aee25a-8072-469d-b51f-fa0b1c29931d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Notification/Template/Base/Base';
import { INotificationBase } from 'Controls/_popupTemplate/interface/INotification';
import 'css!Controls/popupTemplate';
import { SyntheticEvent } from 'UI/Events';
import { detection } from 'Env/Env';
import { IDragObject } from 'Controls/dragnDrop';
import { Logger } from 'UI/Utils';
import { withAdaptiveMode } from 'UI/Adaptive';

export interface INotificationBaseOptions extends INotificationBase, IControlOptions {
    bodyContentTemplate?: Control<IControlOptions, void> | TemplateFunction;
}

/**
 * Базовый шаблон {@link https://n.sbis.ru/article/d09d217d-f080-4a81-9790-a4c279d8fa8e#toc_c6ddeb64-6973-49a1-989d-519cae7b6909 окна уведомления}.
 *
 * @remark
 * Полезные ссылки:
 * <ul>
 *     <li>{@link https://n.sbis.ru/article/d09d217d-f080-4a81-9790-a4c279d8fa8e руководство разработчика}</li>
 *     <li>{@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}</li>
 * </ul>
 *
 * @class Controls/_popupTemplate/Notification/Base
 * @extends UI/Base:Control
 * @mixes Controls/popupTemplate:INotification
 *
 * @public
 * @demo Controls-demo/PopupTemplate/Notification/Base/Index
 */

class Notification extends Control<INotificationBaseOptions> {
    protected _template: TemplateFunction = template;
    protected _backgroundStyle: String;
    private _wasDragged: boolean = false;

    protected _isAdaptive: boolean;
    protected _isOldChrome: boolean;

    protected _beforeMount(options: INotificationBaseOptions): void {
        // В десктоп приложениях используют старых хром, в котором еще недоступен color-mix
        const oldChromeVersion = 110;
        this._isOldChrome = detection.chrome && detection.chromeVersion <= oldChromeVersion;
        this._backgroundStyle = Notification._prepareBackgroundStyle(options);
        if (options.borderStyle !== undefined) {
            Logger.warn(
                `${this._moduleName}: Используется устаревшая опция borderStyle,` +
                    ' нужно использовать backgroundStyle',
                this
            );
        }
        this._isAdaptive = options.adaptiveMode?.device.isPhone();
    }

    protected _beforeUpdate(options: INotificationBaseOptions): void {
        this._backgroundStyle = Notification._prepareBackgroundStyle(options);
    }

    protected _closeClick(ev: Event): void {
        // Клик по крестику закрытия не должен всплывать выше и обрабатываться событием click на контейнере
        ev.stopPropagation();
        this._notify('close', []);
    }

    protected _touchMoveHandler(event: Event): void {
        event.preventDefault();
    }

    protected _onDragEnd(): void {
        this._notify('popupDragEnd', [], { bubbling: true });
    }

    protected _onDragMove(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        this._wasDragged = true;
        this._notify('popupDragStart', [dragObject.offset], { bubbling: true });
    }

    protected _onClick(event: Event): void {
        if (this._wasDragged) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    protected _onMouseDown(event: SyntheticEvent<MouseEvent>): void {
        this._wasDragged = false;
        if (this._needStartDrag(event)) {
            this._children.dragNDrop.startDragNDrop(null, event);
        }
    }

    private _needStartDrag(event: SyntheticEvent<MouseEvent>): boolean {
        const { target } = event;
        return (
            !event.nativeEvent.processed &&
            !(target as HTMLElement).closest('.no-draggable') &&
            !(target as HTMLElement).closest('.controls-CloseButton__close') &&
            !(target as HTMLElement).closest('.controls-BaseButton')
        );
    }

    protected _getShadowClass(): string {
        if (this._backgroundStyle !== 'none') {
            return 'controls-Notification__shadow';
        }
    }

    private static _prepareBackgroundStyle(popupOptions: INotificationBaseOptions): String {
        switch (popupOptions.style || popupOptions.borderStyle || popupOptions.backgroundStyle) {
            case 'warning':
                return 'warning';
            case 'success':
                return 'success';
            case 'danger':
                return 'danger';
            case 'none':
                return 'none';
            default:
                return 'secondary';
        }
    }

    static getDefaultOptions(): INotificationBaseOptions {
        return {
            backgroundStyle: 'secondary',
            closeButtonVisible: true,
            closeButtonViewMode: 'linkButton',
        };
    }
}

/**
 * @name Controls/_popupTemplate/Notification/Base#bodyContentTemplate
 * @cfg {Function|String} Определяет основной контент окна уведомления.
 */

export { Notification as NotificationWithoutWrapper };
export default withAdaptiveMode(Notification);
