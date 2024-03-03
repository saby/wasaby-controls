/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { ILookupEditorOptions } from './_BaseLookup';
import { BaseEditor } from 'Controls/filterPanel';
import FrequentItem from 'Controls/_filterPanelEditors/FrequentItem/FrequentItem';
import SelectionContainer from '../SelectionContainer';
import Async from 'Controls/Container/Async';
import EditorChooser from '../EditorChooser';
import 'css!Controls/filterPanelEditors';

/**
 * Контрол используют в качестве редактора поле ввода с выбором значений из справочника.
 * @class Controls/_filterPanel/Editors/LookupInput
 * @mixes Controls/_filterPanel/Editors/Lookup/interface/ILookupEditor
 * @demo Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index
 * @public
 */

interface IExtendedTemplateOptions {
    extendedCaptionClickHandler: Function;
    extendedCaption?: string;
    frequentItemText?: string;
    frequentItemKey?: string;
}

const ContentTemplateLookup = React.forwardRef((props, ref) => {
    const targetRef = React.useRef();
    const setRefs = (element) => {
        targetRef.current = element;
        if (ref) {
            ref(element);
        }
    };
    return (
        <Async
            data-qa={props.dataQa}
            onItemsChanged={props.onItemsChanged}
            onTextValueChanged={props.onTextValueChanged}
            onItemClick={props.onItemClick}
            onClick={() => {
                props.onLookupClick(targetRef.current);
            }}
            customEvents={['onItemsChanged', 'onTextValueChanged', 'onItemClick']}
            templateName="Controls/lookup:Selector"
            templateOptions={{
                ref: setRefs,
                ...props,
                className: `controls-FilterViewPanel__basicEditor-cloud
                        controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}
                        controls-LookupEditor`,
            }}
        />
    );
});

const EditorTemplate = React.forwardRef(
    (props: ILookupEditorOptions, ref: React.ForwardedRef<unknown>) => {
        const itemTemplate = React.useCallback(
            (contentProps) => {
                return (
                    <div
                        {...contentProps.attrs}
                        data-qa={contentProps['data-qa']}
                        className={`${contentProps.className} controls-LookupEditor__item controls-fontsize-${props.fontSize} controls-text-${props.fontColorStyle}`}
                        title={props.textValue}
                    >
                        {contentProps.caption ||
                            contentProps.item.get(props.displayProperty || 'title')}
                        {!contentProps.isLastItem ? ', ' : ''}
                    </div>
                );
            },
            [props.displayProperty, props.textValue, props.fontSize, props.fontColorStyle]
        );

        const templateOptions = {
            name: 'lookupEditor',
            ...props,
            fontColorStyle: props.fontColorStyle || 'default',
            style: 'filterPanel',
            counterVisibility: 'hidden',
            maxVisibleItems: 20,
            readOnly: true,
            inlineHeight: 's',
            collectionClass: 'ws-line-clamp ws-line-clamp_3 controls-LookupEditor__collection',
            itemTemplate,
        };
        return (
            <SelectionContainer
                ref={ref}
                contentProps={templateOptions}
                propertyValue={props.propertyValue}
                multiSelect={props.multiSelect}
                content={ContentTemplateLookup}
            ></SelectionContainer>
        );
    }
);

const ExtendedTemplate = React.forwardRef(function getExtendedTemplate(
    props: IExtendedTemplateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    return (
        <FrequentItem
            ref={props.forwardedRef}
            attrs={props.attrs}
            onExtendedCaptionClick={props.extendedCaptionClickHandler}
            onPropertyValueChanged={props.onPropertyValueChanged}
            extendedCaption={props.extendedCaption}
            frequentItemText={props.frequentItemText}
            frequentItemKey={props.frequentItemKey}
            fastDataQa="controls-FilterViewPanel__LookupSelectorEditor-fastItem"
        />
    );
});

export default React.forwardRef(function LookupSelectorEditor(
    props: ILookupEditorOptions,
    ref: React.ForwardedRef<unknown>
) {
    const extendedTemplateOptions: IExtendedTemplateOptions = {
        extendedCaptionClickHandler: props.onExtendedCaptionClick,
        onPropertyValueChanged: props.onPropertyValueChanged,
        extendedCaption: props.extendedCaption,
        frequentItemText: props.frequentItemText,
        frequentItemKey: props.frequentItemKey,
    };
    return (
        <EditorChooser {...props} ref={ref}>
            <BaseEditor
                ref={ref}
                attrs={{
                    ...props.attrs,
                    className: `${props.attrs?.className} ${
                        props.viewMode === 'basic' ? ' controls-LookupEditor-container' : ''
                    }`,
                }}
                propertyValue={props.propertyValue}
                resetValue={props.resetValue}
                viewMode={props.viewMode}
                extendedCaption={props.extendedCaption}
                onPropertyValueChanged={props.onPropertyValueChanged}
                closeButtonVisible={props.closeButtonVisible}
                onResetClick={props.onResetClick}
                editorTemplate={EditorTemplate}
                editorTemplateOptions={props}
                extendedTemplate={ExtendedTemplate}
                extendedTemplateOptions={extendedTemplateOptions}
            />
        </EditorChooser>
    );
});
