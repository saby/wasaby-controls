/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IControlOptions } from 'UI/Base';
import { TemplateFunction } from 'UI/Base';
import {
    forwardRef,
    ForwardedRef,
    ReactElement,
    useState,
    useCallback,
    useContext,
    Component,
    FunctionComponent,
} from 'react';
import 'css!Controls/filterPanel';
import CloseButton from './Editors/BaseEditor/CloseButton';
import ExtendedTemplate from './Editors/BaseEditor/ExtendedTemplate';
import GroupTemplate from './Editors/BaseEditor/GroupTemplate';
import { isEqual } from 'Types/object';
import IEditorOptions from './_interface/IEditorOptions';
import { FilterDescriptionContext, FilterPanelContext } from './View/Context';
import { FilterDescription, IFilterItem } from 'Controls/filter';
import IExtendedPropertyValue from './_interface/IExtendedPropertyValue';
import { useAdaptiveMode } from 'UI/Adaptive';

export interface IBaseEditor extends IControlOptions, IEditorOptions<unknown> {
    propertyValue: unknown;
    textValue: string;
    resetValue?: unknown;
    extendedCaption?: string;
    closeButtonVisible?: boolean;
    editorTemplate?: TemplateFunction;
    editorTemplateOptions?: object;
    extendedTemplate?: Component | FunctionComponent | TemplateFunction;
    extendedTemplateOptions: object;
    onResetClick?: Function;
    onPropertyValueChanged: Function;
    onExtendedCaptionClick?: Function;
    editorCaption?: string;
    expanderVisible: boolean;
    filterIndex: number;
}

interface IGroupProps extends IBaseEditor {
    toggleExpandHandler: Function;
    expanded: boolean;
}

const getExtendedCaption = FilterDescription.getExtendedCaption;

function getResetFilterItemValue(filterItem: IFilterItem): IExtendedPropertyValue {
    return {
        value: filterItem.resetValue,
        textValue: '',
        viewMode: getExtendedCaption(filterItem) ? 'extended' : 'basic',
    };
}

function isGroupVisibleByEditorsViewMode(
    filterItem: IFilterItem,
    editorsViewMode: string
): boolean {
    const isCorrectCaption =
        typeof filterItem.editorCaption === 'string' || filterItem.editorCaption instanceof String;

    if (editorsViewMode === 'cloud') {
        return isCorrectCaption && filterItem.editorCaption;
    } else {
        return (
            isCorrectCaption &&
            (filterItem.editorOptions?.markerStyle !== 'primary' ||
                editorsViewMode === 'popupCloudPanelDefault')
        );
    }
}

function Group(props: IGroupProps): ReactElement {
    const filterItem = useContext(FilterDescriptionContext);
    const { editorsViewMode, filterViewMode } = useContext(FilterPanelContext);
    const isPopup = filterViewMode === 'popup';
    const resetClickHandler = useCallback(
        (event) => {
            props.onPropertyValueChanged(event, {
                ...getResetFilterItemValue(filterItem),
                viewMode: filterItem.viewMode,
            });
            event.stopPropagation();
        },
        [props.resetValue, props.extendedCaption, props.onPropertyValueChanged]
    );

    return (
        <GroupTemplate
            caption={filterItem.editorCaption}
            editorsViewMode={editorsViewMode}
            filterViewMode={filterViewMode}
            expanderVisible={filterItem.expanderVisible && editorsViewMode !== 'cloud'}
            expanded={props.expanded}
            resetButtonVisible={
                editorsViewMode === 'default' &&
                !isEqual(filterItem.resetValue, props.propertyValue) &&
                filterItem.groupAlignment !== 'right'
            }
            groupTextAlign={isPopup ? 'left' : filterItem.groupTextAlign || 'left'}
            groupExpanderAlign={isPopup ? 'left' : filterItem.groupExpanderAlign || 'left'}
            isFirstEditor={filterItem.isFirstEditor}
            toggleExpandHandler={props.toggleExpandHandler}
            resetButtonClick={resetClickHandler}
            separatorVisible={
                filterViewMode === 'default' &&
                isGroupVisibleByEditorsViewMode(filterItem, editorsViewMode) &&
                filterItem.separatorVisibility !== 'hidden'
            }
        />
    );
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
export default forwardRef(function BaseEditor(
    props: IBaseEditor,
    ref: ForwardedRef<unknown>
): ReactElement {
    const filterItem = useContext(FilterDescriptionContext);
    const { editorsViewMode } = useContext(FilterPanelContext);
    const [expanded, setExpanded] = useState(true);
    const toggleExpandHandler = useCallback(
        (event) => {
            if (filterItem.expanderVisible && getExtendedCaption(filterItem)) {
                props.onPropertyValueChanged?.(event, getResetFilterItemValue(filterItem));
            } else if (filterItem.expanderVisible) {
                setExpanded(!expanded);
            }
        },
        [expanded, setExpanded, filterItem]
    );
    const isAdaptive = useAdaptiveMode().device.isPhone();

    if (filterItem.viewMode === 'basic') {
        const wrapperClassName = `
            ${props.attrs?.className} 
            controls-FilterViewPanel__baseEditor-container
            controls-FilterViewPanel__baseEditor-container${isAdaptive ? '_adaptive' : '_default'}
            tw-flex-col
            ${
                !isEqual(props.propertyValue, filterItem.resetValue)
                    ? 'controls-FilterViewPanel__basicEditor-filterChanged'
                    : ''
            }
        `;
        return (
            <div ref={ref} {...props.attrs} className={wrapperClassName}>
                {isGroupVisibleByEditorsViewMode(filterItem, editorsViewMode) ? (
                    <Group
                        {...props}
                        toggleExpandHandler={toggleExpandHandler}
                        expanded={expanded}
                    />
                ) : null}
                <div
                    className={'tw-flex tw-flex-row tw-w-full'}
                    data-qa={'FilterViewPanel__editor'}
                >
                    {expanded ? (
                        <props.editorTemplate
                            forwardedRef={ref}
                            {...props.editorTemplateOptions}
                            propertyValue={props.propertyValue}
                            resetValue={filterItem.resetValue}
                            data-qa="FilterViewPanel__baseEditor"
                            dataQa="FilterViewPanel__baseEditor"
                        />
                    ) : null}
                    {CloseButton(props)}
                </div>
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
