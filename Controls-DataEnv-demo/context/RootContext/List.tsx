import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';

function ListComponent(props: { storeId: string }): JSX.Element {
    const slice = React.useContext(DataContext)[props.storeId];

    return slice.state.items.map((item) => {
        return <div key={item.id}>{item.name}</div>;
    });
}

export default React.forwardRef(ListComponent);
