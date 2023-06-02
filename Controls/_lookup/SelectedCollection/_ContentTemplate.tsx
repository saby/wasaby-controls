import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import * as React from 'react';

export interface IContentTemplateOptions extends TInternalProps {
    fontColorStyle?: string;
    clickable?: boolean;
    tooltip?: string;
    caption?: string;
    size?: string;
    item: Model;
    displayProperty?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    theme?: string;
    fontWeight?: string;
}

function ContentTemplate(props: IContentTemplateOptions, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    return (
        <div className={`js-controls-SelectedCollection__item__caption
                        controls-SelectedCollection__item__caption
                        controls-text-${ props.fontColorStyle === 'accent' ? 'secondary' : props.fontColorStyle }
                        controls-SelectedCollection__item__caption-style-${ props.fontColorStyle }
                        controls-SelectedCollection__item__caption-style-${ props.fontWeight }
                        controls-SelectedCollection__item__caption-size-${ props.size }
                        ${ props.clickable ? 'controls-SelectedCollection__item__caption-clickable' : '' }
                        ${ props.className || props.attrs?.className }`}
            ref={ ref }
            title={ props.tooltip || props.caption || props.item.get(props.displayProperty || 'title') }
            data-qa="SelectedCollection__item__caption"
            onClick={ props.onClick }>
            { props.caption || props.item.get(props.displayProperty || 'title') }
        </div>
    );
}

export default React.forwardRef(ContentTemplate);
