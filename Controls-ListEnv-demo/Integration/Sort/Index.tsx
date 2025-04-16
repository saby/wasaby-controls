import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';

import SortDemo from 'Controls-ListEnv-demo/WI/Sort/Index';

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <SortDemo ref={ref}/>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SortDemo.getLoadConfig()
        };
    },
});
