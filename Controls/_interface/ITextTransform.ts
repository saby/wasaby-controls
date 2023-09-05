/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} TTextTransform
 * @variant none Без изменения регистра символов.
 * @variant uppercase Все символы текста становятся прописными (верхний регистр).
 */
export type TTextTransform = 'none' | 'uppercase';

export interface ITextTransformOptions {
    /**
     * @name Controls/_interface/ITextTransform#textTransform
     * @cfg {TTextTransform} Управляет преобразованием текста элемента в заглавные или прописные символы
     * @default none
     * @remark
     * Вместе с установкой преобразования текста, меняется так же расстояние между буквами.
     */
    textTransform?: TTextTransform;
}

/**
 * Интерфейс для контролов, которые поддерживают преобразование текста в заглавные или прописные символы
 * @public
 */
export default interface ITextTransform {
    readonly '[Controls/_interface/ITextTransform]': boolean;
}
