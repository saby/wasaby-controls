/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import {
    calculateCurrency,
    calculateCurrencyClass,
    calculateFontColorStyle,
    calculateFormattedNumber,
    calculateFractionClass,
    calculateFractionFontSize,
    calculateIntegerClass,
    calculateMainClass,
    calculateStrokedClass,
    calculateTooltip,
    isDisplayFractionPath,
} from './resources/Money';
import Highlight from './Highlight';
import { IMoneyOptions } from './resources/Money';
import 'css!Controls/baseDecorator';
import { getAttrs } from './resources/Util';

/**
 * Графический контрол, декорирующий число таким образом, что оно приводится к денежному формату.
 * Денежным форматом является число с неограниченной целой частью, и двумя знаками в дробной части.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 *
 * @class Controls/_baseDecorator/Money
 * @implements Controls/interface:IControl
 *
 * @implements Controls/baseDecorator:IOnlyPositive
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:INumberFormat
 * @mixes Controls/baseDecorator:IMoney
 *
 * @public
 * @demo Controls-demo/Decorator/Money/Index
 * @demo Controls-demo/Decorator/Money/Hovered/Index
 *
 */

export default React.memo(function Money(
    props: IMoneyOptions
): React.ReactElement {
    const value = typeof props.value !== 'undefined' ? props.value : null;
    const useGrouping = props.useGrouping !== false;
    const abbreviationType = props.abbreviationType || 'none';
    const precision = props.precision === 0 ? 0 : props.precision === 4 ? 4 : 2;
    const formattedNumber = calculateFormattedNumber(
        value,
        useGrouping,
        abbreviationType,
        precision,
        props.onlyPositive,
        props
    );
    const stroked = props.stroked || false;
    const fontColorStyle = calculateFontColorStyle(stroked, props) || 'default';
    const fontSize = props.fontSize || 'm';
    const fontWeight = props.fontWeight || 'default';
    const showEmptyDecimals = props.showEmptyDecimals !== false;
    const currencySize = props.currencySize || 's';
    const currencyPosition = props.currencyPosition || 'right';
    const underline = props.underline || 'none';
    const currency = calculateCurrency(props.currency);
    const fractionFontSize = calculateFractionFontSize(fontSize);
    const isDisplayFraction = isDisplayFractionPath(
        formattedNumber.fraction,
        showEmptyDecimals,
        precision
    );
    const tooltip = props.tooltip || calculateTooltip(formattedNumber, props);
    const mainClass = calculateMainClass(fontColorStyle, underline);
    const currencyClass = calculateCurrencyClass(
        currencySize,
        fontColorStyle,
        fontWeight
    );
    const strokedClass = calculateStrokedClass(stroked);
    const integerClass = calculateIntegerClass(
        fontSize,
        fontColorStyle,
        fontWeight,
        props.currency,
        currencyPosition,
        isDisplayFraction && abbreviationType !== 'long'
    );
    const fractionClass = calculateFractionClass(
        formattedNumber.fraction,
        fontColorStyle,
        fractionFontSize,
        props.currency,
        currencyPosition
    );

    return (
        <span
            ref={props.$wasabyRef}
            title={tooltip}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onMouseLeave={(e) => {
                return props.onMouseLeave?.(e);
            }}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onBlur={(e) => {
                return props.onBlur?.(e);
            }}
            onCopy={(e) => {
                return props.onCopy?.(e);
            }}
            onCut={(e) => {
                return props.onCut?.(e);
            }}
            onFocus={(e) => {
                return props.onFocus?.(e);
            }}
            onInput={(e) => {
                return props.onInput?.(e);
            }}
            onKeyDown={(e) => {
                return props.onKeyDown?.(e);
            }}
            onKeyUp={(e) => {
                return props.onKeyUp?.(e);
            }}
            {...getAttrs(props.attrs, mainClass)}
        >
            {props.currency && currencyPosition === 'left' ? (
                <span className={currencyClass}>{currency}</span>
            ) : null}
            <span className={strokedClass}>
                {
                    <>
                        <span className={integerClass}>
                            {props.highlightedValue !== null &&
                            props.highlightedValue !== undefined
                                ? createElement(Highlight, {
                                      value: formattedNumber.integer,
                                      highlightedValue: String(
                                          props.highlightedValue
                                      ),
                                  })
                                : formattedNumber.integer}
                        </span>
                        {isDisplayFraction && abbreviationType !== 'long' ? (
                            <span className={fractionClass}>
                                {props.highlightedValue !== null &&
                                props.highlightedValue !== undefined
                                    ? createElement(Highlight, {
                                          value: formattedNumber.fraction,
                                          highlightedValue: String(
                                              props.highlightedValue
                                          ),
                                      })
                                    : formattedNumber.fraction}
                            </span>
                        ) : null}
                    </>
                }
            </span>
            {props.currency && currencyPosition === 'right' ? (
                <span className={currencyClass}>{currency}</span>
            ) : null}
        </span>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/baseDecorator:Money}.
 * @interface Controls/_baseDecorator/IMoney
 * @public
 */

/**
 * @name Controls/_baseDecorator/IMoney#value
 * @cfg {String | Number | Null} Декорируемое число.
 * @default null
 * @demo Controls-demo/Decorator/Money/Value/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#abbreviationType
 * @cfg {Controls/_baseDecorator/IMoney/TAbbreviationType.typedef} Тип аббревиатуры.
 * @default none
 * @demo Controls-demo/Decorator/Money/Abbreviation/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#currency
 * @cfg {Controls/_baseDecorator/IMoney/TCurrency.typedef} Отображаемая валюта. В качестве значений можно передавать 1
 * из возможных значений, либо произвольный символ валюты.
 * @demo Controls-demo/Decorator/Money/Currency/Index
 * @example
 * В следующем примере показано, как отобразить символ рубля.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.baseDecorator:Money value="{{10.10}}" currency="Ruble"/>
 * </pre>
 * В следующем примере показано, как отобразить символ доллара.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.baseDecorator:Money value="{{10.10}}" currency="Dollar"/>
 * </pre>
 * В следующем примере показано, как отобразить символ евро.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.baseDecorator:Money value="{{10.10}}" currency="Euro"/>
 * </pre>
 * В следующем примере показано, как отобразить произвольный символ. Например юань.
 * <pre class="brush: html;">
 * <!-- WML -->
 * <Controls.baseDecorator:Money value="{{10.10}}" currency="¥"/>
 * </pre>
 */

/**
 * @name Controls/_baseDecorator/IMoney#currencySize
 * @cfg {Controls/_baseDecorator/IMoney/TCurrencySize.typedef} Размер отображаемой валюты.
 * @default s
 * @demo Controls-demo/Decorator/Money/CurrencySize/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#currencyPosition
 * @cfg {Controls/_baseDecorator/IMoney/TCurrencyPosition.typedef} Позиция отображаемой валюты относительно суммы.
 * @default right
 * @demo Controls-demo/Decorator/Money/Currency/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#underline
 * @cfg {Controls/_baseDecorator/IMoney/TUnderline.typedef} Вариант подчеркивания.
 * @default none
 * @demo Controls-demo/Decorator/Money/Underline/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#precision
 * @cfg {Number} Количество знаков после запятой.
 * @variant 0
 * @variant 2
 * @variant 4
 * @default 2
 * @demo Controls-demo/Decorator/Money/Precision/Index
 */

/**
 * @name Controls/_baseDecorator/IMoney#showEmptyDecimals
 * @cfg {Boolean}
 * @default true
 */

/**
 * @name Controls/_baseDecorator/IMoney#fontColorStyle
 * @cfg {String}
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant unaccented
 * @variant link
 * @variant label
 * @variant info
 * @variant default
 * @variant contrast
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.baseDecorator:Money value="{{100000.00}}" fontColorStyle="primary"/>
 * <Controls.baseDecorator:Money value="{{100000.00}}" fontColorStyle="secondary"/>
 * </pre>
 * @demo Controls-demo/Decorator/Money/FontColorStyle/Index
 */

/**
 * Тип данных для форматируемого значения
 * @typedef {String|Number|Null} TValue
 */

/**
 * Тип данных для аббревиатуры (сокращения) суммы
 * @typedef {String} TAbbreviationType
 * @variant long Использвать длинную аббревиатуру (например, 1 000 = 1 тыс)
 * @variant none Не использовать аббревиатуру
 */

/**
 * Тип данных для отображаемой валюты. Принимает 1 из возможных значений, либо произвольный символ валюты.
 * @typedef {String} TCurrency
 * @variant Ruble Отображать символ валюты рубль
 * @variant Euro Отображать символ валюты евро
 * @variant Dollar Отображать символ валюты доллар
 * @variant * Отображать любой произвольный символ
 */

/**
 * Тип данных для позиции отображаемой валюты
 * @typedef {String} TCurrencyPosition
 * @variant right Валюта отображается справа от суммы
 * @variant left Валюта отображается слева от суммы
 */

/**
 * Тип данных для размера отображаемой валюты
 * @typedef {String} TCurrencySize
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 */

/**
 * Тип данных для подчеркивания
 * @typedef {String} TUnderline
 * @variant hovered Подчеркивать по наведению
 * @variant none Не подчеркивать
 */

/**
 * Тип данных количества знаков после запятой
 * @typedef {String} TPrecision
 * @variant 0
 * @variant 2
 */

/**
 * @name Controls/_baseDecorator/IMoney#highlightedValue
 * @cfg {String|Number} Подсвечиваемый текст.
 * @demo Controls-demo/Decorator/Money/HighlightedValue/Index
 */
