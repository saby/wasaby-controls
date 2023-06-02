/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { IWasabyAttributes } from 'UICore/Executor';
import { prepareParsedText, Element } from './resources/Highlight';
import { getAttrs } from './resources/Util';
import { IControlProps } from 'Controls/interface';
import 'css!Controls/baseDecorator';

/**
 * Графический контрол, декорирующий текст таким образом, что все вхождения
 * {@link Controls/_baseDecorator/IHighlight#highlightedValue подсвечиваемого текста} в нём изменяют свой внешний вид.
 * Изменение внешнего вида текста используется с целью акцентирования на нём внимания.
 * @remark
 * Для нахождения подсвечиваемого текста выполняется поиск сопоставления между
 * {@link Controls/_baseDecorator/IHighlight#value текстом} и
 * {@link Controls/_baseDecorator/IHighlight#highlightedValue искомым текстом}.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D1%8B_%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0.html алгоритм поиска}
 *
 * @class Controls/_baseDecorator/Highlight
 * @implements Controls/interface:IControl
 * @mixes Controls/baseDecorator:IHighlight
 * @public
 * @demo Controls-demo/Decorator/Highlight/Index
 *
 */

export default React.memo(function Highlight(
    props: IHighlightOptions
): React.ReactElement {
    const highlightClassName: string = props.highlightClassName
        ? props.highlightClassName
        : 'controls-Highlight_highlight';
    const parsedText: Element[] = prepareParsedText(props);

    return (
        <span
            ref={props.$wasabyRef}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            title={props.tooltip}
            {...getAttrs(props.attrs)}
        >
            {
                !!parsedText.length && parsedText.map((path, index) => {
                    if (path.type === 'highlight') {
                        /* eslint-disable react/no-array-index-key */
                        return (
                            <span className={highlightClassName} key={index}>
                                {path.value}
                            </span>
                        );
                        /* eslint-enable react/no-array-index-key */
                    }
                    return path.value;
                })
            }
        </span>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/baseDecorator:Highlight}.
 * @interface Controls/_baseDecorator/IHighlight
 * @public
 */

/**
 * @typedef THighlightMode
 * @variant word Подсветка осуществляется по словам.
 * Слово - это набор символов, длина не менее 2. Слова разделяются пробелом и пунктуацией.
 * @variant substring Подсветка осуществляется по подстрокам.
 */
export type HighlightMode = 'word' | 'substring';

export interface IHighlightOptions extends IControlProps {
    /**
     * @name Controls/_baseDecorator/IHighlight#highlightClassName
     * @cfg {string} Класс обеспечивающий внешнее отображение подсветки.
     * @default controls-Highlight_highlight
     * @demo Controls-demo/Decorator/Highlight/ClassName/Index
     */
    highlightClassName?: string;
    /**
     * @name Controls/_baseDecorator/IHighlight#value
     * @cfg {string | number} Декорируемый текст.
     * @demo Controls-demo/Decorator/Highlight/Value/Index
     */
    value: string | number;
    /**
     * @name Controls/_baseDecorator/IHighlight#highlightedValue
     * @cfg {string} Подсвечиваемый текст.
     * @demo Controls-demo/Decorator/Highlight/HighlightedValue/Index
     */
    highlightedValue: string | string[];
    /**
     * @name Controls/_baseDecorator/IHighlight#highlightMode
     * @cfg {Controls/_baseDecorator/IHighlight/THighlightMode.typedef} Режим подсветки.
     * @type HighlightMode
     * @default substring
     * @demo Controls-demo/Decorator/Highlight/HighlightMode/Index
     */
    highlightMode?: HighlightMode;
    /**
     * @name Controls/_baseDecorator/IHighlight#tooltip
     * @cfg {string} Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
     */
    tooltip?: string;
    attrs?: IWasabyAttributes;
    onClick?: Function;
}
