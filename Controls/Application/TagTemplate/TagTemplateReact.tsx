import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { delimitProps } from 'UICore/Jsx';

interface IProps extends TInternalProps {
    tagStyle: string;
    onClick?: (event: React.BaseSyntheticEvent) => void;
    onMouseEnter?: (event: React.BaseSyntheticEvent) => void;
    className?: string;
}

function TagTemplate(props: IProps, ref: React.ForwardedRef<SVGSVGElement>): JSX.Element {
    const { userAttrs } = delimitProps(props);
    if (userAttrs && userAttrs.className) {
        delete userAttrs.className;
    }
    let className = `controls__tag controls__tag tw-cursor-help controls__tag_style-${props.tagStyle}`;
    if (props.className) {
        className += ` ${props.className}`;
    }
    return (
        <svg
            {...userAttrs}
            ref={ref}
            className={className}
            data-qa={'controls-tag'}
            name={'tag'}
            viewBox={'0 0 1 1'}
            xmlns={'http://www.w3.org/2000/svg'}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
        >
            {userAttrs?.title && <title>{userAttrs.title}</title>}
            <polygon points={'0,0 1,1 1,0'} />
        </svg>
    );
}

export default React.forwardRef(TagTemplate);

/**
 * Шаблон тега (Уголка)
 * @class Controls/Application/TagTemplate/TagTemplateReact
 * @public
 */

/**
 * @name Controls/Application/TagTemplate/TagTemplateReact#tagStyle
 * @cfg {String} Цветовой стиль тега. Поддерживается стандартная линейка стилей.
 */
