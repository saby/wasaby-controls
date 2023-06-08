/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { TemplateFunction, IControlOptions } from 'UI/Base';
import { ISlidingPanelOptions } from 'Controls/popup';
import { IPopupTemplateBase, IPopupTemplateBaseOptions } from 'Controls/popupTemplate';

export interface ISlidingPanelTemplateOptions extends IPopupTemplateBaseOptions, IControlOptions {
    controlButtonVisibility: boolean;
    bodyContentTemplate?: string | TemplateFunction;
    actionContentTemplate?: string | TemplateFunction;
    slidingPanelOptions: ISlidingPanelOptions;
    closeButtonVisible?: boolean;
    backgroundStyle?: string;
    headerBackgroundStyle?: string;
}

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/interface/ISlidingPanelTemplate
 * @public
 */
export interface ISlidingPanelTemplate extends IPopupTemplateBase {
    readonly '[Controls/_popupSliding/interface/ISlidingPanelTemplate]'?: boolean;
}

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#controlButtonVisibility
 * @cfg {boolean} Определяет показ контроллера для разворота шторки.
 * @default true
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#bodyContentTemplate
 * @cfg {string|TemplateFunction} Пользовательский контент шторки.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#actionContentTemplate
 * @cfg {string|TemplateFunction} Шаблон, который будет отображаться в нижнем правом углу окна.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#headerContentTemplate
 * @demo Controls-demo/Popup/SlidingPanel/HeaderContentTemplate/Index
 * @cfg {string|TemplateFunction} Контент шапки шторки.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#toolbarContentTemplate
 * @demo Controls-demo/Popup/SlidingPanel/HeaderContentTemplate/Index
 * @cfg {string|TemplateFunction} Шаблон тулбара с набором действий для шторки.
 * На десктопе работает только для режима выезжающей панели.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#closeButtonVisible
 * @cfg {Boolean} Определяет отображение кнопки закрытия.
 * @default false
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#slidingPanelOptions
 * @cfg {Controls/popup:ISlidingPanel | object} Содержит сведения о позиционировании шторки.
 * @remark
 * При открытии шторки с помощью {@link Controls/popup:SlidingPanelOpener}, в шаблон передаётся значение для опции slidingPanelOptions.
 * Необходимо использовать его для конфигурации Controls/popupSliding:Template, как показано в следующем примере.
 * <pre>
 * <Controls.popupSliding:Template slidingPanelOptions="{{_options.slidingPanelOptions}}" />
 * </pre>
 * Конфигурировать значение в ручную не нужно, необходимо только проксировать значение приходящее в шаблон.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#headerBackgroundStyle
 * @cfg {String} Цвет фона шапки шторки.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default undefined
 * @demo Controls-demo/PopupTemplate/SlidingPanel/backgroundStyle/Index
 * @see backgroundStyle
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#backgroundStyle
 * @cfg {String} Цвет фона шторки.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant success
 * @default default
 * @demo Controls-demo/PopupTemplate/SlidingPanel/backgroundStyle/Index
 * @see headerBackgroundStyle
 */
