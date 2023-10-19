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

function getTextValue(value: Date, mask): string {
    const stringValueConverterClass = loadSync('Controls/date').StringValueConverter;
    const stringValueConverter = new stringValueConverterClass();
    return stringValueConverter.getStringByValue(value, mask);
}

const mask = Range.dateMaskConstants.DD_MM_YY;

export default React.forwardRef(function Date(
    props: IDateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const propertyValueChanged = React.useCallback(
        (event: SyntheticEvent, newValue: Date) => {
            const extendedValue = {
                value: newValue,
                textValue: getTextValue(newValue, props.mask || mask),
                viewMode: 'basic',
            };
            props.onPropertyValueChanged?.(event, extendedValue);
        },
        [props.onPropertyValueChanged, props.mask]
    );

    const templateOptions = React.useMemo(() => {
        return {
            propertyValue: props.propertyValue,
            extendedCaption: props.extendedCaption,
            fontColorStyle: props.fontColorStyle,
            fontSize: props.fontSize,
            datePopupType: props.datePopupType,
            dateTemplate: 'Controls/date:Selector',
            valueChangedHandler: propertyValueChanged,
        };
    }, [
        props.propertyValue,
        props.extendedCaption,
        props.fontColorStyle,
        props.fontSize,
        props.datePopupType,
        propertyValueChanged,
    ]);

    const editorTemplateOptions = React.useMemo(() => {
        return {
            ...templateOptions,
            attrs: {
                className: `controls-FilterViewPanel__basicEditor-cloud
                     controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`,
            },
            dateTemplate: 'Controls/date:Input',
        };
    }, [templateOptions, props.filterViewMode]);

    const onExtendedCaptionClick = React.useCallback((event) => {
        propertyValueChanged(event, null);
    }, []);

    return (
        <BaseEditor
            attrs={props.attrs}
            ref={ref}
            viewMode={props.viewMode}
            onPropertyValueChanged={props.onPropertyValueChanged}
            propertyValue={props.propertyValue}
            resetValue={props.resetValue}
            extendedCaption={props.extendedCaption}
            onExtendedCaptionClick={onExtendedCaptionClick}
            editorTemplate={DateTemplate}
            editorTemplateOptions={editorTemplateOptions}
            extendedTemplate={DateTemplate}
            extendedTemplateOptions={templateOptions}
        />
    );
});
