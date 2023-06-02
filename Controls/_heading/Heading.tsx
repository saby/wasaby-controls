/**
 * @kaizen_zone cf38e892-5e45-4941-98a7-87bbb1838d31
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import 'css!Controls/heading';
import {
    ICaptionOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    ITextTransformOptions,
    ITooltipOptions,
} from 'Controls/interface';
import { FocusRoot } from 'UI/Focus';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

export interface IHeadingOptions
    extends IControlProps,
        ICaptionOptions,
        ITooltipOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        ITextTransformOptions {
    className?: string;
    onClick?: Function;
    onMouseDown?: Function;
    onKeyDown?: Function;
}

/**
 * Простой заголовок с поддержкой различных стилей отображения и размеров.
 *
 * @remark
 * Может использоваться самостоятельно или в составе сложных заголовков, состоящих из {@link Controls/heading:Separator}, {@link Controls/heading:Counter} и {@link Controls/heading:Title}.
 * Для одновременной подсветки всех частей сложного заголовка при наведении используйте класс controls-Header_all__clickable на контейнере.
 * Кликабельность заголовка зависит от {@link readOnly режима отображения}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/text-and-styles/heading/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_heading.less переменные тем оформления}
 *
 * @class Controls/_heading/Heading
 * @implements Controls/interface:IControl
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:ITextTransform
 * @public
 *
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 * @demo Controls-demo/Heading/Group/Index
 *
 */
export default React.forwardRef(function Header(
    props: IHeadingOptions,
    _
): React.ReactElement {
    const {
        fontSize = 'l',
        textTransform = 'none',
        fontWeight = 'default',
        fontColorStyle = 'default',
        readOnly,
    } = props;

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const className = props.className || attrs.className || '';
    const headerClass =
        `controls-Header__caption ${
            textTransform !== 'none' ? 'controls-heading__' + textTransform : ''
        }` +
        ` ${
            fontWeight === 'default'
                ? 'controls-Header__fontweight-default'
                : 'controls-fontweight-' + fontWeight
        }` +
        ` controls-fontsize-${fontSize} controls-Header-fontsize-${fontSize} controls-Header_${
            readOnly ? 'readonly' : 'clickable'
        }` +
        ` controls-Header__caption_style-${fontColorStyle}${
            readOnly ? '' : '_hovered'
        } ${className}`;
    return (
        <FocusRoot
            {...attrs}
            as="span"
            ref={props.$wasabyRef}
            className={headerClass}
            title={props.tooltip}
            onClick={(e) => {
                props.onClick?.(e);
            }}
            onKeyDown={(e) => {
                props.onKeyDown?.(e);
            }}
            onMouseDown={(e) => {
                props.onMouseDown?.(e);
            }}
        >
            {props.caption}
        </FocusRoot>
    );
});

/**
 * @name Controls/_heading/Heading#textTransform
 * @cfg {Controls/interface:ITextTransform/TTextTransform.typedef}
 * @default none
 * @demo Controls-demo/Heading/Title/TextTransform/Index
 * @remark
 * Вместе с установкой преобразования текста, меняется так же расстояние между буквами.
 */

/**
 * @name Controls/_heading/Heading#fontSize
 * @cfg {String}
 * @default l
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 * @example
 * <pre class="brush: html">
 * <Controls.heading:Title caption="Heading" fontColorStyle="primary" fontSize="xs"/>
 * </pre>
 */

/**
 * @name Controls/_heading/Heading#fontWeight
 * @cfg {TFontWeight}
 * @demo Controls-demo/Heading/Title/FontWeight/Index
 */

/**
 * @name Controls/_heading/Heading#fontColorStyle
 * @cfg {Controls/interface:IFontColorStyle/TFontColorStyle.typedef}
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 * @default default
 * @example
 * <pre class="brush: html">
 * <Controls.heading:Title caption="Heading" fontColorStyle="primary" fontSize="xs"/>
 * </pre>
 */

/**
 * @name Controls/_heading/Heading#caption
 * @cfg {String}
 * @demo Controls-demo/Heading/Title/SizesAndStyles/Index
 * @example
 * <pre class="brush: html">
 * <Controls.heading:Title caption="Heading" fontColorStyle="primary" fontSize="xs"/>
 * </pre>
 */
