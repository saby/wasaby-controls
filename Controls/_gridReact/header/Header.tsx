import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

export function getHeaderElements(props: IGridViewProps): React.ReactElement {
    const header = props.collection?.getHeader();
    if (!header) {
        return null;
    }

    const headerRow = header.getRow();

    return (
        <CollectionItemContext.Provider value={headerRow}>
            <RowComponent
                {...headerRow.getRowComponentProps()}
                item={null}
                cCount={props.cCount}
                data-qa={'header'}
            />
        </CollectionItemContext.Provider>
    );
}
