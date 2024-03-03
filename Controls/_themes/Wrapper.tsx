/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls/themes';

export interface IContentOptions {
    className?: string;
    style?: string;
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
    onKeyDown?: Function;
    onWheel?: Function;
}

export interface IWrapperOptions extends IControlProps {
    variables: Record<string, string>;
    children: React.ReactElement<IContentOptions>;
    content?: React.ReactElement<IContentOptions>;
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
    onKeyDown?: Function;
    onWheel?: Function;
}
/**
 * Контейнер для стилизации элементов. Позволяет переопределять любые css-переменные на своем корневом DOM-элементе.
 * @class Controls/_themes/Wrapper
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/themes/Wrapper/Index
 */

function Wrapper(props: IWrapperOptions, ref): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};

    if (!!props.content && !props.children) {
        throw new Error(
            'Нельзя передавать явно опцию content в tsx. Необходимо вставлять контент в React-стиле\n' +
                'https://dev.sbis.ru/page/knowledge-bases/babadcfb-cc27-4589-9b97-9200c2e399ee?article=19468b19-627e-4c36-a725-d98e391dc8b7'
        );
    }

    const className = `controls_themes__wrapper ${props.className || attrs.className} ${
        props.children?.props?.className || ''
    }`;
    let style = props.variables;
    if (attrs.style) {
        style = { ...style, ...attrs.style };
    }
    if (props.style) {
        style = { ...style, ...props.style };
    }
    const contentProps = {
        ref,
        ...props.contentOptions,
        ...attrs,
        className,
        readOnly: props.readOnly,
        style,
        attrs: {
            style,
            className,
        },
        onClick: (e) => {
            return props.onClick?.(e);
        },
        onContextMenu: (e) => {
            return props.onContextMenu?.(e);
        },
        onLongtap: (e) => {
            return props.onLongtap?.(e);
        },
        onMouseDown: (e) => {
            return props.onMouseDown?.(e);
        },
        onMouseEnter: (e) => {
            return props.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
            return props.onMouseLeave?.(e);
        },
        onMouseMove: (e) => {
            return props.onMouseMove?.(e);
        },
        onMouseUp: (e) => {
            return props.onMouseUp?.(e);
        },
        onSwipe: (e) => {
            return props.onSwipe?.(e);
        },
        onTouchMove: (e) => {
            return props.onTouchMove?.(e);
        },
        onWheel: (e) => {
            return props.onWheel?.(e);
        },
        onKeyDown: (e) => {
            return props.onKeyDown?.(e);
        },
        customEvents: ['onContextMenu', 'onSwipe', 'onLongtap'],
    };

    return React.cloneElement(props.children, contentProps);
}

const FRWrapper = React.forwardRef(Wrapper);
FRWrapper.displayName = 'Controls/themes:Wrapper';

export default FRWrapper;

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
