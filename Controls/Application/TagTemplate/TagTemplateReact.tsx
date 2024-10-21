import * as React from 'react';
import { TTagStyle } from 'Controls/interface';

/**
 * Варианты размещения тега относительно родительского контейнера
 * @typedef Controls/Application/TagTemplate/TagTemplateReact/TTagTemplatePosition
 * @variant topRight Размещается в верхнем правом углу родительского контейнера.
 * @variant custom Произвольное размещение компонента.
 */
export type TTagTemplatePosition = 'topRight' | 'custom';

export interface IProps {
    tagStyle: TTagStyle;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    position?: TTagTemplatePosition;
    className?: string;
    tooltip?: string;
}

function TagTemplate(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    let className = `controls__tag_light tw-cursor-help controls__tag_light_style-${props.tagStyle}`;
    className += ` controls__tag_light_position_${props.position}`;
    if (props.className) {
        className += ` ${props.className}`;
    }
    return (
        <div
            ref={ref}
            className={className}
            data-qa={'controls-tag'}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            title={props.tooltip}
        />
    );
}

export default Object.assign(React.forwardRef(TagTemplate), {
    defaultProps: {
        position: 'topRight',
    },
});

/**
 * Компонент тега (Уголка)
 * @class Controls/Application/TagTemplate/TagTemplateReact
 * @public
 */

/**
 * Цветовой стиль тега. Поддерживается стандартная линейка стилей.
 * @name Controls/Application/TagTemplate/TagTemplateReact#tagStyle
 * @cfg {String}
 */

/**
 * Размещение тега относительно родитеслького контейнера.
 * @default topRight
 * @name Controls/Application/TagTemplate/TagTemplateReact#position
 * @cfg {Controls/Application/TagTemplate/TagTemplateReact/TTagTemplatePosition.typedef}
 */

/**
 * Обработчик клика по тегу
 * @name Controls/Application/TagTemplate/TagTemplateReact#onClick
 * @cfg {Function}
 */

/**
 * Обработчик ховера по тегу
 * @name Controls/Application/TagTemplate/TagTemplateReact#onMouseEnter
 * @cfg {Function}
 */

/**
 * Всплывающая подсказка при наведении на тег
 * @name Controls/Application/TagTemplate/TagTemplateReact#tooltip
 * @cfg {String}
 */
