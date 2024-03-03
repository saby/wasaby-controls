/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import { IConfirmationFooterOptions } from 'Controls/_popup/interface/IConfirmationFooter';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { IPopupWidthOptions } from 'Controls/_popup/interface/IPopupWidth';
import { ReactElement } from 'react';

export interface IConfirmationOptions extends
    IConfirmationFooterOptions,
    IControlOptions,
    IPopupWidthOptions {
        closeButtonVisible?: boolean;
        markerStyle?: IConfirmationStyle;
        style?: IConfirmationStyle;
        size?: string;
        message?: string;
        messageContentTemplate?: TemplateFunction | ReactElement;
        messageOptions?: object;
        details?: string;
        detailsContentTemplate?: TemplateFunction | ReactElement;
        detailsOptions?: object;
        closeHandler?: Function;
        zIndex?: number; // todo: Compatible
}

type IConfirmationStyle =
    | 'default'
    | 'success'
    | 'danger'
    | 'primary'
    | 'info'
    | 'warning'
    | 'secondary';

/**
 * Интерфейс для опций окон подтверждения.
 * @public
 * @extends Controls/_popup/interface/IConfirmationFooter
 * @implements Controls/_popup/interface/IPopupWidth
 */
export interface IConfirmationOpener {
    readonly '[Controls/_popup/interface/IConfirmationOpener]': boolean;
    open(templateOptions: IConfirmationOptions): Promise<boolean | undefined>;
}

/**
 * @name Controls/_popup/interface/IConfirmationOpener#closeButtonVisible
 * @cfg {Boolean} Определяет отображение кнопки закрытия.
 * @default false
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#size
 * @cfg {String} Размер диалога подтверждения. Размер меняется автоматически, если длина основного сообщения превышает
 * 100 символов или длина дополнительного текста превышает 160 символов.
 * @variant m (ширина 350px)
 * @variant l (ширина 440px)
 * @default m
 * @deprecated Вспользуйтесь опцией width
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#message
 * @cfg {String} Основной текст диалога подтверждения.
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#messageContentTemplate
 * @cfg {ReactElement|TemplateFunction} Шаблон основного текста диалога подтверждения
 * @demo Controls-demo/Popup/Confirmation/MessageContentTemplate/Index
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#messageOptions
 * @cfg {Object} Опции, передаваемые в шаблон messageContentTemplate
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#details
 * @cfg {String} Дополнительный текст диалога подтверждения
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#detailsContentTemplate
 * @cfg {ReactElement|TemplateFunction} Шаблон дополнительного текста диалога подтверждения
 * @demo Controls-demo/Popup/Confirmation/DetailsContentTemplate/Index
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#detailsOptions
 * @cfg {Object} Опции, передаваемые в шаблон detailsContentTemplate
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#markerStyle
 * @cfg {string} Стиль маркера.
 * @variant default
 * @variant success
 * @variant danger
 * @variant secondary
 * @variant warning
 * @variant info
 * @variant none
 * @default default
 */

/**
 * Метод открытия окна подтверждения.
 * @name Controls/_popup/interface/IConfirmationOpener#open
 * @function
 * @param {Controls/popup:IConfirmationOpener} IConfirmationOptions Конфигурация диалога подтверждения.
 * @returns {Promise} Результат будет возвращен после того, как пользователь закроет всплывающее окно.
 * @remark
 * 1. Если требуется открыть окно, без создания popup:Confirmation в верстке, следует использовать статический метод {@link openPopup}
 * 2. Если вы хотите использовать собственный шаблон в диалоге подтверждения используйте шаблон, смотрите
 * {@link /doc/platform/developmentapl/interface-development/controls/openers/confirmation/#config-template инструкцию}
 * @see openPopup
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.popup:Confirmation name="confirmationOpener">
 * </Controls.popup:Confirmation>
 *
 * <Controls.buttons:Button caption="open confirmation" on:click="_open()"/>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 *    class MyControl extends Control<IControlOptions>{
 *       ...
 *
 *        _open() {
 *           var config= {
 *              message: 'Save changes?'
 *              type: 'yesnocancel'
 *           }
 *           this._children.confirmationOpener.open(config).addCallback(function(result) {
 *              if (result === true) {
 *                  console.log('Пользователь выбрал "Да"');
 *              } else if (result === false) {
 *                  console.log('Пользователь выбрал "Нет"');
 *              } else {
 *                  console.log('Пользователь выбрал "Отмена"');
 *              }
 *           });
 *        }
 *     };
 * </pre>
 */

/*
 * Open confirmation popup.
 * @name Controls/_popup/interface/IConfirmationOpener#open
 * @function
 * @param {PopupOptions} templateOptions Confirmation options.
 * @returns {Promise} The deferral will end with the result when the user closes the popup.
 * @remark
 * If you want use custom layout in the dialog you need to open popup via {@link dialog opener} using the basic template {@link ConfirmationTemplate}.
 */

/**
 * Статический метод для открытия окна подтверждения. При использовании метода не требуется создавать popup:Confirmation в верстке.
 * {@link /doc/platform/developmentapl/interface-development/controls/openers/confirmation/#open-popup Подробнее}.
 * @name Controls/_popup/interface/IConfirmationOpener#openPopup
 * @function
 * @param {Controls/popup:IConfirmationOpener} IConfirmationOptions Конфигурация окна подтверждения
 * @return {Promise<unknown>} Результат будет возвращен после того, как пользователь закроет всплывающее окно.
 * @static
 * @see open
 * @example
 * <pre class="brush: js">
 *    // TypeScript
 *    import {Confirmation} from 'Controls/popup';
 *    ...
 *    openConfirmation() {
 *        Confirmation.openPopup({
 *          message: 'Choose yes or no'
 *        }).then(function(result) {
 *          if (result === true) {
 *              console.log('Пользователь выбрал "Да"');
 *          } else if (result === false) {
 *              console.log('Пользователь выбрал "Нет"');
 *          } else {
 *              console.log('Пользователь выбрал "Отмена"');
 *          }
 *        });
 *    }
 * </pre>
 */
