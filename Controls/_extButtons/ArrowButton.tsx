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
import { Logger } from 'UI/Utils';

export type TArrowButtonInlineHeight = 's' | 'm' | 'mt' | 'xl' | '5xl';
export type TArrowButtonViewMode = 'filled' | 'ghost' | 'stretched';
export type TArrowButtonButtonStyle = 'default' | 'pale';

export interface IArrowButtonOptions
    extends IControlOptions,
        IContrastBackgroundOptions,
        ITooltipOptions,
        IControlProps {
    direction?: TArrowButtonDirection;
    inlineHeight?: TArrowButtonInlineHeight;
    translucent?: boolean;
    viewMode?: TArrowButtonViewMode;
    buttonStyle?: TArrowButtonButtonStyle;
}

interface IArrowButtonReactOptions extends IArrowButtonOptions, TInternalProps {
    onClick?: Function;
    _$events?: unknown;
}

function getInlineHeight(
    inlineHeight: TArrowButtonInlineHeight | string
): TArrowButtonInlineHeight {
    if (['s', 'm', 'mt', 'xl', '5xl'].includes(inlineHeight)) {
        return inlineHeight as TArrowButtonInlineHeight;
    }
    Logger.warn(
        'Controls.extButtons:ArrowButton: Значение опции inlineHeight не соответствует размерной сетке. Используйте s, m, mt, xl, 5xl'
    );
    return 'm';
}

const ICON_SIZE_MAP = {
    s: 's',
    m: 's',
    mt: 's',
    xl: 'm',
    '5xl': 'l',
};

const getIconSize = (viewMode: TArrowButtonViewMode, inlineHeight: TArrowButtonInlineHeight) => {
    if (viewMode === 'stretched') {
        return `stretched-${ICON_SIZE_MAP[inlineHeight]}`;
    }
    return ICON_SIZE_MAP[inlineHeight];
};

const getIconStyle = (viewMode: TArrowButtonViewMode, buttonStyle: TArrowButtonButtonStyle) => {
    if (viewMode === 'stretched') {
        return 'contrast';
    } else if (buttonStyle === 'default') {
        return 'default';
    } else {
        return 'label';
    }
};

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
 * @implements Controls/interface:ITooltip
 * @demo Controls-demo/Buttons/ArrowButton/Base/Index
 */
export default React.forwardRef(function ArrowButton(
    props: IArrowButtonReactOptions,
    ref
): React.ReactElement {
    const {
        inlineHeight = 'm',
        direction = 'right',
        translucent = 'none',
        viewMode = 'filled',
        buttonStyle = 'pale',
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
            iconSize={getIconSize(viewMode, getInlineHeight(inlineHeight))}
            iconStyle={getIconStyle(viewMode, buttonStyle)}
            buttonStyle={buttonStyle}
            inlineHeight={getInlineHeight(inlineHeight)}
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
 * @cfg {Boolean} Режим полупрозрачного отображения кнопки. Отображение изменяется при viewMode='filled'.
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
 * @variant mt
 * @variant xl
 * @variant 5xl
 * @default m
 * @demo Controls-demo/Buttons/ArrowButton/InlineHeight/Index
 * @remark Для viewMode='stretched' размерная сетка состоит только из 3 размеров: 'm', 'xl', '5xl'.
 * @example
 * Кнопка большого размера (5xl).
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.extButtons:ArrowButton direction="down" inlineHeight="5xl"/>
 * </pre>
 */

/**
 * @name Controls/_extButtons/ArrowButton#contrastBackground
 * @demo Controls-demo/Buttons/ArrowButton/ContrastBackground/Index
 */

/**
 * @name Controls/_extButtons/ArrowButton#buttonStyle
 * @cfg {String} Стиль отображения кнопки. Стиль изменяется при viewMode='filled'.
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
