import { memo, forwardRef } from 'react';
import { IPadding } from 'Controls/interface';
import { View as TreeView } from 'Controls/treeGrid';
import { Container as ScrollContainer, SCROLL_MODE, SHADOW_MODE } from 'Controls/scroll';
import 'css!Controls-Input-editors/NameEditor/DataMapTree';

const TREE_ITEM_PADDING: IPadding = {
    left: 'S',
    right: 'S',
};

export const DataMapTree = memo(
    forwardRef((props, ref) => {
        return (
            <ScrollContainer
                ref={ref}
                scrollbarVisible={false}
                shadowMode={SHADOW_MODE.ROUNDED}
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className="tw-h-full"
            >
                <TreeView
                    className="controls-DataMapTree"
                    expanderIcon="hiddenNode"
                    contextMenuVisibility={false}
                    itemPadding={TREE_ITEM_PADDING}
                    searchNavigationMode="expand"
                    style="master"
                    {...props}
                />
            </ScrollContainer>
        );
    })
);
