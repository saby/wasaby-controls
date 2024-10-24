import * as React from 'react';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { InfoboxTarget } from 'Controls/popupTargets';
import { getWasabyContext, useReadonly } from 'UI/Contexts';

interface IItemTemplateOptions extends IControlOptions {
    onClick: React.MouseEventHandler;
    onMouseDown: React.MouseEventHandler;
    onMouseMove: React.MouseEventHandler;
    onMouseLeave: React.MouseEventHandler;
    onTouchStart: React.TouchEventHandler;
    buttonClass: string;
    buttonTemplate: TemplateFunction;
    item: Model;
    itemsSpacing: string;
    direction: 'vertical' | 'horizontal';
    isFirstItem: boolean;
    hintTextProperty?: string;
    hintBackgroundStyleProperty?: string;
    hintBorderStyleProperty?: string;
    buttonTemplateOptions: {
        readOnly?: boolean;
    };
}

interface IInnerItemContentProps {
    onItemClick: React.MouseEventHandler;
    onClick: React.MouseEventHandler;
    onItemMouseDown: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onItemMouseMove: React.MouseEventHandler;
    onMouseMove?: React.MouseEventHandler;
    onItemTouchStart: React.TouchEventHandler;
    onTouchStart?: React.TouchEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    classes: string;
    attrs: Record<string, unknown>;
    item: Model;
    buttonTemplate: Function;
    buttonClass: string;
    buttonTemplateOptions: object;
}

const ItemContentTemplate = React.forwardRef(function ItemContent(
    props: IInnerItemContentProps,
    forwardedRef: React.ForwardedRef<HTMLElement>
) {
    const context = React.useContext(getWasabyContext());
    const readOnly = useReadonly(props);

    const contentMouseEventHandlers = {
        onMouseDown: (event: React.MouseEvent) => {
            if (props.onMouseDown) {
                props.onMouseDown(event);
            }
            if (props.onItemMouseDown) {
                props.onItemMouseDown(event);
            }
        },
        onMouseMove: (event: React.MouseEvent) => {
            if (props.onMouseMove) {
                props.onMouseMove(event);
            }
            if (props.onItemMouseMove) {
                props.onItemMouseMove(event);
            }
        },
        onMouseLeave: (event: React.MouseEvent) => {
            if (props.onMouseLeave) {
                props.onMouseLeave(event);
            }
            if (props.onItemMouseLeave) {
                props.onItemMouseLeave(event);
            }
        },
        onTouchStart: (event: React.TouchEvent) => {
            if (props.onTouchStart) {
                props.onTouchStart(event);
            }
            if (props.onItemTouchStart) {
                props.onItemTouchStart(event);
            }
        },
        onClick: (event: React.TouchEvent) => {
            if (props.onClick) {
                props.onClick(event);
            }
            if (props.onItemClick) {
                props.onItemClick(event);
            }
        },
    };

    const focusedClass = React.useMemo(() => {
        const highlightOnFocus = context.workByKeyboard && !readOnly;
        if (highlightOnFocus) {
            if (
                props.buttonTemplateOptions.viewMode === 'link' ||
                props.buttonTemplateOptions.viewMode === 'linkButton'
            ) {
                return ' controls-focused-item_background controls-focused-item_text-decoration';
            } else {
                return ' controls-focused-item_shadow';
            }
        }
        return '';
    }, []);

    return (
        <div
            {...props.attrs}
            ref={forwardedRef}
            {...contentMouseEventHandlers}
            className={props.classes}
            title={props.item.get('tooltip')}
        >
            <props.buttonTemplate
                {...props.buttonTemplateOptions}
                className={`controls-Toolbar__button ${props.buttonClass || ''}${focusedClass}${
                    props.buttonTemplateOptions._viewMode === 'icon' ||
                    props.buttonTemplateOptions._viewMode === 'iconToolbar'
                        ? ' controls-Toolbar_iconButton-style'
                        : ''
                }`}
                onClick={props.onItemClick}
            />
        </div>
    );
});

export default React.forwardRef(function (
    props: IItemTemplateOptions,
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const attrs = wasabyAttrsToReactDom(props.attrs || {});
    const classes = `controls-Toolbar__item controls-Toolbar__item${
        props.buttonTemplateOptions.readOnly ? '_readOnly' : ''
    } ${
        !props.isFirstItem
            ? 'controls-Toolbar__item_' + props.direction + '-spacing_' + props.itemsSpacing
            : ''
    } ${attrs.className || ''}`;
    return props.hintTextProperty && props.item.get(props.hintTextProperty) ? (
        <InfoboxTarget
            ref={forwardedRef}
            borderStyle={props.item.get(props.hintBorderStyleProperty)}
            backgroundStyle={props.item.get(props.hintBackgroundStyleProperty)}
            template={(innerProps) => {
                return (
                    <div className={innerProps.className}>
                        {props.item.get(props.hintTextProperty)}
                    </div>
                );
            }}
        >
            <ItemContentTemplate
                attrs={attrs}
                classes={classes}
                buttonTemplate={props.buttonTemplate}
                buttonTemplateOptions={props.buttonTemplateOptions}
                item={props.item}
                onItemClick={props.onClick}
                onItemMouseDown={props.onMouseDown}
                onItemMouseMove={props.onMouseMove}
                onItemTouchStart={props.onTouchStart}
                onItemMouseLeave={props.onMouseLeave}
            />
        </InfoboxTarget>
    ) : (
        <ItemContentTemplate
            attrs={attrs}
            classes={classes}
            buttonTemplate={props.buttonTemplate}
            buttonTemplateOptions={props.buttonTemplateOptions}
            item={props.item}
            ref={forwardedRef}
            onItemClick={props.onClick}
            onItemMouseDown={props.onMouseDown}
            onItemMouseMove={props.onMouseMove}
            onItemTouchStart={props.onTouchStart}
            onItemMouseLeave={props.onMouseLeave}
        />
    );
});
