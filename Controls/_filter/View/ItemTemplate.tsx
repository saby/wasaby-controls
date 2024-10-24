import * as React from 'react';
import { IControlProps } from '../../_interface/IControlProps';

interface IItemTemplateProps extends IControlProps {
    text: string;
    title: string;
    alignment?: 'right' | 'left';
    beforeContentTemplate?: React.ReactElement;
    contentTemplate?: React.ReactElement;
    itemName?: string;
    moreText?: string;
}

const DefaultBeforeTpl = function getDefaultBeforeTpl(
    props: Partial<IItemTemplateProps>
): React.ReactElement {
    return (
        <div
            className={`icon-DayForward controls-FilterView__iconArrow
               controls-FilterView-${props.alignment}__iconArrow
               controls-FilterView__iconArrow_state_${props.readOnly ? 'readOnly' : 'enabled'}`}
        ></div>
    );
};

export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    return (
        <div
            ref={ref}
            onMouseDown={props.onMouseDown}
            className={` ${props.className || props.attrs?.className} controls_filter_theme-${
                props.theme
            } controls-FilterView__block ${
                props.beforeContentTemplate === null
                    ? 'controls-FilterView__block-withoutArrow'
                    : 'controls-FilterView__block-withArrow'
            }`}
            data-qa="FilterView__block"
        >
            {props.beforeContentTemplate !== undefined ? (
                props.beforeContentTemplate ? (
                    <props.beforeContentTemplate />
                ) : null
            ) : (
                <DefaultBeforeTpl alignment={props.alignment} readOnly={props.readOnly} />
            )}
            {props.contentTemplate ? (
                <props.contentTemplate {...props} className="js-controls-FilterView__target" />
            ) : (
                <div
                    className={`controls-FilterView__text-wrapper
                  js-controls-FilterView__target
                  controls-FilterView__text_state_${props.readOnly ? 'readOnly' : 'enabled'}`}
                    title={props.title}
                    name={props.itemName}
                >
                    <div className="controls-FilterView__text">{props.text}</div>
                    {props.moreText ? (
                        <span className="controls-FilterView__hasMoreText">{props.moreText}</span>
                    ) : null}
                </div>
            )}
        </div>
    );
});
