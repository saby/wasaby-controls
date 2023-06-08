/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { IPopupTemplateBaseOptions } from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
export interface IPopupTemplateOptions extends IPopupTemplateBaseOptions {
    closeButtonViewMode?: string;
}
/**
 * Интерфейс для стандартных шаблонов окон.
 *
 * @interface Controls/_popupTemplate/interface/IPopupTemplate
 * @public
 */
export default interface IPopupTemplate {
    readonly '[Controls/_popupTemplate/interface/IPopupTemplate]': boolean;
}
/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#closeButtonViewMode
 * @cfg {String} Стиль отображения кнопки закрытия
 * @variant toolButton Отображение как кнопки панели инструментов.
 * @variant linkButton Отображение кнопки в виде ссылки.
 * @variant functionalButton Отображение функциональной кнопки закрытия
 * @variant external Отображение полупрозрачной кнопки закрытия.
 * @variation externalWide Отображение полупрозрачной кнопки закрытия с большей шириной, чтобы перед иконкой закрытия разместить контент
 * @default linkButton
 * @demo Controls-demo/PopupTemplate/Dialog/closeButtonViewMode/Index
 */

/**
 * @typedef {Object} TPopupOffset
 * @property {Number} x Смещение по оси x.
 * @property {Number} y Смещение по оси y.
 */

/**
 * @event Controls/_popupTemplate/interface/IPopupTemplate#popupMovingSize Происходит при изменении размеров окна
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {TPopupOffset} offset Значение сдвига.
 * @param {string} position Направление движения.
 */
