import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

export function getEmptyView(props: IGridViewProps): React.ReactElement {
    const { needShowEmptyTemplate, collection } = props;
    if (!needShowEmptyTemplate) {
        return null;
    }

    const item = collection.getEmptyGridRow();
    return (
        <CollectionItemContext.Provider value={item}>
            <RowComponent
                {...item.getRowComponentProps()}
                item={null}
                data-qa={'empty-view'}
            />
        </CollectionItemContext.Provider>
    );
}
