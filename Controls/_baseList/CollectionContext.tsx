import * as React from 'react';

import { Collection } from 'Controls/display';

export const CollectionContext = React.createContext<Collection>(null);

export default function Provider(props: { children: React.ReactElement; collection: Collection }) {
    return (
        <CollectionContext.Provider value={props.collection}>
            {props.children}
        </CollectionContext.Provider>
    );
}
