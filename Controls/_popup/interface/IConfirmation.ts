/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import { IConfirmationFooterOptions } from 'Controls/_popup/interface/IConfirmationFooter';
import { IControlOptions } from 'UI/Base';

export interface IConfirmationOptions extends IConfirmationFooterOptions, IControlOptions {
    closeButtonVisible?: boolean;
    markerStyle?: IConfirmationStyle;
    style?: IConfirmationStyle;
    width?: String | Number;
    size?: string;
    message?: string;
    details?: string;
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
 */
export interface IConfirmationOpener {
    readonly '[Controls/_popup/interface/IConfirmationOpener]': boolean;
    open(templateOptions: IConfirmationOptions): Promise<boolean | undefined>;
}

/**
 * @typedef {BaseSizes} Controls/_popup/interface/IConfirmationOpener/BaseSizes
 * @description Стандартная линейка размеров для ширин окна.
 * Подробнее о значениях переменных для темы {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-22.5100/Controls-default-theme/variables/_popupTemplate.less#L112 online'а}
 * @property {String} a
 * @property {String} b
 * @property {String} c
 * @property {String} d
 * @property {String} e
 * @property {String} f
 * @property {String} g
 * @property {String} h
 * @property {String} i
 * @property {String} j
 * @property {String} k
 * @property {String} l
 * @property {String} m
 */

/**
 * @name Controls/_popup/interface/IConfirmationOpener#width
 * @cfg {Controls/_popup/interface/IConfirmationOpener/BaseSizes.typedef|Number} Ширина диалога подтверждения. Значение
 * может быть указано как в пикселях, так и с помощью стандартной линейки размеров.
 */

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
 * @name Controls/_popup/interface/IConfirmationOpener#details
 * @cfg {String | TemplateFunction} Дополнительный текст диалога подтверждения
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
