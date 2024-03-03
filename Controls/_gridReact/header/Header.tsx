import * as React from 'react';
import { CollectionItemContext, IItemEventHandlers } from 'Controls/baseList';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

export function getHeaderElements(
    props: IGridViewProps,
    headerHandlers: IItemEventHandlers
): React.ReactElement {
    const header = props.collection?.getHeader();
    if (!header) {
        return null;
    }

    const headerRow = header.getRow();

    return (
        <CollectionItemContext.Provider value={headerRow}>
            <RowComponent
                {...headerRow.getRowComponentProps()}
                handlers={headerHandlers}
                item={null}
                cCount={props.cCount}
                data-qa={'header'}
            />
        </CollectionItemContext.Provider>
    );
}
