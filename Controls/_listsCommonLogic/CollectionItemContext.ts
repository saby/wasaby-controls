import * as React from 'react';

import type { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

interface ICollectionItemContextValue {
    item: CollectionItem;
    itemContents: Model;
}

const CollectionItemContext = React.createContext<ICollectionItemContextValue | null>(null);

CollectionItemContext.displayName = 'CollectionItemContext';

export { CollectionItemContext, ICollectionItemContextValue };
