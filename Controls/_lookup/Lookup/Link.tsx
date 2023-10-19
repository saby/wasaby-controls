import { TInternalProps } from 'UICore/Executor';
import { __notifyFromReact } from 'UI/Events';
import * as React from 'react';
// import { FocusArea, FocusRoot } from 'UI/Focus';
import 'css!Controls/lookup';

export interface ILinkOptions extends TInternalProps {
    theme?: string;
    inlineHeight?: string;
    fontSize?: string;
    readOnly?: boolean;
    underline?: string;
    caption: string;
    onLinkClick?: (
        e: React.KeyboardEvent<HTMLSpanElement> | React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => void;
}

function Link(props: ILinkOptions, ref): JSX.Element {
    const linkRef = React.useRef(null);
    const setRefs = (element) => {
        linkRef.current = element;
        if (ref) {
            ref(element);
        }
    };

    const onClick = React.useCallback(
        (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            if (props.readOnly) {
                e.stopPropagation();
            } else if (props.onLinkClick) {
                props.onLinkClick(e);
            } else {
                // тут похоже попытка позвать _notify из реакта, так делать нельзя
                // это место работало только "потому-что"
                // const event = new Event('showselector', { bubbles: true });
                // linkRef.current.dispatchEvent(event);
                // временно заменяю на __notifyFromReact
                // но надо разобраться какую задачу пытались решить таким костылем
                __notifyFromReact(linkRef.current, 'showSelector', [], true);
            }
        },
        [props.readOnly, props.onLinkClick, linkRef]
    );

    const onMouseDown = React.useCallback((e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === 'Enter' && !props.readOnly) {
                props.onLinkclick(e);
            }
        },
        [props.readOnly, props.onLinkclick]
    );

    return (
        <span
            className={`controls_lookup_theme-${props.theme} controls-Lookup__link
                         controls-Lookup__link-inlineheight-${
                             props.inlineHeight ? props.inlineHeight : 'default'
                         }
                         controls-Lookup__link-${props.readOnly ? 'readOnly' : 'default'}
                         controls-fontsize-${props.fontSize} ${props.attrs?.className}`}
            style={props.attrs?.style}
            tabIndex={-1}
            data-qa={props.attrs?.['data-qa'] || 'Lookup__link'}
            ref={setRefs}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onKeyPress={onKeyPress}
        >
            <span
                className={`controls-Lookup__link__text
                            ${
                                props.underline && props.underline !== 'none' && !props.readOnly
                                    ? 'controls-Lookup__link_underline-' + props.underline
                                    : ''
                            }`}
            >
                {props.caption}
            </span>
        </span>
    );
}

/**
 * Кнопка-ссылка для использования внутри подсказки поля связи.
 * @class Controls/_lookup/Lookup/Link
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IUnderline
 *
 * @demo Controls-demo/Lookup/MultipleInputNew/MultipleInputNew
 *
 * @public
 */
const forwardedComponent = React.forwardRef(Link);

forwardedComponent.defaultProps = {
    fontSize: 'lookupLink',
    underline: 'fixed',
};

export default forwardedComponent;
