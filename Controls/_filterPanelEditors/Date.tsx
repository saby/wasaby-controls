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
    shouldPositionBelow?: boolean;
}

interface IDateTemplateOptions extends IDateOptions {
    dateTemplate?: string;
    tooltip?: string;
    valueChangedHandler: Function;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanelEditors/Date
 * @mixes Controls/date:Input
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DateEditor/Index
 * @public
 */
const DateTemplate = React.forwardRef((props: IDateTemplateOptions, ref) => {
    const templateOptions = {
        value: props.propertyValue,
        emptyCaption: props.extendedCaption,
        tooltip: props.tooltip,
        fontWeight: 'default',
        fontColorStyle: props.fontColorStyle || 'default',
        fontSize: props.fontSize,
        datePopupType: props.datePopupType,
        shouldPositionBelow: props.shouldPositionBelow,
        onValueChanged: (value) => {
            props.valueChangedHandler(value);
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

const Date = React.forwardRef(function (
    props: IDateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const propertyValueChanged = React.useCallback(
        (newValue: Date) => {
            const extendedValue = {
                value: newValue,
                textValue: getTextValue(newValue, props.mask || mask),
                viewMode: 'basic',
            };
            props.onPropertyValueChanged?.(extendedValue);
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
            dateTemplate: 'Controls/date:Selector',
            shouldPositionBelow: props.shouldPositionBelow,
            valueChangedHandler: propertyValueChanged,
        };
    }, [
        props.propertyValue,
        props.extendedCaption,
        props.fontColorStyle,
        props.fontSize,
        props.datePopupType,
        props.shouldPositionBelow,
        propertyValueChanged,
    ]);

    const editorTemplateOptions = React.useMemo(() => {
        return {
            ...templateOptions,
            attrs: {
                className: 'controls-FilterViewPanel__spacing-between-editor-cross',
            },
            dateTemplate: 'Controls/date:Input',
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

Date.defaultProps = {
    shouldPositionBelow: true,
};

export default Date;
