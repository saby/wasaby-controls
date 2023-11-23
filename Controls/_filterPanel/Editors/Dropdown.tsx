/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import EditorChooser from './EditorChooser';
import BaseEditor from '../BaseEditor';
import ExtendedTemplate from './Dropdown/ExtendedTemplate';
import EditorTemplate from './Dropdown/EditorTemplate';
import { IDropdownOptions } from './Dropdown/IDropdownEditor';
import 'css!Controls/filterPanel';

/**
 * Контрол используют в качестве редактора для выбора значения из выпадающего списка.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчки по настроке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчки по настроке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanel/Editors/Dropdown
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/filterPopup:Dropdown
 * @mixes Controls/_filterPanel/Editors/resources/IFrequentItem
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index
 * @public
 */

export default React.memo(
    React.forwardRef(function DropdownEditor(
        props: IDropdownOptions,
        ref: React.ForwardedRef<unknown>
    ): React.ReactElement {
        const items = React.useMemo(() => {
            if (props.dropdownItems) {
                return props.dropdownItems;
            }
            if (props.items) {
                const item = props.items.getRecordById(props.emptyKey);
                if (
                    props.emptyText &&
                    props.emptyKey === props.resetValue &&
                    props.extendedCaption &&
                    item
                ) {
                    const preparedItems = props.items.clone();
                    preparedItems.remove(item);
                    return preparedItems;
                }
            }
            return props.items;
        }, [props.items, props.emptyText, props.emptyKey, props.resetValue, props.extendedCaption]);

        const dropdownProps = {
            ...props,
            items,
            sourceController: null,
            navigation: props.navigation?.view === 'cut' ? undefined : props.navigation,
            emptyText: props.extendedCaption ? undefined : props.emptyText,
        };

        return (
            <EditorChooser {...props} ref={ref}>
                <BaseEditor
                    ref={ref}
                    attrs={props.attrs}
                    propertyValue={props.propertyValue}
                    resetValue={props.resetValue}
                    viewMode={props.viewMode}
                    extendedCaption={props.extendedCaption}
                    onPropertyValueChanged={props.onPropertyValueChanged}
                    closeButtonVisible={props.closeButtonVisible}
                    className="controls-FilterViewPanel__dropdownEditor_cross"
                    editorTemplate={EditorTemplate}
                    editorTemplateOptions={dropdownProps}
                    extendedTemplate={ExtendedTemplate}
                    extendedTemplateOptions={dropdownProps}
                />
            </EditorChooser>
        );
    })
);

/**
 * @name Controls/_filterPanel/Editors/Dropdown#dropdownItems
 * @cfg {RecordSet} Записи для выпадающего списка.
 * Необходимо задавать, если записи для редактора в окне отличаются от записей на панели.
 */
