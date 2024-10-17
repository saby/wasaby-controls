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
import { useAdaptiveMode } from 'UI/Adaptive';

export interface IBaseEditor extends IControlOptions {
    propertyValue: unknown;
    textValue: string;
    resetValue?: unknown;
    extendedCaption?: string;
    closeButtonVisible?: boolean;
    editorsViewMode?: TEditorsViewMode;
    editorTemplate?: TemplateFunction;
    editorTemplateOptions?: object;
    extendedTemplate?: React.Component | React.FunctionComponent | TemplateFunction;
    extendedTemplateOptions: object;
    viewMode?: string;
    onResetClick?: Function;
    onPropertyValueChanged?: Function;
    onExtendedCaptionClick?: Function;
}

/**
 * Базовый редактор, который необходимо использовать при создании своих редакторов фильтра для панели и окна фильтров.
 * Должен лежать в корне шаблона каждого редактора.
 * @class Controls/_filterPanel/BaseEditor
 * @remark
 * Редактор в области "Отбирается" должен подсвечиватья по ховеру, для этого необходимо на BaseEditor повесить класс controls-FilterViewPanel__basicEditor-cloud.
 * Но есть исключения, когда редактор не подсвечивается:
 * 1) Если в качестве редактора используется поле ввода
 * 2) Если в качестве редактора используется контролы из библиотки toggle
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/typed-parameters/types/custom/ руководство разработчика по созданию пользовательского редактора}
 * @example
 * <pre class="brush: html">
 * <Controls.filterPanel:BaseEditor
 *      scope="{{_options}}"
 *      on:extendedCaptionClick="_extendedCaptionClickHandler()">
 *      <ws:editorTemplate>
 *           <Controls.toggle:Checkbox
 *               value="{{_options.propertyValue}}"
 *               on:valueChanged="_handleValueChanged()" />
 *      </ws:editorTemplate>
 * </Controls.filterPanel:BaseEditor>
 * </pre>
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
                ref={ref}
                propertyValue={props.propertyValue}
                resetValue={props.resetValue}
                extendedCaption={props.extendedCaption}
            />
        );
    } else {
        return (
            <div
                ref={ref}
                {...props.attrs}
                onClick={(event) => {
                    (props.onExtendedCaptionClick || props.onExtendedcaptionclick)?.(event);
                }}
                title={props.extendedCaption || ''}
            >
                {props.extendedCaption || ''}
            </div>
        );
    }
});

function CloseButtonTemplate(props: IBaseEditor): React.ReactElement {
    const isAdaptive = useAdaptiveMode()?.device.isPhone();
    const handleCloseEditorClick = React.useCallback(
        (event: SyntheticEvent) => {
            const extendedValue = {
                value: props.resetValue,
                textValue: '',
                viewMode: props.extendedCaption ? 'extended' : 'basic',
            };

            event.stopPropagation();
            (props.onResetClick || props.onResetclick)?.(event);
            if (!props.onPropertyValueChanged) {
                Logger.error(
                    `Controls/filterPanel:BaseEditor: Не задан обработчик клика по крестику сброса в редакторе фильтра.
                 Подпишитесь на событие propertyValueChanged, которое вызывается при клике на крестик и спроксируйте его выше`
                );
            }
            if (props.onPropertyValueChanged) {
                props.onPropertyValueChanged(event, extendedValue);
            }
        },
        [props.resetValue, props.extendedCaption]
    );

    const closeButtonVisible = !(
        props.closeButtonVisible === false ||
        (isEqual(props.propertyValue, props.resetValue) && !props.extendedCaption) ||
        props.resetValue === undefined
    );
    if (closeButtonVisible) {
        return (
            <div
                className={
                    'controls-FilterViewPanel__baseEditor-cross_container' +
                    (isAdaptive
                        ? 'controls-FilterViewPanel__baseEditor-cross_container_adaptive'
                        : '')
                }
            >
                <Icon
                    icon="icon-CloseNew"
                    tooltip={rk('Сбросить')}
                    iconSize={'FilterGroupIcon'}
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
    const isAdaptive = useAdaptiveMode()?.device.isPhone();
    if (props.viewMode === 'basic') {
        return (
            <div
                ref={ref}
                {...props.attrs}
                className={`${props.attrs
                    ?.className} controls-FilterViewPanel__baseEditor-container controls-FilterViewPanel__baseEditor-container${
                    isAdaptive ? '_adaptive' : '_default'
                }`}
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

/**
 * @name Controls/_filterPanel/BaseEditor#editorTemplate
 * @cfg {String|TemplateFunction} Шаблон контрола, который редактирует значение фильтра
 * @example
 * <pre class="brush: html" highlight: [5-9]>
 * <Controls.filterPanel:BaseEditor
 *      scope="{{_options}}"
 *      on:extendedCaptionClick="_extendedCaptionClickHandler()">
 *      <ws:editorTemplate>
 *           <Controls.toggle:Checkbox
 *               value="{{_options.propertyValue}}"
 *               on:valueChanged="_handleValueChanged()" />
 *      </ws:editorTemplate>
 * </Controls.filterPanel:BaseEditor>
 * </pre>
 */

/**
 * @name Controls/_filterPanel/BaseEditor#editorTemplateOptions
 * @cfg {Object} Опции, которые будут переданы в шаблон {@link editorTemplate}
 */

/**
 * @name Controls/_filterPanel/BaseEditor#extendedTemplate
 * @cfg {String|TemplateFunction} Шаблон контрола, который редактирует значение фильтра.
 * Данный шаблон используется, когда редактор отображается в области "Можно отобрать".
 * @remark Если опция не задана, то для отображения редактора в области "Можно отобрать" будет использоватся {@link editorTemplate}
 */

/**
 * @name Controls/_filterPanel/BaseEditor#extendedCaption
 * @cfg {String|TemplateFunction} Текст метки редактора, когда он отображает в области "Можно отобрать"
 */

/**
 * @name Controls/_filterPanel/BaseEditor#onExtendedCaptionClick
 * @cfg {Function} Функция-callback, которая будет вызвана при клике по метке.
 * @see extendedCaption
 * @example
 * <pre class="brush: html">
 *     <Controls.filterPanel:BaseEditor scope="{{_options}}"
 *          on:extendedCaptionClick="_extendedCaptionClickHandler()">
 *          <ws:editorTemplate>
 *              <Controls.toggle:Checkbox
 *                  value="{{_options.propertyValue}}"
 *                  on:valueChanged="_handleValueChanged()" />
 *          </ws:editorTemplate>
 * </Controls.filterPanel:BaseEditor>
 * </pre>
 *
 * <pre class="brush: js">
 *     export default class extends Control {
 *      ...
 *      protected _extendedCaptionClick(): void {
 *          this._notify('propertyValueChanged', [[{
 *              value: true,
 *              textValue: 'По разработке'
 *          }]]);
 *      }
 * }
 * </pre>
 */

/**
 * @name Controls/_filterPanel/BaseEditor#closeButtonVisible
 * @cfg {Boolean} Определяет, будет ли рядом с редактором отображаться крестик сброса значения.
 */
