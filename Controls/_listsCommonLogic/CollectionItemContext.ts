import * as React from 'react';

import type { CollectionItem } from 'Controls/display';

const CollectionItemContext = React.createContext<CollectionItem | null>(null);

CollectionItemContext.displayName = 'CollectionItemContext';

export { CollectionItemContext };
