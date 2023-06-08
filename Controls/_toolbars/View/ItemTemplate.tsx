import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

interface IItemTemplateOptions extends IControlOptions {
    onClick: (event: Event) => void;
    onMouseDown: (event: Event) => void;
    onMouseMove: (event: Event) => void;
    onMouseLeave: (event: Event) => void;
    onTouchStart: (event: Event) => void;
    buttonClass: string;
    buttonTemplate: TemplateFunction;
    item: Model;
    itemsSpacing: string;
    direction: 'vertical' | 'horizontal';
    isFirstItem: boolean;
    buttonTemplateOptions: {
        readOnly?: boolean;
    };
}

export default React.forwardRef(function (
    props: IItemTemplateOptions,
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const attrs = wasabyAttrsToReactDom(props.attrs || {});
    const classes = `controls-Toolbar__item${
        props.buttonTemplateOptions.readOnly ? '_readOnly' : ''
    } ${
        !props.isFirstItem
            ? 'controls-Toolbar__item_' +
              props.direction +
              '-spacing_' +
              props.itemsSpacing
            : ''
    } ${attrs.className || ''}`;
    return (
        <div
            ref={forwardedRef}
            {...attrs}
            onMouseDown={props.onMouseDown}
            onMouseMove={props.onMouseMove}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            className={classes}
            title={props.item.get('tooltip')}
        >
            <props.buttonTemplate
                {...props.buttonTemplateOptions}
                className={`controls-Toolbar__button ${
                    props.buttonClass || ''
                }`}
                onClick={(event) => {
                    return props.onClick(event);
                }}
            />
        </div>
    );
});
