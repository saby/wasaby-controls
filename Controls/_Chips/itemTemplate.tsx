import * as React from 'react';
import { FocusRoot } from 'UI/Focus';
import { Model } from 'Types/entity';

export interface IContentTemplateOptions {
    selected: string;
    captionTemplate: React.ReactElement;
    item: Model;
    className?: string;
}

export interface IItemTemplateProps {
    item: Model;
    displayProperty: string;
    contentTemplate?: React.ReactElement<IContentTemplateOptions>;
    selected?: boolean;
    fontSize: string;
    caption?: string;
    className?: string;
}

const CaptionTemplate = React.forwardRef((props: IItemTemplateProps, ref) => {
    return (
        <FocusRoot
            as="span"
            ref={ref}
            className={`controls-ButtonGroup__button-caption controls-fontsize-${props.fontSize}` +
                ` ${props.className || ''}`}
        >
        {props.caption ||
            props.item.get(props.displayProperty || 'title') ||
            props.item.get('caption')}
    </FocusRoot>
    );
});

export default React.forwardRef(function itemTemplate(props: IItemTemplateProps, ref) {
    return props.contentTemplate ? (
        <props.contentTemplate
            selected={props.selected}
            item={props.item}
            className={props.className}
            captionTemplate={
                <CaptionTemplate
                    ref={ref}
                    item={props.item}
                    fontSize={props.fontSize}
                    displayProperty={props.displayProperty}
                />
            }
        />
    ) : (
        <CaptionTemplate
            ref={ref}
            item={props.item}
            displayProperty={props.displayProperty}
            fontSize={props.fontSize}
            className={props.className}
        />
    );
});
