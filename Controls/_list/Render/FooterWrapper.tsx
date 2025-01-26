import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import type { Footer } from 'Controls/display';
import { StickyBlock } from 'Controls/stickyBlock';

export interface IProps extends TInternalProps {
    item: Footer;

    subPixelArtifactFix: boolean;
    pixelRatioBugFix: boolean;
    needItemActionsSpacing: boolean;
}

function FooterWrapper(props: IProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const FooterTemplate = props.item.getContentTemplate();
    const attrs = { ...props.attrs };
    const className = attrs?.className;
    const dataQA = attrs?.['data-qa'] ?? 'footer';

    if (props.item.isStickedToBottom()) {
        return (
            <StickyBlock
                position={'bottom'}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                backgroundStyle={props.item.getBackgroundStyle()}
                className={className}
                data-qa={dataQA}
            >
                <div>
                    <FooterTemplate item={props.item.contents} />
                </div>
            </StickyBlock>
        );
    }
    return (
        <div ref={ref} className={className} data-qa={dataQA}>
            <div className={'controls-ListView__footer__content'}>
                <FooterTemplate
                    item={props.item.contents}
                    needItemActionsSpacing={props.needItemActionsSpacing}
                    className={'controls-ListView__footer__user-content'}
                />
            </div>
        </div>
    );
}

export default React.forwardRef(FooterWrapper);

/**
 * Внутренняя обёртка шаблона футера списка.
 * @class Controls/_list/Render/FooterWrapper
 * @private
 */

/**
 * Модель записи списка
 * @name Controls/_list/Render/FooterWrapper#item
 * @cfg {Controls/display:Footer}
 */
