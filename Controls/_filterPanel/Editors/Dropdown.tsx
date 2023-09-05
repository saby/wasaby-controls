/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import EditorChooser from './EditorChooser';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { isEqual } from 'Types/object';
import { RecordSet, List } from 'Types/collection';
import { IMenuPopupOptions } from 'Controls/menu';
import { IFrequentItemOptions } from 'Controls/_filterPanel/Editors/resources/IFrequentItem';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { factory } from 'Types/chain';
import * as cInstance from 'Core/core-instance';
import Async from 'Controls/Container/Async';
import SelectionContainer from 'Controls/_filterPanel/Editors/SelectionContainer';
import 'css!Controls/filterPanel';
import BaseEditor from '../BaseEditor';
import FrequentItem from './resources/FrequentItem';
import { useContent } from 'UICore/Jsx';
import { constants } from 'Env/Env';

interface IDropdownOptions extends IMenuPopupOptions, IFrequentItemOptions {
    propertyValue: number[] | string[];
    keyProperty: string;
    displayProperty: string;
    multiSelect: boolean;
    fontSize: string;
    items: RecordSet;
}

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

const EditorTemplate = React.forwardRef(
    (props: IDropdownOptions, ref: React.ForwardedRef<unknown>) => {
        const dataLoadCallback = React.useCallback(
            (items) => {
                if (props.dataLoadCallback) {
                    props.dataLoadCallback(items);
                } else {
                    if (
                        items &&
                        !items.getCount() &&
                        props.emptyText &&
                        props.propertyValue !== props.resetValue
                    ) {
                        props.handleSelectedKeysChanged(props.emptyKey || props.resetValue);
                    }
                }
            },
            [
                props.dataLoadCallback,
                props.emptyText,
                props.propertyValue,
                props.resetValue,
                props.emptyKey,
            ]
        );
        const dropdown = useContent(
            (contentProps) => {
                return (
                    <Async
                        templateName="Controls/dropdown:Selector"
                        templateOptions={{
                            ...props,
                            ...contentProps,
                            fontColorStyle: props.fontColorStyle || 'default',
                            style: 'filterPanel',
                            caption: props.extendedCaption,
                            maxVisibleItems: 20,
                            underline: 'none',
                            dataLoadCallback,
                        }}
                        {...contentProps}
                        onTextValueChanged={props.textValueChanged}
                        customEvents={['onTextValueChanged', 'onSelectedKeysChanged']}
                        className="controls-FilterViewPanel__dropdownEditor"
                    />
                );
            },
            // https://online.sbis.ru/opendoc.html?guid=a34c30d7-4a3f-44e4-9f5e-14e72f557bba&client=3
            [props.task1189343904 && props.filter]
        );
        return (
            <div
                className={`ws-ellipsis controls-FilterViewPanel__basicEditor-cloud
                            controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`}
            >
                <SelectionContainer
                    ref={props.forwardedRef}
                    onSelectedKeysChanged={props.handleSelectedKeysChanged}
                    customEvents={['onSelectedKeysChanged']}
                    multiSelect={props.multiSelect}
                    propertyValue={props.propertyValue}
                    resetValue={props.resetValue}
                    content={dropdown}
                ></SelectionContainer>
            </div>
        );
    }
);

const ExtendedTemplate = React.forwardRef(
    (props: IDropdownOptions, ref: React.ForwardedRef<unknown>) => {
        return (
            <FrequentItem
                ref={props.setRefs}
                attrs={props.attrs}
                extendedCaption={props.extendedCaption}
                frequentItemText={props.frequentItemText}
                frequentItemKey={props.frequentItemKey}
                displayProperty={props.displayProperty}
                keyProperty={props.keyProperty}
                items={props.items}
                name={props.name}
                onExtendedCaptionClick={props.openMenu}
                onPropertyValueChanged={props.onPropertyValueChanged}
                onDeactivated={props.deactivated}
                onKeyDown={props.onHandleKeyDown}
                fastDataQa="controls-FilterViewPanel__DropdownEditor-fastItem"
            />
        );
    }
);

export default React.memo(
    React.forwardRef(function DropdownEditor(
        props: IDropdownOptions,
        ref: React.ForwardedRef<unknown>
    ): React.ReactElement {
        const targetRef = React.createRef();
        const textValueRef = React.useRef(props.textValue);
        const controller = React.useRef(null);
        const hasHistory = () => {
            return (
                props.historyId ||
                cInstance.instanceOfModule(props.source, 'Controls/history:Source')
            );
        };

        const notifySelectedKeysChanged = (
            value: TKey[] | TKey,
            text: string,
            viewMode: string = 'basic'
        ) => {
            if (!isEqual(value, props.propertyValue)) {
                const extendedValue = {
                    value,
                    textValue: text,
                    viewMode,
                };
                (props.onPropertyValueChanged || props.onPropertyvaluechanged)?.(
                    new SyntheticEvent(null, {
                        type: 'propertyValueChanged',
                    }),
                    extendedValue
                );
            }
        };

        const prepareResultFromMenu = (
            result: Model[]
        ): {
            value: TKey[];
            textValue: string;
        } => {
            const selectedKeys = [];
            const text = [];

            result.forEach((item) => {
                selectedKeys.push(item.get(props.keyProperty));
                text.push(item.get(props.displayProperty));
            });

            return {
                value: selectedKeys,
                textValue: text.join(', '),
            };
        };

        const handleMenuItemsActivate = (data: Model[]) => {
            const result = prepareResultFromMenu(data);
            notifySelectedKeysChanged(
                props.multiSelect ? result.value : result.value[0],
                result.textValue
            );
        };

        const selectorDialogResult = (items: List<Model>) => {
            handleMenuItemsActivate(factory(items).toArray());
            controller.current.handleSelectorResult(items);
        };

        const getDropdownController = () => {
            return loadAsync('Controls/dropdown').then(({ _Controller }) => {
                const selectedKeys =
                    props.propertyValue instanceof Array
                        ? props.propertyValue
                        : [props.propertyValue];
                const ddlController = new _Controller({
                    ...props,
                    closeMenuOnOutsideClick: true,
                    openerControl: targetRef.current,
                    popupClassName: 'controls-MenuButton_outlined__m_popup',
                    markerVisibility: props.multiSelect ? 'hidden' : 'onactivated',
                    headingCaption: props.menuHeadingCaption,
                    selectorDialogResult,
                    selectedKeys,
                });
                controller.current = ddlController;
                return ddlController;
            });
        };

        const openMenu = () => {
            const eventHandlers = {
                onResult: (action, data) => {
                    switch (action) {
                        case 'itemClick':
                            const item = controller.current.getPreparedItem(data);
                            handleMenuItemsActivate([item]);
                            controller.current.updateHistoryAndCloseMenu(item);
                            break;
                        case 'applyClick':
                            handleMenuItemsActivate(data.items);
                            controller.current.updateHistoryAndCloseMenu(data.items);
                            break;
                        case 'openSelectorDialog':
                            controller.current.openSelectorDialog(data);
                    }
                },
            };

            getDropdownController().then((ddlController) => {
                ddlController.setMenuPopupTarget(targetRef.current);
                ddlController.openMenu({ eventHandlers }).then((items) => {
                    if (items) {
                        handleMenuItemsActivate(items);
                    }
                });
            });
        };

        const handleSelectedKeysChanged = (value) => {
            const viewMode =
                !props.emptyText &&
                !props.selectedAllText &&
                props.extendedCaption &&
                isEqual(value, props.resetValue)
                    ? 'extended'
                    : 'basic';
            notifySelectedKeysChanged(value, textValueRef.current, viewMode);
        };

        const setRefs = (element) => {
            targetRef.current = element;
            if (ref) {
                ref(element);
            }
        };

        const textValueChangedCallback = React.useCallback((text) => {
            textValueRef.current = text;
        }, []);

        const onHandleKeyDown = React.useCallback(
            (event) => {
                if (
                    event.nativeEvent.keyCode === constants.key.esc &&
                    controller &&
                    controller.current?.isOpenedMenu()
                ) {
                    controller.current?.closeMenu();
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            [controller.current]
        );

        return (
            <EditorChooser {...props} ref={ref}>
                <BaseEditor
                    ref={ref}
                    {...props}
                    className="controls-FilterViewPanel__dropdownEditor_cross"
                    editorTemplate={EditorTemplate}
                    editorTemplateOptions={{
                        ...props,
                        sourceController: hasHistory() ? null : props.sourceController,
                        items: hasHistory() ? null : props.items,
                        textValueChanged: textValueChangedCallback,
                        handleSelectedKeysChanged,
                    }}
                    extendedTemplate={ExtendedTemplate}
                    extendedTemplateOptions={{
                        extendedCaption: props.extendedCaption,
                        frequentItemText: props.frequentItemText,
                        frequentItemKey: props.frequentItemKey,
                        displayProperty: props.displayProperty,
                        keyProperty: props.keyProperty,
                        items: props.items,
                        name: props.name,
                        onPropertyValueChanged:
                            props.onPropertyValueChanged || props.onPropertyvaluechanged,
                        onHandleKeyDown,
                        setRefs,
                        openMenu,
                        deactivated: () => {
                            controller.current?.closeMenu();
                        },
                    }}
                />
            </EditorChooser>
        );
    })
);
