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
                highlightOnHover={
                    props.item?.contents.get('highlightOnHover') ?? props.menuMode === 'selector'
                }
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
            withoutExpanderPadding={
                props.menuMode !== 'selector' || props.item?.contents.get('icon')
            }
            highlightOnHover={
                props.item?.contents.get('highlightOnHover') ?? props.menuMode === 'selector'
            }
            expanderIcon={
                props.menuMode === 'selector' &&
                isHistoryItem(props.item?.contents) &&
                !props.item?.contents.get(props.parentProperty)
                    ? 'none'
                    : props.item?.contents.get('expanderIcon') || null
            }
            className={`controls-Menu__item
                    ${
                        props.item?.contents.get('expanderIcon') === 'hidden'
                            ? 'controls-Menu__item_hiddenNode'
                            : ''
                    }`}
        />
    );
}

function isHistoryItem(item: Model): boolean {
    return item?.get('pinned') || item?.get('recent') || item?.get('frequent');
}
