/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { IContrastBackgroundOptions, IControlProps } from 'Controls/interface';
import 'css!Controls/buttons';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom, clearEvent } from 'UICore/Jsx';
import Button from './Button';
import Arrow, { TArrowButtonDirection } from 'Controls/_buttons/ArrowButton/Arrow';
import { controller } from 'I18n/singletonI18n';

export interface IArrowButtonOptions
    extends IControlOptions,
        IContrastBackgroundOptions,
        IControlProps {
    direction?: TArrowButtonDirection;
    inlineHeight?: string;
    iconSize?: string;
    translucent?: boolean;
    viewMode?: 'filled' | 'ghost';
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
 * @class Controls/_buttons/ArrowButton
 * @public
 * @implements Controls/interface:IControl
 * @implements Controls/interface:IIconSize
 * @demo Controls-demo/Buttons/ArrowButton/Index
 */

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
        iconStyle = 'default',
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
            className={`controls-ArrowButton controls-ArrowButton_${direction} ${
                attrs.className || props.className
            }`}
            viewMode={viewMode}
            readOnly={props.readOnly}
            translucent={translucent}
            contrastBackground={props.contrastBackground}
            iconSize={iconSize}
            iconStyle={iconStyle}
            buttonStyle={buttonStyle === 'default' ? 'default' : 'pale'}
            inlineHeight={inlineHeight}
            iconOptions={{
                direction: iconDirection,
            }}
            iconTemplate={Arrow}
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
 * @name Controls/_buttons/ArrowButton#direction
 * @cfg {TArrowButtonDirection} Выбор стороны, куда будет указывтаь стрелка в кнопке.
 * @example
 * <pre class="brush: html">
 * <Controls.buttons:ArrowButton direction="left"/>
 * </pre>
 * @demo Controls-demo/Buttons/ArrowButton/Direction/Index
 */

/**
 * @name Controls/_buttons/ArrowButton#translucent
 * @cfg {Boolean} Режим полупрозрачного отображения кнопки.
 * @example
 * <pre class="brush: html">
 * <Controls.buttons:ArrowButton translucent="{{true}}"/>
 * </pre>
 * @demo Controls-demo/Buttons/ArrowButton/Translucent/Index
 */

/**
 * @name Controls/_buttons/ArrowButton#inlineHeight
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
 * <Controls.buttons:ArrowButton direction="down" inlineHeight="l"/>
 * </pre>
 */

/**
 * @name Controls/_buttons/ArrowButton#iconSize
 * @demo Controls-demo/Buttons/ArrowButton/IconSize/Index
 */

/**
 * @name Controls/_buttons/ArrowButton#contrastBackground
 * @demo Controls-demo/Buttons/ArrowButton/ContrastBackground/Index
 */
