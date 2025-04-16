import * as React from 'react';
import { ItemTemplate as GridItemTemplate } from 'Controls/treeGrid';
import { ItemTemplate as TreeItemTemplate } from 'Controls/tree';
import MenuItemColumn from 'Controls/_menu/Render/ColumnTemplate';
import { delimitProps } from 'UICore/Jsx';

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

    const itemActionsClass = `controls-Menu__itemActions ${
        props.itemActionsClass || 'controls-Menu__itemActions_position_rightBottom'
    }`;

    const itemsSpacingClass = `controls-Menu__row-marginBottom-${
        props.isAdaptive ? null : props.itemsSpacing
    }${props.item.isLastItem() ? '_isLast' : ''}`;

    if (props.viewMode === 'list') {
        const { clearProps } = delimitProps(props);
        return (
            <TreeItemTemplate
                {...props}
                className={`controls-Menu__item ${itemsSpacingClass}`}
                itemActionsClass={itemActionsClass}
                marker={false}
                highlightOnHover={props.item?.contents.get('highlightOnHover') ?? false}
                withoutExpanderPadding={true}
                withoutLevelPadding={true}
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
            itemActionsClass={itemActionsClass}
            marker={false}
            showItemActionsOnHover={false}
            withoutLevelPadding={true}
            withoutExpanderPadding={true}
            highlightOnHover={props.item?.contents.get('highlightOnHover') ?? false}
            expanderIcon={props.item?.contents.get('expanderIcon') || null}
            className={`${props.className} controls-Menu__item ${itemsSpacingClass}
                    ${
                        props.item?.contents.get('expanderIcon') === 'hidden'
                            ? 'controls-Menu__item_hiddenNode'
                            : ''
                    }`}
        />
    );
}
