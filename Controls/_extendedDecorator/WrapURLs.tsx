/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { IControlProps } from 'Controls/interface';
import { IWasabyAttributes } from 'UICore/Executor';
import { Highlight, getAttrs } from 'Controls/baseDecorator';
import { Path, parseText } from './resources/WrapURLs';

export interface IWrapURLsOptions extends IControlProps {
    /**
     * @name Controls/_extendedDecorator/IWrapURLs#value
     * @cfg {String} Декорируемый текст.
     * @demo Controls-demo/Decorator/WrapURLs/Index
     */
    value: string;
    /**
     * @name Controls/_extendedDecorator/IWrapURLs#newTab
     * @cfg {Boolean} Определяет, следует ли переходить в новую вкладку при клике на ссылку.
     * @default true
     * @demo Controls-demo/Decorator/WrapURLs/NewTab/Index
     * @remark
     * true - Переход в новой вкладке.
     * false - Переход в текущей вкладке.
     */
    newTab?: boolean;
    /**
     * @name Controls/_extendedDecorator/IWrapURLs#highlightedValue
     * @cfg {string} Подсвечиваемый текст.
     */
    highlightedValue?: string;
    attrs?: IWasabyAttributes;
}

/**
 * Графический контрол, декорирующий текст таким образом, что все ссылки в нем становятся активными и меняют свой внешний вид.
 * Активная ссылка - это элемент страницы, при клике на который происходит переход на внешний ресурс.
 * @remark
 * Поддерживаемые ссылки:
 * * Ссылка на web-страницу ({@link https://en.wikipedia.org/wiki/File_Transfer_Protocol ftp}, www, http, https, Notes).
 * * Ссылка на email адрес ([текст]@[текст].[текст от 2 до 6 знаков]).
 * * Ссылка на локальный файл ({@link https://en.wikipedia.org/wiki/File_URI_scheme file}).
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_decorator.less переменные тем оформления}
 *
 * @class Controls/_extendedDecorator/WrapURLs
 * @implements Controls/interface:IControl
 * @mixes Controls/extendedDecorator:IWrapURLs
 * @public
 * @demo Controls-demo/Decorator/WrapURLs/Index
 *
 */

export default React.memo(function WrapURLs(props: IWrapURLsOptions): React.ReactElement {
    const mainClass = 'controls-DecoratorWrapURLs';
    const newTab = props.newTab === undefined ? true : props.newTab;
    const parsedText: Path[] = parseText(props.value);

    return (
        <div ref={props.$wasabyRef} {...getAttrs(props.attrs, props.className, mainClass)}>
            {parsedText.map((path, index) => {
                if (path.type === 'link') {
                    /* eslint-disable react/no-array-index-key */
                    return (
                        <a
                            className="ws-link"
                            key={index}
                            rel="noreferrer"
                            href={path.scheme === 'www.' ? 'http://' : '' + path.href}
                            target={newTab ? '_blank' : ''}
                        >
                            {path.href}
                        </a>
                    );
                    /* eslint-enable react/no-array-index-key */
                } else if (path.type === 'email') {
                    /* eslint-disable react/no-array-index-key */
                    return (
                        <a className="ws-link" key={index} href={'mailto:' + path.address}>
                            {path.address}
                        </a>
                    );
                    /* eslint-enable react/no-array-index-key */
                } else if (props.highlightedValue) {
                    return createElement(
                        Highlight,
                        {
                            value: path.value,
                            highlightedValue: props.highlightedValue,
                        },
                        {
                            key: index,
                        }
                    );
                } else {
                    return path.value;
                }
            })}
        </div>
    );
});

/**
 * Интерфейс для опций контрола {@link Controls/extendedDecorator:WrapURLs}.
 * @interface Controls/_extendedDecorator/IWrapURLs
 * @public
 */
