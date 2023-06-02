/**
 * @kaizen_zone cf38e892-5e45-4941-98a7-87bbb1838d31
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import 'css!Controls/heading';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

export interface ISeparatorOptions extends IControlProps, TInternalProps {
    separatorStyle?: 'primary' | 'secondary';
    style?: string;
}

/**
 * Разделитель заголовков с поддержкой некоторых стилей отображения.
 *
 * @remark
 * Используется в составе сложных заголовков, состоящих из {@link Controls/heading:Separator}, {@link Controls/heading:Counter} и {@link Controls/heading:Title}.
 * Для одновременной подсветки всех частей сложного заголовка при наведении используйте класс controls-Header_all__clickable на контейнере.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/text-and-styles/heading/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000Controls-default-theme/variables/_heading.less переменные тем оформления}
 *
 *
 * @class Controls/_heading/Separator
 * @implements Controls/interface:IControl
 * @implements Controls/interface:ICaption
 * @public
 *
 * @demo Controls-demo/Heading/Separators/Index
 */

/*
 * Heading separator with support some display styles. Used as part of complex headings(you can see it in Demo-example)
 * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a> and a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 * @class Controls/_heading/Separator
 *
 * @public
 * @author Мочалов М.А.
 *
 * @demo Controls-demo/Heading/Separators/Index
 */

export default React.forwardRef(function Separator(
    props: ISeparatorOptions,
    _
): React.ReactElement {
    const [separatorStyle, setSeparatorStyle] = React.useState<string>('');

    React.useEffect(() => {
        setSeparatorStyle(props.style || props.separatorStyle || 'secondary');
        if (props.style !== undefined) {
            Logger.warn(
                'Header.Separator: Используется устаревшая опция style,' +
                    ' нужно использовать separatorStyle',
                this
            );
        }
    }, []);

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};

    return (
        <div
            {...attrs}
            ref={props.$wasabyRef}
            className={`controls-HeaderSeparator ${attrs.className} ${
                props.className || ''
            }`}
        >
            <div className="controls-HeaderSeparator__wrapper">
                <svg
                    viewBox="0 0 6 10"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`controls-HeaderSeparator__arrow controls-HeaderSeparator__arrow_style-${separatorStyle}`}
                >
                    <polygon points="0,0 2,0 6,5 2,10 0,10 4,5" />
                </svg>
            </div>
        </div>
    );
});

/**
 * @name Controls/_heading/Separator#separatorStyle
 * @cfg {String} Стиль отображения иконки. В теме онлайна есть только один стиль отображения.
 * @variant primary
 * @variant secondary
 * @default secondary
 */

/*
 * @name Controls/_heading/Separator#style
 * @cfg {String} Icon display style. In the online theme has only one display style.
 * @variant primary
 * @variant secondary
 * @default secondary
 */
