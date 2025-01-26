/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */

/**
 * @interface Controls/_popup/interface/IConfirmationFooter/IConfirmationFooterOptions
 * @private
 */

export type ConfirmationTypes = 'ok' | 'yesno' | 'yesnocancel';

export interface IConfirmationFooterOptions {
    type?: ConfirmationTypes;
    yesCaption?: string;
    noCaption?: string;
    cancelCaption?: string;
    primaryAction?: string;
    okCaption?: string;
    buttons?: IConfirmationButton[];
}

interface IConfirmationButton {
    caption: string;
    value: unknown;
    viewMode?: string;
    buttonStyle?: string;
    fontColorStyle?: string;
}

/**
 * Интерфейс для опций футера диалога подтверждения.
 * @interface Controls/_popup/interface/IConfirmationFooter
 * @public
 */
export interface IConfirmationFooter {
    readonly '[Controls/_popup/interface/IConfirmationFooter]': boolean;
}

/**
 * @typedef {ConfirmationTypes} Controls/_popup/interface/IConfirmationFooter/ConfirmationTypes
 * @property {String} ok (Результат: true)
 * @property {String} yesno (Результат: true/false)
 * @property {String} yesnocancel (Результат: true/false/undefined)
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#type
 * @cfg {Controls/_popup/interface/IConfirmationFooter/ConfirmationTypes.typedef} Тип диалогового окна. Определяет с каким результатом будет закрыто окно диалога.
 * @default yesno
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#yesCaption
 * @cfg {String} Текст кнопки подтверждения.
 * @default Да
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#noCaption
 * @cfg {String} Текст кнопки отрицания
 * @default Нет
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#cancelCaption
 * @cfg {String} Текст кнопки отмены
 * @default Отмена
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#primaryAction
 * @cfg {String} Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 * @variant yes
 * @variant no
 * @variant cancel
 * @default yes
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#okCaption
 * @cfg {String} Текст кнопки "принять"
 * @default ОК
 */

/**
 * @typedef {Boolean|undefined} Controls/_popup/interface/IConfirmationFooter/Result
 * @remark
 * true - Нажата кнопка "Да"
 * false - Нажата кнопка "Нет"
 * undefined - Нажата кнопка "ОК" или "Отмена"
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#result
 * @event Происходит при клике по кнопке футера.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события
 * @param {Controls/_popup/interface/IConfirmationFooter/Result.typedef} result Результат
 */

/**
 * @name Controls/_popup/interface/IConfirmationFooter#buttons
 * @cfg {Array.<Controls/_popup/interface/IConfirmationFooter/buttons.typedef>} Описывает набор кнопок с результатами,
 * позиционирующихся в нижней части окна подтверждения.
 * @example
 * <pre>
 * <Controls.popupTemplate:ConfirmationDialog
 *                         name="Confirm"
 *                         message="Сохранить изменения?"
 *                         buttons="{{_buttons}}"/>
 * </pre>
 * <pre>
 * this._buttons = [
 *      {
 *          caption: 'Да',
 *          buttonStyle: 'primary',
 *          value: true
 *      },
 *      {
 *          caption: 'Собрать без конвертацией',
 *          viewMode: 'link',
 *          fontColorStyle: 'unaccented',
 *          value: false
 *      }
 * ];
 * </pre>
 * @demo Controls-demo/PopupTemplate/Confirmation/Buttons/Index
 */

/**
 * @typedef {Array} Controls/_popup/interface/IConfirmationFooter/buttons
 * @property {String} [buttons.caption] Подпись к кнопке.
 * @property {Boolean|String} [buttons.value] Значение результата, которое вернет кнопка при нажатии.
 * @property {String} [buttons.viewMode] Режим отображения кнопки.
 * @property {String} [buttons.buttonStyle] Стиль отображения кнопки.
 * @property {String} [buttons.fontColorStyle] Определяет cтиль цвета текста контрола.
 */
