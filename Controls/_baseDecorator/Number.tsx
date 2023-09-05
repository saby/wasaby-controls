/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import {
    INumberOptions,
    calculateFontColorStyle,
    calculateFormattedNumber,
    calculateMainClass,
} from './resources/Number';
import { getFontWidth, loadFontWidthConstants, isFontWidthConstantsLoaded } from 'Controls/Utils/getFontWidth';
import Highlight from './Highlight';
import { getAttrs } from './resources/Util';
import 'css!Controls/baseDecorator';

/**
 * Графический контрол, декорирующий число таким образом, что оно приводится к форматируемому виду.
 * Форматом является число разбитое на триады с ограниченной дробной частью.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 *
 * @class Controls/_baseDecorator/Number
 * @implements Controls/interface:IControl
 * @mixes Controls/baseDecorator:INumber
 * @implements Controls/baseDecorator:IOnlyPositive
 * @implements Controls/interface:INumberFormat
 * @implements Controls/interface:IStroked
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IFontColorStyle
 * @public
 * @demo Controls-demo/Decorator/Number/Index
 *
 */

export default React.memo(function Number(props: INumberOptions): React.ReactElement {
    const [title, setTitle] = React.useState(props.tooltip);
    const container = React.useRef(null);
    const useGrouping = props.useGrouping !== false;
    const roundMode = props.roundMode || 'trunc';
    const showEmptyDecimals = props.showEmptyDecimals || false;
    const abbreviationType = props.abbreviationType || 'none';
    const stroked = props.stroked || false;
    const underline = props.underline || 'none';
    const fontColorStyle = calculateFontColorStyle(stroked, props);
    const formattedNumber = calculateFormattedNumber(
        props.value,
        useGrouping,
        roundMode,
        props.fractionSize,
        abbreviationType,
        showEmptyDecimals,
        props,
        this
    );
    const mainClass = calculateMainClass(
        props.fontSize,
        fontColorStyle,
        stroked,
        underline,
        props.fontWeight
    );
    const mouseEnterHandler = (): void => {
        if (props.tooltip) {
            if (props.tooltip !== title) {
                setTitle(props.tooltip);
            }
            return;
        }

        if (isFontWidthConstantsLoaded()) {
            prepareTitle();
            return;
        }

        loadFontWidthConstants().then(() => {
            prepareTitle();
        });
    };

    const prepareTitle = () => {
        const parentContainer = container.current.parentElement;
        const containerStyles = getComputedStyle(parentContainer);
        const containerWidth =
            parentContainer.getBoundingClientRect().width -
            parseInt(containerStyles.paddingRight, 10) -
            parseInt(containerStyles.paddingLeft, 10);
        const textWidth = getFontWidth(formattedNumber, props.fontSize || 'm');
        if (textWidth > containerWidth && title !== formattedNumber) {
            setTitle(formattedNumber);
        }
    };

    const setRef = (node) => {
        if (!node) {
            return;
        }
        if (props.$wasabyRef) {
            props.$wasabyRef(node);
        }
        container.current = node;
    };

    return (
        <span
            ref={setRef}
            title={title}
            onMouseEnter={mouseEnterHandler}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            {...getAttrs(props.attrs, props.className, mainClass)}
            data-qa={props['data-qa']}
        >
            {props.highlightedValue !== null && props.highlightedValue !== undefined
                ? (
                    <Highlight value={formattedNumber}
                               highlightedValue={props.highlightedValue}
                    />
                  )
                : formattedNumber}
        </span>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/baseDecorator:Number}.
 * @interface Controls/_baseDecorator/INumber
 * @public
 */

/**
 * @name Controls/_baseDecorator/INumber#value
 * @cfg {String | Number | Null} Декорируемое число.
 * @demo Controls-demo/Decorator/Number/Value/Index
 */

/**
 * @name Controls/_baseDecorator/INumber#highlightedValue
 * @cfg {string} Подсвечиваемый текст.
 */

/**
 * @name Controls/_baseDecorator/INumber#fractionSize
 * @cfg {Number} Количество знаков после запятой. Диапазон от 0 до 20.
 * @demo Controls-demo/Decorator/Number/FractionSize/Index
 * @deprecated Опция устарела и в ближайшее время её поддержка будет прекращена. Используйте опцию {@link Controls/_baseDecorator/INumber#precision}.
 */

/**
 * @name Controls/_baseDecorator/INumber#precision
 * @cfg {Number} Количество знаков после запятой. Диапазон от 0 до 20.
 * @demo Controls-demo/Decorator/Number/Precision/Index
 */

/**
 * @name Controls/_baseDecorator/INumber#roundMode
 * @cfg {Controls/_baseDecorator/INumber/TRoundMode.typedef} Режим форматирования дробной части числа.
 * @default trunc
 * @variant round
 * @variant trunc
 * @demo Controls-demo/Decorator/Number/RoundMode/Index
 */

/**
 * @typedef {String} Controls/_baseDecorator/INumber/TRoundMode
 * @variant round При необходимости число округляется, а дробная часть дополняется нулями, чтобы она имела заданную длину.
 * @variant trunc Усекает (отсекает) цифры справа от точки так, чтобы дробная часть имела заданную длину, независимо от
 * того, является ли аргумент положительным или отрицательным числом.
 */

/**
 * @name Controls/_baseDecorator/INumber#abbreviationType
 * @cfg {Controls/_baseDecorator/INumber/TAbbreviationType.typedef} Тип аббревиатуры.
 * @default none
 * @variant short
 * @variant long
 * @variant none
 * @demo Controls-demo/Decorator/Number/Abbreviation/Index
 */

/**
 * @typedef {String} Controls/_baseDecorator/INumber/TAbbreviationType
 * @variant long Использовать длинную аббревиатуру (например, 1 000 = 1 тыс)
 * @variant short Использовать короткую аббревиатуру (например, 1 000 = 1k)
 * @variant none Не использовать аббревиатуру
 */

/**
 * @name Controls/_baseDecorator/INumber#underline
 * @cfg {Controls/_baseDecorator/INumber/TUnderline.typedef} Вариант подчеркивания.
 * @default none
 * @variant hovered
 * @variant none
 * @demo Controls-demo/Decorator/Number/Underline/Index
 */

/**
 * @typedef {String} Controls/_baseDecorator/INumber/TUnderline
 * @variant hovered Подчеркивать по наведению
 * @variant none Не подчеркивать
 */

/**
 * @name Controls/_baseDecorator/INumber#tooltip
 * @cfg {string} Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
 */

/**
 * @name Controls/_baseDecorator/Number#fontSize
 * @cfg {String}
 * @default inherit
 * @demo Controls-demo/Decorator/Number/FontSize/Index
 */

/**
 * @name Controls/_baseDecorator/Number#fontColorStyle
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
 * @demo Controls-demo/Decorator/Number/FontColorStyle/Index
 */
