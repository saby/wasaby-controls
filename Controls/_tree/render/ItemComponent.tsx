import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

import { IItemTemplateProps, ItemComponent } from 'Controls/baseList';

import { default as CollectionTreeItem } from 'Controls/_tree/display/TreeItem';
import {
    ExpanderBlockComponent,
    ExpanderComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/baseTree';

interface IProps extends IItemTemplateProps, IExpanderProps {}

function TreeItemComponent(props: IProps): React.ReactElement {
    const item = (props.item ||
        props.itemData) as unknown as CollectionTreeItem;

    const displayExpanderBlock = item.shouldDisplayExpanderBlock(
        props.expanderPaddingVisibility
    );
    // Навешиваем отступ слева на экспандер, если отображается чекбокс.
    // Т.к. чекбокс абсолютом и находится на месте отступа.
    // По идее нужно сделать чекбокс релативным и всегда вешать отступ слева на контент
    const leftSpaceClassName = item.getLeftSpaceClassName();
    const hasCheckboxLeft =
        item.getMultiSelectVisibility() !== 'hidden' &&
        item.getMultiSelectPosition() !== 'custom';
    const leftSpaceOnExpander = displayExpanderBlock && hasCheckboxLeft;
    const expanderClassName = leftSpaceOnExpander ? leftSpaceClassName : null;

    const beforeContentRender = displayExpanderBlock && (
        <ExpanderBlockComponent
            {...getExpanderProps(props, item)}
            className={expanderClassName}
        />
    );
    const afterContentRender = item.getExpanderPosition() === 'right' && (
        <ExpanderComponent {...getExpanderProps(props, item)} />
    );

    const contentTemplateProps = React.useMemo(() => {
        return {
            expanderTemplate: (expanderProps: TInternalProps) => {
                return (
                    item.getExpanderPosition() === 'custom' && (
                        <ExpanderComponent
                            {...getExpanderProps(props, item)}
                            attrs={expanderProps.attrs}
                            ref={expanderProps.ref}
                        />
                    )
                );
            },
        };
    }, [item, item.getExpanderPosition(), item.isExpanded()]);

    const className = `${!leftSpaceOnExpander ? leftSpaceClassName : ''} ${
        props.className || ''
    }`;
    return (
        <ItemComponent
            {...props}
            className={className}
            beforeContentRender={beforeContentRender}
            afterContentRender={afterContentRender}
            contentTemplateProps={contentTemplateProps}
        />
    );
}

export default React.memo(TreeItemComponent);
