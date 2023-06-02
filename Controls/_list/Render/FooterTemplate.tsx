import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import type { Footer as FooterItem } from 'Controls/display';

export interface IProps extends TInternalProps {
    content?: React.ReactElement;
    contentTemplate?: React.ReactElement;

    item: FooterItem;
    subPixelArtifactFix: boolean;
    pixelRatioBugFix: boolean;
    needItemActionsSpacing: boolean;
    className: string;

    height?: 'auto' | 'default';
}

function FooterTemplate(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const FooterContent = props.content || props.contentTemplate;

    let className =
        'controls-ListView__footer__user-content' +
        `-height_${
            !props.needItemActionsSpacing && props.height === 'auto'
                ? 'auto'
                : 'default'
        }`;
    if (props.attrs?.className || props.className) {
        className += ` ${props.attrs?.className || props.className}`;
    }
    const attrs = { ...props.attrs };
    const footerContentProps = {
        forwardedRef: ref,
        item: props.item,
        subPixelArtifactFix: props.subPixelArtifactFix,
        pixelRatioBugFix: props.pixelRatioBugFix,
        className,
        attrs
    };

    return (
        <FooterContent {...footerContentProps}/>
    );
}

export default React.forwardRef(FooterTemplate);

/**
 * Футер списка
 * @class Controls/_list/Render/FooterTemplate
 * @public
 */

/**
 * Настройка высоты футера.
 * Значение *default* - По умолчанию, устанавливается минимальная высота футера и выравнивание текста по базовой линии.
 * Значение *auto* - Не выставляется высота футера и выравнивание текста по базовой линии.
 * @name Controls/_list/Render/FooterTemplate#height
 * @cfg {String}
 */
