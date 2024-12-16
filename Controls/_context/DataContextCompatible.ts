import { createContext } from 'react';

const DataContextCompatible = createContext(undefined);
DataContextCompatible.displayName = 'Controls/context:DataContextCompatible';

export const Provider = DataContextCompatible.Provider;
export default DataContextCompatible;
