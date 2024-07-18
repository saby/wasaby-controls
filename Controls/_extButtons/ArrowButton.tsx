/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { IContrastBackgroundOptions, IControlProps, ITooltipOptions } from 'Controls/interface';
import 'css!Controls/buttons';
import 'css!Controls/extButtons';
import { TInternalProps } from 'UICore/Executor';
import { clearEvent, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Button } from 'Controls/buttons';
import Arrow, { TArrowButtonDirection } from 'Controls/_extButtons/ArrowButton/Arrow';
import ArrowStretched from './ArrowButton/ArrowStretched';
import { controller } from 'I18n/singletonI18n';

export interface IArrowButtonOptions
    extends IControlOptions,
        IContrastBackgroundOptions,
        ITooltipOptions,
        IControlProps {
    direction?: TArrowButtonDirection;
    inlineHeight?: string;
    iconSize?: string;
    translucent?: boolean;
    viewMode?: 'filled' | 'ghost' | 'stretched';
    buttonStyle?: string;
    iconStyle?: string;
}

interface IArrowButtonReactOptions extends IArrowButtonOptions, TInternalProps {
    onClick?: Function;
    _$events?: unknown;
}

function getDirection(direction: TArrowButtonDirection): string {
    if (!['left', 'right'].includes(direction)) {
        return direction;
    }
    if (controller.currentLocaleConfig.directionality === 'rtl') {
        if (direction === 'left') {
            return 'right';
        } else {
            return 'left';
        }
    }
    return direction;
}

/**
 * Графический контрол в виде стрелки, который предоставляет пользователю возможность простого запуска события при нажатии на него.
 * @class Controls/_extButtons/ArrowButton
 * @public
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:ITooltip
 * @demo Controls-demo/Buttons/ArrowButton/Base/Index
 */

const getIconSize = (viewMode: string, iconSize: string) => {
    if (viewMode === 'stretched') {
        return `stretched-${iconSize}`;
    }
    return iconSize;
};

const getIconStyle = (iconStyle, buttonStyle) => {
    if (iconStyle) {
        return iconStyle;
    } else if (buttonStyle === 'default') {
        return 'default';
    } else {
        return 'label';
    }
};

const STRETCHED_MAP = {
    s: 'm',
    m: 'xl',
    l: '5xl',
};

export default React.forwardRef(function ArrowButton(
    props: IArrowButtonReactOptions,
    ref
): React.ReactElement {
    const {
        inlineHeight = 'ArrowButton',
        iconSize = 's',
        direction = 'right',
        translucent = 'none',
        viewMode = 'filled',
        buttonStyle = 'pale',
        iconStyle,
    } = props;

    clearEvent(props, ['onClick']);
    const iconDirection = React.useMemo(() => {
        return getDirection(direction);
    }, [direction]);
    const clickHandler = (event: React.SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
        if (props.readOnly) {
            event.stopPropagation();
        } else if (props.onClick) {
            props.onClick(event);
        }
    };
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <Button
            forwardedRef={ref}
            {...attrs}
            attrs={attrs}
            className={`controls-ArrowButton ${
                viewMode === 'stretched'
                    ? `controls-ArrowButton_stretched controls-ArrowButton_stretched-${direction}`
                    : `controls-ArrowButton_${direction}`
            } ${attrs.className || props.className}`}
            viewMode={viewMode}
            readOnly={props.readOnly}
            data-qa={attrs['data-qa'] || props['data-qa']}
            translucent={translucent}
            contrastBackground={props.contrastBackground}
            iconSize={getIconSize(viewMode, iconSize)}
            iconStyle={getIconStyle(iconStyle, buttonStyle)}
            buttonStyle={buttonStyle === 'default' ? 'default' : 'pale'}
            inlineHeight={viewMode === 'stretched' ? STRETCHED_MAP[inlineHeight] : inlineHeight}
            iconOptions={{
                direction: iconDirection,
            }}
            tooltip={props.tooltip}
            iconTemplate={viewMode === 'stretched' ? ArrowStretched : Arrow}
            onClick={clickHandler}
        />
    );
});

/**
 * @typedef {String} TArrowButtonDirection
 * @variant left Влево.
 * @variant right Вправо.
 * @variant up Вверх.
 * @variant down Вниз.
 */

/**
 * @name Controls/_extButtons/ArrowButton#direction
 * @cfg {TArrowButtonDirection} Выбор стороны, куда будет указывтаь стрелка в кнопке.
 * @example
 * <pre class="brush: html">
 * <Controls.extButtons:ArrowButton direction="left"/>
 * </pre>
 * @demo Controls-demo/Buttons/ArrowButton/Direction/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#translucent
 * @cfg {Boolean} Режим полупрозрачного отображения кнопки.
 * @example
 * <pre class="brush: html">
 * <Controls.extButtons:ArrowButton translucent="{{true}}"/>
 * </pre>
 * @demo Controls-demo/Buttons/ArrowButton/Translucent/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#inlineHeight
 * @cfg {Enum} Высота контрола.
 * @variant s
 * @variant m
 * @variant l
 * @default m
 * @demo Controls-demo/Buttons/ArrowButton/InlineHeight/Index
 * @example
 * Кнопка большого размера (l).
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.extButtons:ArrowButton direction="down" inlineHeight="l"/>
 * </pre>
 */

/**
 * @name Controls/_extButtons/ArrowButton#iconSize
 * @demo Controls-demo/Buttons/ArrowButton/IconSize/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#contrastBackground
 * @demo Controls-demo/Buttons/ArrowButton/ContrastBackground/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#buttonStyle
 * @cfg {String} Стиль отображения кнопки.
 * @variant default
 * @variant pale
 * @default pale
 * @demo Controls-demo/Buttons/ArrowButton/ButtonStyle/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#viewMode
 * @cfg {String} Режим отображения кнопки.
 * @variant filled В виде обычной кнопки c заливкой.
 * @variant ghost В виде кнопки для панели инструментов.
 * @variant stretched В виде овальной кнопки
 * @default filled
 * @demo Controls-demo/Buttons/ArrowButton/ViewMode/Index
 */
