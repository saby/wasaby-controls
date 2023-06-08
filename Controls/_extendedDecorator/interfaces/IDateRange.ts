import { IControlProps } from 'Controls/interface';
import { TimeIntervalDisplayMode, ITimeIntervalUnits } from 'Types/formatter';

/**
 * Интерфейс для опций контрола {@link Controls/extendedDecorator:DateRange}.
 * @interface Controls/_extendedDecorator/IDateRange
 * @public
 */
export interface IDateRange extends IControlProps {
    /**
     * @name Controls/_extendedDecorator/IDateRange#startValue
     * @cfg {Date} Дата начала временного интервала.
     */
    startValue: Date;

    /**
     * @name Controls/_extendedDecorator/IDateRange#endValue
     * @cfg {Date} Дата конца временного интервала. Если не передан, считаем концом нынешнюю дату.
     */
    endValue?: Date;

    /**
     * @name Controls/_extendedDecorator/IDateRange#displayMode
     * @cfg {Types/formatter.TimeIntervalDisplayMode} Режимы отображения временного интервала.
     * @default Numeric
     */
    displayMode?: TimeIntervalDisplayMode;

    /**
     * @name Controls/_extendedDecorator/IDateRange#displayedUnitsNumber
     * @cfg {Number} Количество отображаемых временных единиц в интервале.
     * @remark По умолчанию отображаются все не нулевые.
     */
    displayedUnitsNumber?: number;

    /**
     * @name Controls/_extendedDecorator/IDateRange#displayedUnits
     * @cfg {Types/formatter.ITimeIntervalUnits} Список отображаемых временных единиц.
     */
    displayedUnits?: ITimeIntervalUnits;

    /**
     * @name Controls/_extendedDecorator/IDateRange#showNullUnits
     * @cfg {Boolean} Показывать в интервале нулевые значения после не нулевых. 1 день 1 мин - 1 день 0 часов 1 мин 0 сек
     * @default false
     */
    showNullUnits?: boolean;

    /**
     * @name Controls/_extendedDecorator/IDateRange#short
     * @cfg {Boolean} Использовать сокращённые обозначения временных единиц.
     * @default true
     */
    short?: boolean;
}
