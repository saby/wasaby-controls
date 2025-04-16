/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
export interface ITimeMaskOptions {
    mask: 'HH:II:SS.UUU' | 'HH:II:SS' | 'HH:II';
}

/**
 * Интерфейс для поля ввода времени с маской.
 * @public
 */
export interface ITimeMask {
    readonly '[Controls/_input/interface/ITimeMask]': boolean;
}

/**
 * @name Controls/_input/interface/ITimeMask#mask
 * @cfg {String} Формат ввода даты.
 * @remark
 * Необходимо выбрать одну из перечисленных масок. Разрешенные символы маски:
 * * H — час.
 * * I — минута.
 * * S — секунда.
 * * U — миллисекунда.
 * * ".", "-", ":", "/" — разделитель.
 * @variant 'HH:II:SS.UUU'
 * @variant 'HH:II:SS'
 * @variant 'HH:II'
 */
