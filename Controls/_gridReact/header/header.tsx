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
                props={headerRow.getRowComponentProps()}
                item={null}
                itemVersion={headerRow.getVersion()}
                cellsIterator={headerRow.getCellsIterator()}
                hoverBackgroundStyle="none"
                cursor="default"
                handlers={null}
                actionHandlers={null}
                cCount={props.cCount}
                renderFakeHeader={props.renderFakeHeader}
                dataQa={'header'}
            />
        </CollectionItemContext.Provider>
    );
}
