import * as React from 'react';

import { TemplateFunction } from 'UICommon/base';

import {
    IItemTemplateProps,
    MoreButtonTemplate,
    getItemEventHandlers,
} from 'Controls/baseList';
import {
    ExpanderBlockComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/baseTree';

import TreeNodeExtraItem from '../display/TreeNodeExtraItem';
import { INodeHeaderTemplateOptions } from '../interface/NodeHeaderTemplate';

interface IProps
    extends IItemTemplateProps,
        IExpanderProps,
        INodeHeaderTemplateOptions {
    content: TemplateFunction;
}

export default function NodeExtraItemComponent(
    props: IProps
): React.ReactElement {
    const item = (props.item || props.itemData) as unknown as TreeNodeExtraItem;

    const content = props.content ? (
        <props.content item={item.getNode()} itemData={item.getNode()} />
    ) : (
        <MoreButtonTemplate
            buttonView={props.navigationButtonView}
            buttonConfig={props.navigationButtonConfig}
            loadMoreCaption={item.getMoreCaption()}
            linkFontColorStyle={item.getMoreFontColorStyle()}
            linkFontSize={'xs'}
            linkClass={item.getMoreClasses()}
        />
    );

    const handlers = getItemEventHandlers(item, props);
    return (
        <div
            {...handlers}
            className={item.getItemClasses()}
            item-key={item.key}
            data-qa={item.listElementName}
        >
            <div className={item.getContentClasses()}>
                {<ExpanderBlockComponent {...getExpanderProps(props, item)} />}
                {content}
            </div>
        </div>
    );
}
