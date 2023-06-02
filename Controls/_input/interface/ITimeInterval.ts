/**
 * @kaizen_zone 69682cc6-ee87-46d1-a4a1-782347094234
 */
import { TimeInterval } from 'Types/entity';

/**
 * Интерфейс для поля ввода временного интервала с маской.
 * @public
 */
export interface ITimeInterval {
    readonly '[Controls/_input/interface/ITimeInterval]': boolean;
}

export interface ITimeIntervalOptions {
    /**
     * @name Controls/_input/interface/ITimeInterval#mask
     * @cfg {String} Формат ввода временного интервала.
     * @variant 'MM:SS'
     * @variant 'HH:MM'
     * @variant 'HHH:MM'
     * @variant 'HHHH:MM'
     * @variant 'HH:MM:SS'
     * @variant 'HHH:MM:SS'
     * @variant 'HHHH:MM:SS'
     * @remark
     * Разрешенные символы маски:
     *
     * * H - часы.
     * * M - минуты.
     * * S - секунды.
     * * ":" - разделитель.
     *
     * Если какая-то часть TimeInterval отсутствует, она будет автоматически дописана.
     * Например, для маски 'HH:mm:ss' - введенное значение '1 : 1: 1' будет преобразовано к значению '01:01:01'.
     */

    mask:
        | 'MM:SS'
        | 'HH:MM'
        | 'HHH:MM'
        | 'HHHH:MM'
        | 'HH:MM:SS'
        | 'HHH:MM:SS'
        | 'HHHH:MM:SS';

    /**
     * @name Controls/_input/interface/ITimeInterval#value
     * @cfg {Types/entity:applied.TimeInterval} Значение поля.
     * @demo Controls-demo/Input/TimeInterval/Base/Index
     */
    value: TimeInterval;
}
