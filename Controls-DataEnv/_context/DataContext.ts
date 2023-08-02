import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';

const DataContext = React.createContext<Record<string, Slice>>(undefined);

DataContext.displayName = 'Controls-DataEnv/context:DataContext';

export default DataContext;
