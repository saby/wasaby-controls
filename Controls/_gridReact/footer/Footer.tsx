import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import { GridFooterRow } from 'Controls/grid';

import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

export function getFooter(props: IGridViewProps): React.ReactElement {
    const footer = props.collection?.getFooter() as unknown as GridFooterRow;
    if (!footer) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={footer}>
            <RowComponent
                {...footer.getRowComponentProps()}
                item={null}
                cCount={props.cCount}
                data-qa={'footer'}
            />
        </CollectionItemContext.Provider>
    );
}
