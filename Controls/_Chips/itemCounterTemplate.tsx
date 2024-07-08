import * as React from 'react';
import { default as ItemTemplate, IContentTemplateOptions, IItemTemplateProps, } from './itemTemplate';

export interface IItemCounterTemplateProps extends IItemTemplateProps {
    counterProperty?: string;
    counterStyle?: string;
}

export default React.forwardRef(function itemCounterTemplate(props: IItemTemplateProps, ref) {
    return (
        <ItemTemplate
            ref={ref}
            item={props.item}
            fontSize={props.fontSize}
            displayProperty={props.displayProperty}
            selected={props.selected}
            className={props.className}
            contentTemplate={(contentTemplateProps: IContentTemplateOptions) => {
                return (
                    <>
                        {contentTemplateProps.captionTemplate}
                        {props.item.get(props.counterProperty || 'counter') ? (
                            <span
                                className={
                                    (props.caption ||
                                    props.item.get(props.displayProperty || 'title') ||
                                    props.item.get('caption')
                                        ? 'controls-margin_left-2xs '
                                        : '') +
                                    'controls-ButtonGroup__button-counter' +
                                    (props.counterStyle && !props.selected
                                        ? ' controls-text-' + props.counterStyle
                                        : '')
                                }
                            >
                                {props.item.get(props.counterProperty || 'counter')}
                            </span>
                        ) : null}
                    </>
                );
            }}
        />
    );
});
