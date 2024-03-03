/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { TemplateFunction } from 'UI/Base';

type TAdaptiveViewMode = 'default' | 'sliding' | 'fullscreen';
interface IAdaptiveOptions {
    viewMode: TAdaptiveViewMode;
}

export interface IPopupTemplateBaseOptions {
    adaptiveOptions?: IAdaptiveOptions;
    headerContentTemplate?: TemplateFunction;
    bodyContentTemplate?: TemplateFunction;
    footerContentTemplate?: TemplateFunction;
    headingCaption?: string;
    headingFontSize?: string;
    headingFontColorStyle?: string;
    headingFontWeight?: string;
    closeButtonVisible?: boolean;
    onClose?: Function;
    imageContentTemplate?: string | TemplateFunction;
    toolbarContentTemplate?: string | TemplateFunction;
    applyButtonVisible?: boolean;
    applyButtonCallback?: Function;
    counterValue?: number;
}

/**
 * Базовый интерфейс для стандартных шаблонов окон.
 *
 * @interface Controls/_popupTemplate/interface/IPopupTemplateBase
 * @public
 */
export default interface IPopupTemplateBase {
    readonly '[Controls/_popupTemplate/interface/IPopupTemplateBase]': boolean;
}
/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headerContentTemplate
 * @cfg {function|String} Контент, располагающийся между заголовком и крестиком закрытия.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#footerContentTemplate
 * @cfg {function|String} Контент, располагающийся в нижней части шаблона.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headingCaption
 * @cfg {String} Текст заголовка.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headingFontColorStyle
 * @cfg {String} Стиль отображения заголовка. Подробнее: {@link Controls/_interface/IFontColorStyle#fontColorStyle}
 * @default secondary
 * @see Controls/heading:Title#fontColorStyle
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headingFontSize
 * @cfg {String} Размер заголовка.
 * @default 3xl
 * @see Controls/heading:Title#fontSize
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headingFontWeight
 * @cfg {Controls/interface/TFontWeight.typedef} Насыщенность шрифта.
 * @default default
 * @see Controls/heading:Title#fontWeight
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#closeButtonVisible
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка закрытия
 * @default true
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#applyButtonVisible
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка подтверждения.
 * @demo Controls-demo/PopupTemplate/Dialog/Header/Index
 * @default false
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#applyButtonCallback
 * @cfg {Function} Функция-обработчик нажатия на кнопку подтверждения.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#counterValue
 * @cfg {Number} Числовое значение счетчика. При указании данной опции будет отображаться счетчик.
 * @demo Controls-demo/PopupTemplate/Stack/Header/Index
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#imageContentTemplate
 * @cfg {function|String} Контент с изображением, располагающийся между кнопкой закрытия и заголовком.
 * @demo Controls-demo/PopupTemplate/Dialog/Header/Index
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplateBase#headingFontWeight
 * @cfg {TFontWeight} Насыщенность шрифта заголовка.
 * @default default
 */
