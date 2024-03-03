import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { IGridViewProps } from 'Controls/_gridReact/view/interface';

export function getResults(props: IGridViewProps): React.ReactElement {
    const results = props.collection?.getResults();
    if (!results) {
        return null;
    }

    return (
        <CollectionItemContext.Provider value={results}>
            <RowComponent
                {...results.getRowComponentProps()}
                item={null}
                cCount={props.cCount}
                data-qa={'results'}
            />
        </CollectionItemContext.Provider>
    );
}
