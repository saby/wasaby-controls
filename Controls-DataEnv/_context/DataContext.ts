import * as React from 'react';
import { IoC } from 'Env/Env';
import { Slice } from 'Controls-DataEnv/slice';

const DataContext = React.createContext<Record<string, Slice>>(undefined);

DataContext.displayName = 'Controls-DataEnv/context:DataContext';

IoC.resolve('ILogger').log(
    'Модуль Controls-DataEnv/context:DataContext проинициализировался'
);

export default DataContext;
