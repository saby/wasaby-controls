import * as React from 'react';
import { MyComponent } from './MyComponent';
import { DataContext } from 'Controls-DataEnv/context';

export function MyConnectedComponent(props): JSX.Element {
    const dataContext = React.useContext(DataContext);
    const expanded = dataContext.expandedSlice.expanded;
    return <MyComponent contentVisible={expanded} />;
}
