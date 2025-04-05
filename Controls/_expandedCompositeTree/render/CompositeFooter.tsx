import { ReactElement, forwardRef, ForwardedRef, ReactNode } from 'react';
import { MoreButton } from 'Controls/extButtons';
import { IPadding } from 'Controls/interface';
import { FooterTemplate, IColumnTemplateProps } from 'Controls/gridRender';

export const CompositeFooter = forwardRef(function CompositeFooter(
    props: {
        children?: ReactNode;
        itemPadding?: IPadding;
    },
    ref: ForwardedRef<HTMLDivElement>
): ReactElement {
    const className = `controls-ExpandedCompositeTree-footer
            controls-padding_top-${props.itemPadding?.top}
            controls-padding_bottom-${props.itemPadding?.bottom}`;
    return (
        <div ref={ref} className={className}>
            <MoreButton
                className="controls-ExpandedCompositeTree-footer_moreButton"
                count="..."
                fontSize="l"
            />
        </div>
    );
});

export const GridCompatibleCompositeFooter = forwardRef(function GridExpandedCompositeFooter(
    props: IColumnTemplateProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    return <FooterTemplate {...props} forwardedRef={ref} contentTemplate={CompositeFooter} />;
});
