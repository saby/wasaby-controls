/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import BaseEditor from '../BaseEditor';
import Async from 'Controls/Container/Async';
import FrequentItem from './resources/FrequentItem';
import { inputDefaultContentTemplate as InputDefaultContentTemplate } from 'Controls/dropdown';
import { BY_PERIOD_KEY, IDateMenuOptions } from './DateMenu/IDateMenu';
import getItemsWithDateRange from './DateMenu/GetItemsWithDateRange';
import getSelectedKeys from './DateMenu/GetSelectedKeysByValue';
import { onItemClick } from './DateMenu/ItemClickHandler';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanel/Editors/DateMenu
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @private
 */

const DropdownTemplate = React.forwardRef(
    (props: IDateMenuOptions, ref: React.ForwardedRef<unknown>) => {
        const isFirstBasicDateEditor =
            props.viewMode === 'basic' &&
            props.filterViewMode === 'popup' &&
            props.filterIndex === 0;
        const contentTemplateOptions = {
            fontColorStyle: props.fontColorStyle || 'default',
            inlineHeight: 'm',
            underline: props.underline,
            caption: props.caption,
            fontSize: isFirstBasicDateEditor ? 'xl' : props.fontSize,
        };
        const contentTemplate = (
            <InputDefaultContentTemplate
                {...contentTemplateOptions}
                tooltip={props.caption}
                text={props.caption}
            />
        );
        return (
            <Async
                {...props.attrs}
                customEvents={['onMenuItemClick']}
                className={`${props.attrs?.className} controls-FilterViewPanel__dropdownEditor 
                ${isFirstBasicDateEditor ? 'controls-fontweight-bold' : ''}`}
                templateName="Controls/dropdown:Selector"
                onMenuItemClick={(item) => {
                    props.onItemClick(item, props);
                }}
                templateOptions={{
                    ...contentTemplateOptions,
                    items: props.items,
                    keyProperty: props.keyProperty,
                    displayProperty: props.displayProperty,
                    selectedKeys: props.selectedKeys,
                    headerTemplate: null,
                    menuPopupOptions: {
                        templateOptions: {
                            markerVisibility: 'onactivated',
                        },
                    },
                    contentTemplate,
                }}
            />
        );
    }
);

const EditorTemplate = React.forwardRef((props: IDateMenuOptions, ref) => {
    return (
        <div
            data-qa={props.dataQa}
            className={`ws-ellipsis controls-FilterViewPanel__basicEditor-cloud
                            controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`}
        >
            <DropdownTemplate {...props} underline="hidden" />
        </div>
    );
});

const ExtendedTemplate = React.forwardRef((props: IDateMenuOptions, ref) => {
    const frequentItemText = props.fastItem?.get(props.displayProperty);
    return (
        <FrequentItem
            ref={props.forwardedRef}
            attrs={props.attrs}
            frequentItemText={frequentItemText}
            frequentItemKey={props.fastItem?.get(props.keyProperty)}
            fastDataQa="controls-FilterViewPanel__dateMenuEditor-fastItem"
            onPropertyValueChanged={() => {
                props.onItemClick(props.fastItem, props);
            }}
            onExtendedCaptionClick={props.openMenu}
            beforeContentTemplate={DropdownTemplate}
            beforeContentTemplateOptions={{
                ...props,
                caption: props.extendedCaption,
                underline: frequentItemText ? 'hovered' : 'hidden',
                attrs: {
                    className: props.fastItem
                        ? 'controls-FilterViewPanel__editor_underline ws-flex-shrink-0'
                        : '',
                    'data-qa': 'controls-FilterViewPanel__dateMenuEditor-dropdown',
                },
            }}
        />
    );
});

function isAdditionalFilter(props: IDateMenuOptions): boolean {
    return (
        props.viewMode === 'extended' ||
        (props.viewMode === 'frequent' &&
            props.extendedCaption &&
            isEqual(props.propertyValue, props.resetValue))
    );
}

function getFrequentItem(items: RecordSet): Model {
    return factory(items)
        .filter((item) => {
            return item.get('frequent');
        })
        .first() as Model;
}

function getFastItem(options: IDateMenuOptions): Model | null {
    const dateMenuItems = options.dateMenuItems || options.items;
    if (isAdditionalFilter(options) && dateMenuItems) {
        return getFrequentItem(dateMenuItems);
    }
    return null;
}

function getItems(options: IDateMenuOptions, fastItem: Model | null): RecordSet {
    const dateRangeItems = getItemsWithDateRange(options);
    if (isAdditionalFilter(options) && fastItem) {
        const itemForRemove = getFrequentItem(dateRangeItems);
        dateRangeItems.remove(itemForRemove);
    }
    return dateRangeItems;
}

function getTextValue(
    options: IDateMenuOptions,
    items: RecordSet,
    selectedKeys: string[],
    value: Date | Date[]
): Promise<string> | string {
    const item = items.getRecordById(selectedKeys[0]);
    if (item && selectedKeys[0] !== BY_PERIOD_KEY) {
        return item.get(options.displayProperty);
    } else if (value) {
        return loadAsync('Controls/dateRange').then(({ Utils }) => {
            const captionFormatter = options.captionFormatter || Utils.formatDateRangeCaption;
            const startValue = value instanceof Array ? value[0] : value;
            const endValue = value instanceof Array ? value[1] : value;
            return captionFormatter(startValue, endValue, options.extendedCaption);
        });
    }
}

const DateMenu = React.forwardRef((props: IDateMenuOptions, ref: React.ForwardedRef<unknown>) => {
    function updateTextValue(newSelectedKeys: string[]): void {
        const textValueRes = getTextValue(props, items, newSelectedKeys, props.propertyValue);
        if (textValueRes instanceof Promise) {
            textValueRes.then((textValue) => {
                setCaption(textValue);
            });
        } else {
            setCaption(textValueRes);
        }
    }

    function getInitCaption(): string {
        if (selectedKeys[0] !== BY_PERIOD_KEY) {
            return getTextValue(props, items, selectedKeys) as string;
        } else {
            return props.textValue;
        }
    }

    const [fastItem, setFastItem] = React.useState<Model>(getFastItem(props));
    const [items, setItems] = React.useState<RecordSet>(getItems(props, fastItem));
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>(getSelectedKeys(items, props));
    const [caption, setCaption] = React.useState<string>(getInitCaption(props));

    React.useEffect(() => {
        const newSelectedKeys = getSelectedKeys(items, props);
        setFastItem(getFastItem(props));
        setItems(getItems(props, fastItem));
        setSelectedKeys(newSelectedKeys);
        updateTextValue(newSelectedKeys);
    }, [props.propertyValue, props.items, props.dateMenuItems, props.viewMode]);

    const propertyValueChanged = (newValue: string | Date | Date[], textValue?: string) => {
        const extendedValue = {
            value: newValue,
            textValue,
            viewMode: 'basic',
        };
        (props.onPropertyValueChanged || props.onPropertyvaluechanged)?.(
            new SyntheticEvent(null, {
                type: 'propertyValueChanged',
            }),
            extendedValue
        );
    };

    const periodChangedCallback = React.useCallback(
        (startValue: Date, endValue: Date) => {
            if (startValue || endValue) {
                const isSingle = props.selectionType === 'single';
                const valueRange = [startValue, endValue];
                setSelectedKeys([BY_PERIOD_KEY]);
                getTextValue(props, items, [BY_PERIOD_KEY], valueRange).then((textValue) => {
                    setCaption(textValue);
                    propertyValueChanged(isSingle ? startValue : valueRange, textValue);
                });
            }
        },
        [props.selectionType]
    );

    const selectedItemCallback = React.useCallback(
        (item: Model) => {
            const key = item.getKey();
            setSelectedKeys([key]);
            setCaption(item.get(props.displayProperty));
            propertyValueChanged(key, item.get(props.displayProperty));
        },
        [props.selectionType, props.displayProperty]
    );

    const targetRef = React.createRef();
    const setRefs = (element) => {
        targetRef.current = element;
        if (ref) {
            ref(element);
        }
    };

    const templateOptions = {
        ...props,
        propertyValue: props.propertyValue,
        editorMode: props.editorMode,
        openerControl: targetRef,
        targetContainer: targetRef,
        selectedItemCallback,
        periodChangedCallback,
        caption,
        onItemClick,
        items,
        selectedKeys,
        templateOptions: {
            ...props,
        },
    };

    return (
        <BaseEditor
            ref={setRefs}
            {...props}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={templateOptions}
            extendedTemplate={ExtendedTemplate}
            extendedTemplateOptions={{
                ...templateOptions,
                fastItem,
            }}
        />
    );
});

DateMenu.defaultProps = {
    displayProperty: 'title',
    keyProperty: 'id',
};

export default DateMenu;
