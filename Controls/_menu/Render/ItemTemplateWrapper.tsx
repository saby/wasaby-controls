import * as React from 'react';
import { ItemTemplate as GridItemTemplate } from 'Controls/treeGrid';
import { ItemTemplate as TreeItemTemplate } from 'Controls/tree';
import MenuItemColumn from 'Controls/_menu/Render/ColumnTemplate';
import { delimitProps } from 'UICore/Jsx';
import { Model } from 'Types/entity';

export default function ItemTemplateWrapper(props): JSX.Element {
    const onTouchStart = React.useCallback(
        (event) => {
            props.onTouchStart?.(event, props.treeItem);
        },
        [props.onTouchStart, props.treeItem]
    );

    const onTouchEnd = React.useCallback(
        (event) => {
            props.onTouchEnd?.(event, props.treeItem);
        },
        [props.onTouchEnd, props.treeItem]
    );

    if (props.viewMode === 'list') {
        const { clearProps } = delimitProps(props);
        return (
            <TreeItemTemplate
                {...props}
                className="controls-Menu__item"
                marker={false}
                highlightOnHover={props.menuMode === 'selector'}
                withoutExpanderPadding={props.menuMode !== 'selector'}
                withoutLevelPadding={props.menuMode !== 'selector'}
                contentTemplate={() => (
                    <MenuItemColumn
                        {...clearProps}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        viewMode={props.viewMode}
                        data-qa={null}
                        data-target={null}
                        type-data-qa={null}
                    />
                )}
            />
        );
    }
    return (
        <GridItemTemplate
            {...props}
            marker={false}
            showItemActionsOnHover={false}
            withoutLevelPadding={props.menuMode !== 'selector'}
            withoutExpanderPadding={props.menuMode !== 'selector'}
            highlightOnHover={props.menuMode === 'selector'}
            expanderIcon={
                props.menuMode === 'selector' &&
                isHistoryItem(props.item?.contents) &&
                !props.item?.contents.get(props.parentProperty)
                    ? 'none'
                    : null
            }
            className={
                props.item['[Controls/treeGrid:TreeGridSpaceRow]']
                    ? 'controls-Menu_gridSpaceRow'
                    : 'controls-Menu__item'
            }
        />
    );
}

function isHistoryItem(item: Model): boolean {
    return item?.get('pinned') || item?.get('recent') || item?.get('frequent');
}
