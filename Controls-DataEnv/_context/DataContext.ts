import * as React from 'react';
import { IoC } from 'Env/Env';

const global = (function () {
    // eslint-disable-next-line no-eval
    return this || (0, eval)('this');
})();

if (!global._controlsDataContext) {
    const DataContext = React.createContext(undefined);
    DataContext.displayName = 'Controls-DataEnv/context:DataContext';
    global._controlsDataContext = DataContext;
}
IoC.resolve('ILogger').log(
    'Модуль Controls-DataEnv/context:DataContext проинициализировался'
);
export default global._controlsDataContext;
