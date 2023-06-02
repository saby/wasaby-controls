/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { ILookupEditorOptions } from './_BaseLookup';
import BaseEditor from '../../BaseEditor';
import FrequentItem from '../resources/FrequentItem';
import SelectionContainer from '../SelectionContainer';
import Async from 'Controls/Container/Async';
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора поля ввода с выбором значений из справочника.
 * @class Controls/_filterPanel/Editors/LookupInput
 * @extends UI/Base:Control
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

const ItemTemplate = React.forwardRef((props: ILookupEditorOptions, ref) => {
    if (props.itemTemplate) {
        return <props.itemTemplate size={props.fontSize} {...props} />;
    } else {
        const templateOptions = {
            size: props.fontSize,
            ...props,
        };
        return (
            <Async
                attrs={props.attrs}
                onClick={props.onClick}
                templateName="Controls/lookup:ItemTemplate"
                templateOptions={templateOptions}
            />
        );
    }
});

const EditorTemplate = React.forwardRef(
    (props: ILookupEditorOptions, ref: React.ForwardedRef<unknown>) => {
        const templateOptions = {
            name: 'lookupEditor',
            ...props,
            suggestTemplate: props.suggestTemplate,
            items: props.items,
            fontColorStyle: props.fontColorStyle || 'default',
            style: 'filterPanel',
            itemTemplate: (contentProps) => {
                return (
                    <ItemTemplate
                        {...contentProps}
                        itemTemplate={props.itemTemplate}
                        fontSize={props.fontSize}
                    />
                );
            },
        };
        return (
            <SelectionContainer
                ref={ref}
                propertyValue={props.propertyValue}
                multiSelect={props.multiSelect}
                content={(contentProps) => {
                    return (
                        <Async
                            data-qa={props.dataQa}
                            onItemsChanged={props.onItemschanged}
                            customEvents={['onItemsChanged']}
                            className="controls-LookupInputEditor"
                            templateName="Controls/lookup:Input"
                            templateOptions={{
                                ...templateOptions,
                                ...contentProps,
                            }}
                        />
                    );
                }}
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
            extendedCaption={props.extendedCaption}
            frequentItemText={props.frequentItemText}
            frequentItemKey={props.frequentItemKey}
            fastDataQa="controls-FilterViewPanel__LookupEditor-fastItem"
        />
    );
});

export default React.forwardRef(function LookupInputEditor(
    props: ILookupEditorOptions,
    ref: React.ForwardedRef<unknown>
) {
    const extendedTemplateOptions: IExtendedTemplateOptions = {
        extendedCaptionClickHandler: props.onExtendedCaptionClick || props.onExtendedcaptionclick,
        extendedCaption: props.extendedCaption,
        frequentItemText: props.frequentItemText,
        frequentItemKey: props.frequentItemKey,
    };
    return (
        <BaseEditor
            ref={ref}
            {...props}
            onResetClick={props.onResetclick}
            closeButtonVisible={false}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={{ ...props }}
            extendedTemplate={ExtendedTemplate}
            extendedTemplateOptions={extendedTemplateOptions}
        />
    );
});
