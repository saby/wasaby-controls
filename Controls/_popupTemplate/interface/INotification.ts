/**
 * @kaizen_zone c7f0da9e-2888-4829-ad87-bd0d8c22d857
 */
import { IControlOptions } from 'UI/Base';

type TBackgroundStyle = 'secondary' | 'success' | 'danger' | 'warning';

export interface INotificationBase {
    closeButtonViewMode?: string;
    closeButtonVisible?: Boolean;
    backgroundStyle?: TBackgroundStyle;
}

export interface INotificationOptions
    extends IControlOptions,
        INotificationBase {
    icon?: String;
    text?: String;
}

/**
 * Интерфейс для окна уведомления.
 *
 * @interface Controls/_popupTemplate/interface/INotification
 * @public
 */
export interface INotification {
    readonly '[Controls/_popupTemplate/Notification/interface/INotification]': boolean;
}

/**
 * @name Controls/_popupTemplate/interface/INotification#backgroundStyle
 * @cfg {String} Устанавливает стиль отображения окна уведомления.
 * @variant secondary
 * @variant success
 * @variant danger
 * @variant warning
 * @default secondary
 */

/**
 * @name Controls/_popupTemplate/interface/INotification#closeButtonVisible
 * @cfg {Boolean} Определяет видимость кнопки, закрывающей окно.
 * @default true
 */

/**
 * @typedef TViewMode
 * @variant linkButton Отображение кнопки в виде ссылки.
 * @variant external Отображение полупрозрачной кнопки закрытия.
 */

/**
 * @name Controls/_popupTemplate/interface/INotification#closeButtonViewMode
 * @cfg {TViewMode} Вид отображения кнопки.
 * @default linkButton
 */
