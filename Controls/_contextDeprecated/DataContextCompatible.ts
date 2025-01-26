import { createContext } from 'react';
import { ListSlice } from 'Controls/dataFactory';

const DataContextCompatible = createContext<ListSlice | undefined>(undefined);
DataContextCompatible.displayName = 'Controls/contextDeprecated:DataContextCompatible';

export const Provider = DataContextCompatible.Provider;
export default DataContextCompatible;
