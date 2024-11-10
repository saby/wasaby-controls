import * as React from 'react';
import { IDateMenuOptions } from './IDateMenu';
import DropdownTemplate from './DropdownTemplate';
import FrequentItem from 'Controls/_filterPanelEditors/FrequentItem/FrequentItem';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';

function getFrequentItem(items: RecordSet): Model {
    return factory(items)
        .filter((item) => {
            return item.get('frequent');
        })
        .first() as Model;
}

function getFastItem(options: IDateMenuOptions): Model | null {
    const dateMenuItems = options.items;
    if (dateMenuItems) {
        return getFrequentItem(dateMenuItems);
    }
    return null;
}

function getItems(options: IDateMenuOptions, fastItem: Model | null): RecordSet {
    let dateRangeItems = options.items;
    if (fastItem) {
        const itemForRemove = getFrequentItem(dateRangeItems);
        dateRangeItems = dateRangeItems.clone(true);
        dateRangeItems.remove(itemForRemove);
    }
    return dateRangeItems;
}

export default React.memo(
    React.forwardRef((props: IDateMenuOptions, ref) => {
        const [fastItem, items] = React.useMemo(() => {
            const fast = getFastItem(props);
            return [fast, getItems(props, fast)];
        }, [props.items]);

        const frequentItemText = fastItem?.get(props.displayProperty);
        return (
            <FrequentItem
                ref={props.forwardedRef}
                attrs={props.attrs}
                frequentItemText={frequentItemText}
                frequentItemKey={fastItem?.get(props.keyProperty)}
                fastDataQa="controls-FilterViewPanel__dateMenuEditor-fastItem"
                onPropertyValueChanged={() => {
                    props.onItemClick(fastItem, props);
                }}
                onExtendedCaptionClick={props.openMenu}
                beforeContentTemplate={DropdownTemplate}
                beforeContentTemplateOptions={{
                    viewMode: props.viewMode,
                    filterViewMode: props.filterViewMode,
                    filterIndex: props.filterIndex,
                    fontColorStyle: props.fontColorStyle,
                    fontSize: props.fontSize,
                    keyProperty: props.keyProperty,
                    displayProperty: props.displayProperty,
                    selectedKeys: props.selectedKeys,
                    onItemClick: props.onItemClick,
                    itemTemplate: props.itemTemplate,
                    items,
                    isNewPeriodTypes: props.isNewPeriodTypes,
                    periodType: props.periodType,
                    userPeriods: props.userPeriods,
                    caption: props.extendedCaption,
                    _date: props._date,
                    underline: frequentItemText ? 'hovered' : 'hidden',
                    attrs: {
                        className: fastItem
                            ? 'controls-FilterViewPanel__editor_underline ws-flex-shrink-0'
                            : '',
                        'data-qa': 'controls-FilterViewPanel__dateMenuEditor-dropdown',
                    },
                }}
            />
        );
    })
);
