/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { createElement, wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls/themes';

export interface IWrapperOptions extends IControlProps {
    variables: Record<string, string>;
    contentOptions?: unknown;
    onClick?: Function;
    onContextMenu?: Function;
    onLongtap?: Function;
    onMouseDown?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseUp?: Function;
    onSwipe?: Function;
    onTouchMove?: Function;
    onWheel?: Function;
}

const prepareStyleValue = (
    variablesObj: Record<string, string> = {}
): string => {
    let result = '';
    Object.keys(variablesObj).forEach((key) => {
        result += [key, ':', variablesObj[key], ';'].join('');
    });
    return result;
};

/**
 * Контейнер для стилизации элементов. Позволяет переопределять любые css-переменные на своем корневом DOM-элементе.
 * @class Controls/_themes/Wrapper
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/themes/Wrapper/Index
 */

function Wrapper(props: IWrapperOptions, _): React.ReactElement {
    const themeVariables = prepareStyleValue(props.variables);

    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getContent = (): React.ReactElement => {
        return createElement(
            props.content,
            {
                ...props.contentOptions,
                $wasabyRef: props.$wasabyRef,
            },
            {
                ...attrs,
                class: `controls_themes__wrapper ${attrs.className} ${props.className}`,
                style: themeVariables,
            },
            {
                'on:click': [
                    (e) => {
                        return props.onClick?.(e);
                    },
                ],
                'on:contextmenu': [
                    (e) => {
                        return props.onContextMenu?.(e);
                    },
                ],
                'on:longtap': [
                    (e) => {
                        return props.onLongtap?.(e);
                    },
                ],
                'on:mousedown': [
                    (e) => {
                        return props.onMouseDown?.(e);
                    },
                ],
                'on:mouseenter': [
                    (e) => {
                        return props.onMouseEnter?.(e);
                    },
                ],
                'on:mouseleave': [
                    (e) => {
                        return props.onMouseLeave?.(e);
                    },
                ],
                'on:mousemove': [
                    (e) => {
                        return props.onMouseMove?.(e);
                    },
                ],
                'on:mouseup': [
                    (e) => {
                        return props.onMouseUp?.(e);
                    },
                ],
                'on:swipe': [
                    (e) => {
                        return props.onSwipe?.(e);
                    },
                ],
                'on:touchmove': [
                    (e) => {
                        return props.onTouchMove?.(e);
                    },
                ],
                'on:wheel': [
                    (e) => {
                        return props.onWheel?.(e);
                    },
                ],
            },
            props.context
        );
    };

    return getContent();
}

export default React.forwardRef(Wrapper);

/**
 * @name Controls/_themes/Wrapper#variables
 * @cfg {Object} Хэш-мэп, в котором ключами являются названия переменных, а значениями - значения переменных
 * @example
 * Установлен доминантный цвет
 * <pre>
 *    <Controls.themes:Wrapper variables="{{ {'--primary_text-color': 'pink'} }}">
 *      <ws:partial template="MyModule/someContent" />
 *    </Controls.themes:Wrapper>
 * </pre>
 * @see option complementaryColor
 */
