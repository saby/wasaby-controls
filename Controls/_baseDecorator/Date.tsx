/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { createElement } from 'UICore/Jsx';
import { IWasabyAttributes } from 'UICore/Executor';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
} from 'Controls/interface';
import {
    date,
    DateFormattingStrategyType,
    IDateFormatConfig,
} from 'Types/formatter';
import Highlight from './Highlight';
import { getAttrs } from './resources/Util';
import 'css!Controls/baseDecorator';
import { IControlProps } from 'Controls/interface';

export interface IDateOptions
    extends IControlOptions,
        IFontColorStyleOptions,
        IFontWeightOptions,
        IFontSizeOptions,
        IControlProps {
    /**
     * @name Controls/_baseDecorator/IDate#value
     * @cfg {Date} Декорируемая дата.
     * @demo Controls-demo/Decorator/Date/Index
     */
    value: Date;
    /**
     * @name Controls/_baseDecorator/IDate#format
     * @cfg {string} Формат для преобразования даты.
     * Все доступные маски описаны {@link /docs/js/Types/formatter/methods/date/ здесь}
     * @demo Controls-demo/Decorator/Date/Index
     */
    format: string;
    /**
     * @name Controls/_baseDecorator/IDate#timeZoneOffset
     * @cfg {number} Опция, определяющая смещение часового пояса, в котором необходимо вывести значение.
     * @demo Controls-demo/Decorator/Date/Index
     */
    timeZoneOffset?: number;
    /**
     * @name Controls/_baseDecorator/IDate#readOnly
     * @cfg {boolean} Определяет режим отображения 'только для чтения'.
     */
    readOnly?: boolean;
    /**
     * @name Controls/_baseDecorator/IDate#highlightedValue
     * @cfg {string|number} Подсвечиваемый текст.
     */
    highlightedValue?: string | number;
    /**
     * @name Controls/_baseDecorator/IDate#strategy
     * @cfg {string} Определяет тип стратегий для форматирования даты.
     * @variant default Стратегия по умолчанию. Отображение не зависит от текущей даты.
     * @variant registry Стратегия динамического формата даты используется для реестров. Отображение меняется в зависимости от текущей даты.
     * @default default
     * @example
     * <pre class="brush: html">
     * Если текущая дата 5 августа 2022
     * <!-- WML -->
     * Выведет 05.09.22
     * <Controls.baseDecorator:Date value="{{_date}}" strategy="default"/>
     * Выведет 5 сен
     * <Controls.baseDecorator:Date value="{{_date}}" strategy="registry"/>
     * </pre>
     * <pre class="brush: js">
     * // JavaScript
     * class MyControl extends Control<IControlOptions>{
     *    protected _date: Date = new Date(2022, 9, 5, 13, 0, 0)
     * }
     * </pre>
     */
    strategy?: string;
    attrs?: IWasabyAttributes;
}

/**
 * Графический контрол, декорирующий дату таким образом, что она приводится к заданному формату.
 *
 * @class Controls/_baseDecorator/Date
 * @implements Controls/interface:IControl
 * @mixes Controls/baseDecorator:IDate
 * @public
 * @demo Controls-demo/Decorator/Date/Index
 *
 */

export default React.memo(function DateDecorator(
    props: IDateOptions
): React.ReactElement {
    const formattedDate: string = formatDate(props);
    const mainClasses = `controls-DecoratorDate controls-fontsize-${
        props.fontSize
    }
                         controls-text-${
                             props.readOnly ? 'readonly' : props.fontColorStyle
                         }
                         controls-fontweight-${props.fontWeight}`;

    function formatDate(props: IDateOptions): string {
        if (!props.value) {
            return '';
        }
        const config: IDateFormatConfig = {
            mask: props.format,
            strategy:
                props.strategy === 'registry'
                    ? DateFormattingStrategyType.Registry
                    : DateFormattingStrategyType.Default,
            timeZoneOffset: props.timeZoneOffset,
        };
        return date(props.value, config, props.timeZoneOffset);
    }

    return (
        <span
            title={formattedDate}
            ref={props.$wasabyRef}
            {...getAttrs(props.attrs, props.className, mainClasses)}
        >
            {props.highlightedValue !== null &&
            props.highlightedValue !== undefined
                ? createElement(Highlight, {
                      value: formattedDate,
                      highlightedValue: props.highlightedValue,
                  })
                : formattedDate}
        </span>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/baseDecorator:Date}.
 * @interface Controls/_baseDecorator/IDate
 * @public
 */
