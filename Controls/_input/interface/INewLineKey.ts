/**
 * @kaizen_zone 2a31278f-f868-4f4f-9ef4-3e21a7f9f586
 */
export interface INewLineKeyOptions {
    newLineKey: 'enter' | 'ctrlEnter';
}

/**
 * Интерфейс контролов, с вводом многострочного текста и возможностью настроить комбинацию клавиш для перевода каретки на новую строку.
 * @public
 */
export interface INewLineKey {
    readonly '[Controls/_input/interface/INewLineKey]': boolean;
}

/**
 * @name Controls/_input/interface/INewLineKey#newLineKey
 * @cfg {Enum} Комбинация клавиш для перевода каретки на новую строку.
 * @variant enter Пользователь нажимает клавишу "Enter".
 * @variant ctrlEnter Пользователь нажимает комбинацию клавиш "Ctrl + Enter".
 * @default enter
 */
