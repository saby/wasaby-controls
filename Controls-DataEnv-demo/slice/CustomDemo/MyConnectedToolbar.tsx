import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { Button } from 'Controls/buttons';

export function MyConnectedToolbar(props): JSX.Element {
    const dataContext = React.useContext(DataContext);
    const slice = dataContext.expandedSlice;

    const clickHandler = () => {
        const curState = slice.expanded;
        slice.setState({ expanded: !curState });
    };
    return (
        <div className="myToolbar">
            <Button onClick={clickHandler} caption="Свернуть/Развернуть" />
        </div>
    );
}
