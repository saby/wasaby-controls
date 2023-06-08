import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import BaseEditor from '../BaseEditor';
import Async from 'Controls/Container/Async';
import 'css!Controls/filterPanel';
import { Range } from 'Controls/dateUtils';
import IEditorOptions from 'Controls/_filterPanel/_interface/IEditorOptions';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IDateOptions extends IEditorOptions<Date> {
    mask?: string;
    fontColorStyle: string;
    fontSize: string;
    datePopupType: string;
    filterViewMode?: string;
}

interface IDateTemplateOptions extends IDateOptions {
    dateTemplate?: string;
    valueChangedHandler: Function;
}

const DateTemplate = React.forwardRef((props: IDateTemplateOptions, ref) => {
    const templateOptions = {
        value: props.propertyValue,
        emptyCaption: props.extendedCaption,
        fontWeight: 'default',
        fontColorStyle: props.fontColorStyle || 'default',
        fontSize: props.fontSize,
        datePopupType: props.datePopupType,
        onValueChanged: (event, value) => {
            props.valueChangedHandler(event, value);
        },
        forwardedRef: props.forwardedRef,
    };

    return (
        <Async
            {...props.attrs}
            className={`${props.attrs?.className} controls-FilterViewPanel__dateEditor`}
            templateName={props.dateTemplate}
            templateOptions={templateOptions}
        />
    );
});

const mask = Range.dateMaskConstants.DD_MM_YY;

export default React.forwardRef(function Date(
    props: IDateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const getTextValue = (value: Date) => {
        const stringValueConverterClass = loadSync('Controls/date').StringValueConverter;
        const stringValueConverter = new stringValueConverterClass();
        return stringValueConverter.getStringByValue(value, props.mask || mask);
    };

    const propertyValueChanged = (event: SyntheticEvent, newValue: Date) => {
        const extendedValue = {
            value: newValue,
            textValue: getTextValue(newValue),
            viewMode: 'basic',
        };
        (props.onPropertyValueChanged || props.onPropertyvaluechanged)?.(event, extendedValue);
    };

    return (
        <BaseEditor
            {...props}
            ref={ref}
            onExtendedCaptionClick={(event) => {
                propertyValueChanged(event, null);
            }}
            editorTemplate={DateTemplate}
            editorTemplateOptions={{
                ...props,
                attrs: {
                    className: `controls-FilterViewPanel__basicEditor-cloud
                     controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`,
                },
                dateTemplate: 'Controls/date:Input',
                valueChangedHandler: propertyValueChanged,
            }}
            extendedTemplate={DateTemplate}
            extendedTemplateOptions={{
                propertyValue: props.propertyValue,
                extendedCaption: props.extendedCaption,
                fontColorStyle: props.fontColorStyle,
                fontSize: props.fontSize,
                datePopupType: props.datePopupType,
                dateTemplate: 'Controls/date:Selector',
                valueChangedHandler: propertyValueChanged,
            }}
        />
    );
});
