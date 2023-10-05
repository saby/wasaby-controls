/**
 * @kaizen_zone cf38e892-5e45-4941-98a7-87bbb1838d31
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { IFontColorStyleOptions, IFontSizeOptions } from 'Controls/interface';
import 'css!Controls/heading';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

export interface ICounterOptions extends IControlProps, IFontColorStyleOptions, IFontSizeOptions {
    caption?: string;
}

interface IReactCounterOptions extends ICounterOptions, TInternalProps {
    className?: string;
}

/**
 * Счетчик с поддержкой различных стилей отображения и размеров.
 *
 * @remark
 * Используется в составе сложных заголовков, состоящих из {@link Controls/heading:Separator}, {@link Controls/heading:Counter} и {@link Controls/heading:Title}.
 * Для одновременной подсветки всех частей сложного заголовка при наведении используйте класс controls-Header_all__clickable на контейнере.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/text-and-styles/heading/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_heading.less переменные тем оформления}
 *
 * @class Controls/_heading/Counter
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 *
 * @public
 *
 * @demo Controls-demo/Heading/Counters/Index
 */

/*
 * Counter with support different display styles and sizes. Used as part of complex headers(you can see it in Demo-example)
 * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 * @class Controls/_heading/Counter
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 * @author Мочалов М.А.
 *
 * @demo Controls-demo/Heading/Counters/Index
 */
export default React.forwardRef(function Counter(
    props: IReactCounterOptions,
    _
): React.ReactElement {
    const { fontSize = 'l', fontColorStyle = 'primary', readOnly } = props;

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const headerClass =
        `controls-HeaderCounter controls-fontsize-${fontSize}` +
        ` ${
            !readOnly ? 'controls-HeaderCounter_hovered' : ''
        } controls-HeaderCounter_style-${fontColorStyle}` +
        ` controls-HeaderCounter_style-${fontColorStyle}${readOnly ? '' : '_hovered'} ${
            attrs.className
        } ${props.className || ''}`;
    return (
        <span {...attrs} ref={props.$wasabyRef} className={headerClass}>
            {props.caption}
        </span>
    );
});

/**
 * @name Controls/_heading/Counter#caption
 * @cfg {string} Определяет текст заголовка контрола.
 * @demo Controls-demo/Heading/Counters/Index
 */
