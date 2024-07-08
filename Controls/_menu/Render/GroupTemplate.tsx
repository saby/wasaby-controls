import * as React from 'react';
import { GroupTemplate as GridGroupTemplate } from 'Controls/grid';
import { GroupItem } from 'Controls/display';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default function GroupTemplate(props): JSX.Element {
    if (props.isHistoryGroup) {
        return (
            <div
                className={`${props.className} tw-flex tw-items-center tw-w-full controls-inlineheight-s controls-padding_top-xs controls-padding_bottom-3xs`}
            >
                <div className="tw-w-full controls-padding_left-l controls-padding_right-l">
                    <div className="controls-Menu__group_separator"></div>
                </div>
            </div>
        );
    } else {
        const isGroup = isGroupVisible(props.item, props.emptyItem);
        if (isGroup) {
            const customTemplate = props.customGroupTemplate;
            if (customTemplate) {
                let CustomGroupTemplate = customTemplate;
                if (customTemplate.charAt) {
                    CustomGroupTemplate = loadSync(customTemplate);
                }
                return (
                    <CustomGroupTemplate
                        className={props.className}
                        attrs={props.attrs}
                        item={props.item}
                        itemData={props.itemData}
                    />
                );
            }
            return (
                <GridGroupTemplate
                    {...props}
                    separatorVisibility={props.separatorVisibility}
                    expanderVisible={false}
                    textAlign={props.textAlign}
                    textVisible={props.showText === true}
                    paddingTop="xs"
                    paddingBottom="3xs"
                    className={`${
                        !props.item.isFirstItem() ? 'controls-Menu__group_marginTop' : ''
                    } controls-Menu__group_marginBottom ${
                        props.separatorVisibility !== false && props.textAlign !== 'left'
                            ? 'controls-Menu__group_withSeparator'
                            : 'controls-Menu__group_withoutSeparator'
                    } `}
                />
            );
        } else {
            return <div className="controls-ListView__itemV controls-ListView__groupHidden"></div>;
        }
    }
}

export function isGroupVisible(groupItem: GroupItem, emptyItem): boolean {
    const collection = groupItem.getOwner();
    const itemsGroupCount = collection.getGroupItems(groupItem.getContents()).length;
    const collectionCount = collection.getCount(true) + (emptyItem ? 1 : 0);
    return !groupItem.isHiddenGroup() && itemsGroupCount > 0 && itemsGroupCount !== collectionCount;
}
