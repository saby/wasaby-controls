/**
 * @kaizen_zone c7f0da9e-2888-4829-ad87-bd0d8c22d857
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Notification/Template/Base/Base';
import { INotificationBase } from 'Controls/_popupTemplate/interface/INotification';
import 'css!Controls/popupTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDragObject } from 'Controls/dragnDrop';
import { Logger } from 'UI/Utils';

export interface INotificationBaseOptions extends INotificationBase, IControlOptions {
    bodyContentTemplate?: Control<IControlOptions, void> | TemplateFunction;
}

/**
 * Базовый шаблон {@link /doc/platform/developmentapl/interface-development/controls/openers/notification/#template окна уведомления}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/notification/#template руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
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

    protected _beforeMount(options: INotificationBaseOptions): void {
        this._backgroundStyle = Notification._prepareBackgroundStyle(options);
        if (options.borderStyle !== undefined) {
            Logger.warn(
                `${this._moduleName}: Используется устаревшая опция borderStyle,` +
                    ' нужно использовать backgroundStyle',
                this
            );
        }
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
        const {target} = event;
        return !event.nativeEvent.processed
            && !(target as HTMLElement).closest('.controls-CloseButton__close');
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
export default Notification;
