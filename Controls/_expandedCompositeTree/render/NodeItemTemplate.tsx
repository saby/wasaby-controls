import { ReactElement, ComponentType } from 'react';
import { ItemTemplate, IItemTemplateProps } from 'Controls/baseList';
import { Title } from 'Controls/heading';
import { TreeItem } from 'Controls/baseTree';

import 'css!Controls/expandedCompositeTree';
import { Highlight } from 'Controls/baseDecorator';
import { EDITOR_SELECTOR_CAPTION } from 'Controls/_expandedCompositeTree/constants';

function CompositeItemContent(
    props: IItemTemplateProps & {
        multiSelectTemplate?: ComponentType;
        itemActionsTemplate?: ComponentType<{ itemActionsClass?: string }>;
    }
): ReactElement {
    const isTopFolder = (props.item as unknown as TreeItem).getParent()?.isRoot();

    let contentClassName =
        'tw-flex-row tw-relative tw-flex controls-ExpandedCompositeTree-composite-item__content';
    const multiSelectClassName = 'controls-ExpandedCompositeTree-composite-item__multiSelect';
    const titleClassName = `tw-truncate js-controls-expandedCompositeTree-composite-item-title ${EDITOR_SELECTOR_CAPTION}`;
    const itemActionsClassName = 'tw-flex-col tw-relative';

    if (isTopFolder) {
        contentClassName += ' controls-margin_bottom-3xs';
    }

    return (
        <div className="tw-flex tw-items-center">
            <div className={contentClassName}>
                {!!props.multiSelectTemplate &&
                    props.item.getMultiSelectVisibility?.() !== 'hidden' && (
                        <div className={multiSelectClassName}>
                            <props.multiSelectTemplate {...props} />
                        </div>
                    )}
                <Title
                    className={titleClassName}
                    caption={
                        <Highlight
                            value={props.item.getDisplayValue()}
                            highlightedValue={props.searchValue || props.item.getSearchValue()}
                        />
                    }
                    fontSize={isTopFolder ? '6xl' : '3xl'}
                    fontColorStyle={props.item.getParent().isRoot() ? 'default' : 'label'}
                />
            </div>
            {!!props.itemActionsTemplate && (
                <div className={itemActionsClassName}>
                    <props.itemActionsTemplate
                        {...props}
                        itemActionsClass="controls-ExpandedCompositeTree-composite-item__itemActions"
                    />
                </div>
            )}
        </div>
    );
}

function NodeItemTemplate(props: IItemTemplateProps): ReactElement {
    const itemTemplateClassName =
        'js-controls-ListView__notEditable js-controls-expandedCompositeTree-composite-item';
    let className = props.className
        ? props.className + ` ${itemTemplateClassName}`
        : itemTemplateClassName;

    className += props.item.getParent().isRoot()
        ? props.item.getChildren?.()?.at(0)?.isNode?.()
            ? ' controls-ExpandedCompositeTree-composite-item-top-node'
            : ''
        : ' controls-ExpandedCompositeTree-composite-item-node';

    return (
        <ItemTemplate
            {...props}
            className={className}
            titlePosition="onImage"
            imageViewMode="rectangle"
            cursor="default"
            highlightOnHover={false}
            contentTemplate={CompositeItemContent}
        />
    );
}

NodeItemTemplate.displayName = 'Controls/expandedCompositeTree:NodeItemTemplate';

export default NodeItemTemplate;
