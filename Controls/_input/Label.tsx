/**
 * @kaizen_zone 81bbc876-2c56-4178-965a-5a619f9ff4eb
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import {
    ICaptionOptions,
    IFontSizeOptions,
    IHrefOptions,
    IUnderlineOptions,
} from 'Controls/interface';
import 'css!Controls/input';
import { TInternalProps } from 'UICore/Executor';
import { createElement, wasabyAttrsToReactDom } from 'UICore/Jsx';

type TFontColorStyle = 'label' | 'unaccented';

export interface ILabelOptions
    extends IControlProps,
        ICaptionOptions,
        IFontSizeOptions,
        IHrefOptions,
        IUnderlineOptions,
        TInternalProps {
    required?: boolean;
    fontColorStyle?: TFontColorStyle;
}

/**
 * Текстовая метка для поля ввода.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @class Controls/_input/Label
 *
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IUnderline
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IHref
 *
 * @public
 * @demo Controls-demo/Input/Label/Base/Index
 *
 */

export default React.forwardRef(function Label(
    props: ILabelOptions,
    _
): React.ReactElement {
    const {
        underline = 'none',
        fontColorStyle = 'label',
        required,
        caption,
        fontSize,
        readOnly,
    } = props;

    const _isCaptionString = (): boolean => {
        return (
            typeof props.caption === 'string' || props.caption instanceof String
        );
    };
    const _clickHandler = (event: Event): void => {
        if (props.onClick) {
            props.onClick(event);
        }
    };

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const labelClass =
        `controls-Label__caption controls-fontsize-${fontSize}` +
        ` ${!fontSize ? 'controls-Label__caption_fontsize-default' : ''}` +
        ` controls-Label__caption_fontColorStyle-${
            readOnly && underline !== 'none' ? 'readonly' : fontColorStyle
        }` +
        ` controls-Label__caption_underline_${underline}` +
        ` controls-Label__caption_underline_${underline}_${
            readOnly ? 'read' : 'edit'
        }`;

    return (
        <a
            {...attrs}
            onClick={_clickHandler}
            ref={props.$wasabyRef}
            className={`controls-Label controls-Label_underline_${underline} ${attrs.className}`}
            href={props.href}
        >
            <div className="controls-Label__wrapper">
                <div className={labelClass}>
                    {_isCaptionString() ? caption : createElement(caption)}
                </div>
                {required ? (
                    <div className="controls-Label__asterisk controls-Label__asterisk">
                        &nbsp;*
                    </div>
                ) : (
                    ''
                )}
            </div>
        </a>
    );
});

/**
 * @name Controls/_input/Label#required
 * @cfg {Boolean} В значении true справа от метки отображается символ "*" (поле обязательно к заполнению).
 * @demo Controls-demo/Input/Label/Required/Index
 */

/*
 * @name Controls/_input/Label#required
 * @cfg {Boolean} Determines whether the label can be displayed as required.
 */

/**
 * @name Controls/_input/Label#underline
 * @cfg {String} Стиль декоративной линии, отображаемой для текста метки.
 * @default none
 * @demo Controls-demo/Input/Label/Underline/Index
 */

/**
 * @name Controls/_input/Label#fontColorStyle
 * @cfg {String} Стиль цвета текста контрола
 * @variant label
 * @variant unaccented
 * @default label
 * @demo Controls-demo/Input/Label/FontColorStyle/Index
 */
