import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import Async from 'Controls/Container/Async';
import { Range } from 'Controls/dateUtils';
import { BaseEditor, IEditorOptions } from 'Controls/filterPanel';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import 'css!Controls/filterPanelEditors';

interface IDateOptions extends IEditorOptions<Date> {
    mask?: string;
    fontColorStyle: string;
    fontSize: string;
    datePopupType: string;
    filterViewMode?: string;
}

interface IDateTemplateOptions extends IDateOptions {
    dateTemplate?: string;
    tooltip?: string;
    rangeChangedCallback: Function;
}

/**
 * Контрол используют в качестве редактора диапозона дат для поля фильтра.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls-ListEnv/_filterPanelExtEditors/DateRangeInput
 * @mixes Controls/dateRange:Input
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DateRangeInput/Index
 * @public
 */
const DateTemplate = React.forwardRef((props: IDateTemplateOptions, ref) => {
    const templateOptions = {
        startValue: props.propertyValue[0] || null,
        endValue: props.propertyValue[1] || null,
        emptyCaption: props.extendedCaption,
        tooltip: props.tooltip,
        fontWeight: 'default',
        fontColorStyle: props.fontColorStyle || 'default',
        fontSize: props.fontSize,
        datePopupType: props.datePopupType,
        onRangeChanged: (event, startValue, endValue) => {
            props.rangeChangedCallback(event, startValue, endValue);
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

function getTextValue(startValue: Date, endValue: Date, mask): string {
    const stringValueConverterClass = loadSync('Controls/date').StringValueConverter;
    const stringValueConverter = new stringValueConverterClass();
    return `${stringValueConverter.getStringByValue(
        startValue,
        mask
    )} - ${stringValueConverter.getStringByValue(endValue, mask)}`;
}

const mask = Range.dateMaskConstants.DD_MM_YY;

export default React.forwardRef(function Date(
    props: IDateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const propertyValueChanged = React.useCallback(
        (startValue: Date, endValue: Date) => {
            const extendedValue = {
                value: [startValue, endValue],
                textValue: getTextValue(startValue, endValue, props.mask || mask),
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
            tooltip: props.extendedCaption,
            fontColorStyle: props.fontColorStyle,
            fontSize: props.fontSize,
            datePopupType: props.datePopupType,
            dateTemplate: 'Controls/dateRange:Selector',
            rangeChangedCallback: propertyValueChanged,
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
                className: 'controls-FilterViewPanel__spacing-between-editor-cross',
            },
            dateTemplate: 'Controls/dateRange:Input',
            tooltip: '',
        };
    }, [templateOptions, props.filterViewMode]);

    const onExtendedCaptionClick = React.useCallback(() => {
        propertyValueChanged(null);
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
