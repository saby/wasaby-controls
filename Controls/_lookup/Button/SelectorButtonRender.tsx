import { TInternalProps } from 'UICore/Executor';
import { default as SelectedCollection } from 'Controls/_lookup/SelectedCollection';
import { Button } from 'Controls/buttons';
import { TFontSize } from 'Controls/interface';
import { TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as rk from 'i18n!Controls';
import { Model } from 'Types/entity';
import { Component, MouseEventHandler, ForwardedRef, forwardRef, useCallback } from 'react';
import { default as itemTemplateDefault } from 'Controls/_lookup/SelectedCollection/ItemTemplate';
import {useContent} from 'UICore/Jsx';

export interface ISelectorButtonOptions extends TInternalProps {
    theme: string;
    items: RecordSet;
    validationStatus?: string;
    maxVisibleItems?: number;
    inlineHeight?: string;
    collectionClass?: string;
    counterVisibility?: string;
    displayProperty?: string;
    multiSelect?: boolean;
    fontSize?: TFontSize;
    readOnly?: boolean;
    showClearButton?: boolean;
    itemTemplate: Component | TemplateFunction;
    clearButtonTemplate?: Component | TemplateFunction;
    itemsCount?: number;
    fontColorStyle?: string;
    showSelectorCaption?: string;
    selectorCaptionFontSize?: string;
    caption?: string;
    buttonStyle?: string;
    class?: string;
    style?: string;
    dataQa?: string;
    className?: string;
    itemClickHandler: (event: Event, item: Model) => void;
    resetHandler?: MouseEventHandler<HTMLSpanElement>;
    removeItemHandler?: (event: Event, item: Model) => void;
    openInfoBoxHandler?: MouseEventHandler<HTMLSpanElement>;
    closeInfoboxHandler?: MouseEventHandler<HTMLSpanElement>;
    showSelectorHandler?: MouseEventHandler<HTMLSpanElement>;
    onClick?: MouseEventHandler<HTMLSpanElement>;
}

function InnerItemTemplate(outerProps, props): JSX.Element {
    const innerClassName =
        !props.readOnly && !props.multiSelect
            ? 'controls-Selectorbutton_selectedItem_single_fontColorStyle-' + props.fontColorStyle
            : '';
    const fontColorStyle =
        outerProps.fontColorStyle ||
        (!props.readOnly && !props.multiSelect) ||
        props.fontColorStyle !== 'link'
            ? props.fontColorStyle
            : 'default';
    const resultProps = {
        inlineHeight: props.inlineHeight,
        collectionClass: props.collectionClass,
        clickable: !props.multiSelect && !props.readOnly,
        ...outerProps,
        fontColorStyle,
        className: `${innerClassName} ${outerProps.className}`,
    };

    return <props.itemTemplate {...resultProps} />;
}

function ResetButton(
    ClearButtonTemplate: Component | TemplateFunction,
    resetHandler: MouseEventHandler<HTMLSpanElement>
): JSX.Element {
    let resetButton;
    if (ClearButtonTemplate) {
        resetButton = <ClearButtonTemplate />;
    } else {
        resetButton = (
            <span
                onClick={resetHandler}
                className="controls-Selectorbutton__button-reset"
                data-qa="Selectorbutton__button-reset"
            >
                {rk('Очистить')}
            </span>
        );
    }
    return resetButton;
}

function InnerContent(props: ISelectorButtonOptions, ref): JSX.Element {
    const onItemClick = useCallback(
        (item, event) => props.itemClickHandler(event, item),
        [props.itemClickHandler]
    );
    const onCrossClick = useCallback(
        (item, event) => props.removeItemHandler(event, item),
        [props.removeItemHandler]
    );
    const itemTemplate = useContent(
        (outerProps) => InnerItemTemplate(outerProps, props),
        [props.readOnly, props.multiSelect, props.fontColorStyle, props.inlineHeight, props.className, props.items]
    );

    if (props.items.getCount()) {
        return (
            <>
                <SelectedCollection
                    items={props.items}
                    maxVisibleItems={props.maxVisibleItems}
                    itemsCount={props.itemsCount}
                    inlineHeight={props.inlineHeight}
                    collectionClass={props.collectionClass}
                    counterVisibility={props.counterVisibility}
                    displayProperty={props.displayProperty}
                    multiLine={props.multiSelect}
                    clickable={true}
                    fontSize={props.fontSize}
                    itemTemplate={itemTemplate}
                    className={`${
                        !props.readOnly && props.multiSelect
                            ? 'controls-Selectorbutton_selectedCollection_multiSelect'
                            : ''
                    }`}
                    onItemClick={onItemClick}
                    onCrossClick={onCrossClick}
                    onOpenInfoBox={props.openInfoBoxHandler}
                    onCloseInfobox={props.closeInfoboxHandler}
                    customEvents={[
                        'onItemClick',
                        'onCrossClick',
                        'onOpenInfoBox',
                        'onCloseInfobox',
                    ]}
                ></SelectedCollection>
                {props.multiSelect && !props.readOnly && props.showSelectorCaption ? (
                    <span
                        className={`controls-Selectorbutton_button-more 
                                      controls-Selectorbutton_button-more_fontsize-${props.selectorCaptionFontSize}`}
                        onClick={props.showSelectorHandler}
                        data-qa="Selectorbutton_button-more"
                    >
                        {props.showSelectorCaption}
                    </span>
                ) : (
                    ''
                )}
                {(props.itemsCount > 1 || props.clearButtonTemplate) &&
                !props.readOnly &&
                props.showClearButton
                    ? ResetButton(props.clearButtonTemplate, props.resetHandler)
                    : ''}
            </>
        );
    } else {
        return props.readOnly ? (
            <span
                className={`${
                    props.fontColorStyle === 'link'
                        ? 'controls-Selectorbutton_button-select_readOnly'
                        : 'controls-text-' + props.fontColorStyle
                }
                                   controls-fontsize-${props.fontSize} ws-ellipsis`}
            >
                {props.caption}
            </span>
        ) : (
            <Button
                className="controls-Selectorbutton_link"
                viewMode="link"
                caption={props.caption}
                fontColorStyle={props.fontColorStyle}
                fontSize={props.fontSize}
                buttonStyle={props.buttonStyle}
                style={props.style}
                onClick={props.showSelectorHandler}
                data-qa="Selectorbutton_link"
            />
        );
    }
}

function SelectorButtonRender(
    props: ISelectorButtonOptions,
    ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div
            ref={ref}
            onClick={props.onClick}
            data-qa={props.attrs?.['data-qa']}
            className={`controls_lookup_theme-${props.theme} ${props.className}
                        controls-Selectorbutton ${
                            props.items.getCount() === 0 ? ' controls-Selectorbutton_empty' : ''
                        }
                        ${props.validationStatus !== 'valid' ? ' controls-invalid-container' : ''}`}
        >
            <InnerContent {...props} />
            {props.validationStatus !== 'valid' ? (
                <div
                    className={`controls-invalid-border controls-${props.validationStatus}-border`}
                ></div>
            ) : (
                ''
            )}
        </div>
    );
}

const forwardedComponent = forwardRef(SelectorButtonRender);

forwardedComponent.defaultProps = {
    itemTemplate: itemTemplateDefault,
};

export default forwardedComponent;
