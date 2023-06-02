/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as rk from 'i18n!Controls';
import { IControlOptions } from 'UI/Base';
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { Icon } from 'Controls/icon';
import { SyntheticEvent } from 'UICommon/Events';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanel';
import { TEditorsViewMode } from './View/ViewModel';

export interface IBaseEditor extends IControlOptions {
    propertyValue: unknown;
    resetValue?: unknown;
    extendedCaption?: string;
    closeButtonVisible?: boolean;
    editorsViewMode?: TEditorsViewMode;
    editorTemplate?: TemplateFunction;
    editorTemplateOptions?: object;
    extendedTemplate?:
        | React.Component
        | React.FunctionComponent
        | TemplateFunction;
    extendedTemplateOptions: object;
    viewMode?: string;
    onResetClick?: Function;
    onPropertyValueChanged?: Function;
    onExtendedCaptionClick?: Function;
}

/**
 * Контрол используют в качестве базового редактора для панели фильтров.
 * @class Controls/_filterPanel/BaseEditor
 * @extends UI/Base:Control
 * @public
 */

const ExtendedTemplate = React.forwardRef(function getExtendedTemplate(
    props: IBaseEditor,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    if (props.extendedTemplate) {
        return (
            <props.extendedTemplate
                {...props.extendedTemplateOptions}
                attrs={props.attrs}
                forwardedRef={ref}
                propertyValue={props.propertyValue}
                resetValue={props.resetValue}
                extendedCaption={props.extendedCaption}
                frequentItemText={props.frequentItemText}
                frequentItemKey={props.frequentItemKey}
            />
        );
    } else {
        return (
            <div
                ref={ref}
                {...props.attrs}
                onClick={(event) => {
                    (
                        props.onExtendedCaptionClick ||
                        props.onExtendedcaptionclick
                    )?.(event);
                }}
                title={props.extendedCaption || ''}
            >
                {props.extendedCaption || ''}
            </div>
        );
    }
});

function CloseButtonTemplate(props: IBaseEditor): React.ReactElement {
    const handleCloseEditorClick = React.useCallback(
        (event: SyntheticEvent) => {
            const extendedValue = {
                value: props.resetValue,
                textValue: '',
                viewMode: props.extendedCaption ? 'extended' : 'basic',
            };

            event.stopPropagation();
            props.onResetclick?.(event);
            if (!props.onPropertyValueChanged && !props.onPropertyvaluechanged) {
                Logger.error(`Controls/filterPanel:BaseEditor: Не задан обработчик клика по крестику сброса в редакторе фильтра.
                 Подпишитесь на событие propertyValueChanged, которое вызывается при клике на крестик и спроксируйте его выше`,
                    this
                );
            }
            if (props.onPropertyValueChanged) {
                props.onPropertyValueChanged(event, extendedValue);
            }
            if (props.onPropertyvaluechanged) {
                props.onPropertyvaluechanged(event, extendedValue);
            }
        },
        [props.resetValue, props.extendedCaption]
    );

    const closeButtonVisible = !(
        props.closeButtonVisible === false ||
        (isEqual(props.propertyValue, props.resetValue) &&
            !props.extendedCaption) ||
        props.resetValue === undefined
    );
    if (closeButtonVisible) {
        return (
            <div className="controls-FilterViewPanel__baseEditor-cross_container">
                <Icon
                    icon="icon-CloseNew"
                    tooltip={rk('Сбросить')}
                    className="controls-FilterViewPanel__groupReset-icon"
                    onClick={handleCloseEditorClick}
                    dataQa="FilterViewPanel__baseEditor-cross"
                />
            </div>
        );
    }
    return null;
}

export default React.forwardRef(function BaseEditor(
    props: IBaseEditor,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    if (props.viewMode === 'basic') {
        return (
            <div
                ref={ref}
                {...props.attrs}
                className={`${props.attrs?.className} controls-FilterViewPanel__baseEditor-container`}
            >
                <props.editorTemplate
                    forwardedRef={ref}
                    {...props.editorTemplateOptions}
                    propertyValue={props.propertyValue}
                    resetValue={props.resetValue}
                    data-qa="FilterViewPanel__baseEditor"
                    dataQa="FilterViewPanel__baseEditor"
                />
                {CloseButtonTemplate(props)}
            </div>
        );
    } else {
        return <ExtendedTemplate {...props} ref={ref} />;
    }
});
