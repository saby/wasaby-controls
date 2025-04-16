/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { IWasabyAttributes } from 'UICore/Executor';
import { Element, prepareParsedText } from './resources/Highlight';
import { getAttrs } from './resources/Util';
import { IComponentProps } from 'Controls/interface';
import 'css!Controls/baseDecorator';

/**
 * Графический контрол, который позволяет подсветить {@link Controls/_baseDecorator/IHighlight#highlightedValue указанный участок текста}
 * Он может быть полезен для выделения важной информации или ключевых слов в тексте
 * @remark
 * Для нахождения подсвечиваемого текста выполняется поиск сопоставления между {@link Controls/_baseDecorator/IHighlight#value текстом} и {@link Controls/_baseDecorator/IHighlight#highlightedValue искомым текстом}.
 *
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D1%8B_%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0.html алгоритм поиска}
 *
 * @class Controls/_baseDecorator/Highlight
 * @implements Controls/interface:IComponentProps
 * @mixes Controls/baseDecorator:IHighlight
 * @public
 * @demo Controls-demo/Decorator/Highlight/Index
 *
 */

export default React.memo(
    React.forwardRef(function Highlight(
        props: IHighlightOptions,
        ref: React.ForwardedRef<HTMLSpanElement>
    ): React.ReactElement {
        const mainClass = 'controls-DecoratorHighlight';
        const highlightClassName: string = props.highlightClassName
            ? props.highlightClassName
            : 'controls-Highlight_highlight';
        const parsedText: Element[] = prepareParsedText(props);

        return (
            <span
                ref={ref}
                onClick={(e) => {
                    return props.onClick?.(e);
                }}
                title={props.tooltip}
                {...getAttrs(props.attrs, props.className, mainClass)}
                data-qa={props['data-qa']}
            >
                {!!parsedText.length &&
                    parsedText.map((path, index) => {
                        if (path.type === 'highlight') {
                            /* eslint-disable react/no-array-index-key */
                            return (
                                <span
                                    className={highlightClassName}
                                    data-qa={'controls-DecoratorHighlight__highlight'}
                                    key={index}
                                >
                                    {path.value}
                                </span>
                            );
                            /* eslint-enable react/no-array-index-key */
                        }
                        return path.value;
                    })}
            </span>
        );
    })
);

/**
 * Интерфейс для опций контрола {@link Controls/baseDecorator:Highlight}.
 * @interface Controls/_baseDecorator/IHighlight
 * @public
 */

/**
 * @typedef {String} HighlightMode
 * @variant word Подсветка осуществляется по словам.
 * Слово - это набор символов, длина не менее 2. Слова разделяются пробелом и пунктуацией.
 * Например, если искомая строка - "re библиотека", то в тексте "react это библиотека" будет подсвечено слово "библиотека".
 * @variant substring Подсветка осуществляется по подстрокам.
 * Например, если искомая строка - "re библиотека", то в тексте "react это библиотека" будет подсвечена подстрока "re библиотека"
 * @public
 */
export type HighlightMode = 'word' | 'substring';

export interface IHighlightOptions extends IComponentProps {
    /**
     * @name Controls/_baseDecorator/IHighlight#highlightClassName
     * @cfg {string} Класс, с помощью которого можно изменить внешнее отображение подсветки
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
     * @cfg {string | string[] | [number, number][]} Подсвечиваемый текст.
     * @remark
     * Когда задан массив пар индексов подсветка осуществляется строго по заданным границам.
     * Значение опции highlightMode, в таком случае, не учитывается.
     * Границы подсветки - массив из двух целых чисел, где первое число это индекс первого выделенного символа в строке, а второе - индекс последнего выделенного символа в строке.
     * Количество массивов не ограничено, а порядок не важен.
     * Пересечения массивов будут восприняты как одно выделение, например, [[0, 5], [2, 6], [11, 12], [9, 12]] => [[0, 6], [9, 12]].
     * @demo Controls-demo/Decorator/Highlight/HighlightedValue/Index
     */
    highlightedValue: string | string[] | [number, number][];
    /**
     * @name Controls/_baseDecorator/IHighlight#highlightMode
     * @cfg {HighlightMode} Режим подсветки текста.
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
    onMouseDown?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    onTouchStart?: Function;
    $wasabyRef?: unknown;
    /**
     * @name Controls/_baseDecorator/IHighlight#strictSearch
     * @cfg {boolean} Подсветка слов в строгом порядке и только по первому вхождению.
     * Использовать только в случае, если в опцию highlightedValue передан массив.
     * @default false
     */
    strictSearch?: boolean;
}
