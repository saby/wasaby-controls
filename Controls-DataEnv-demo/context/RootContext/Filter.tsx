import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import Toggle from 'Controls/beautifulToggle';

const items = [
    {
        id: true,
        caption: 'Активен',
    },
    {
        id: false,
        caption: 'Не активен',
    },
];

function FilterComponent(props: { storeId: string }) {
    const context = React.useContext(DataContext);
    const slice = context[props.storeId];
    const filter = slice.state.filter;
    const setFilter = React.useCallback((value) => {
        slice.setState({
            filter: {
                active: value,
            },
        });
    }, []);

    return <Toggle selectedKey={filter.active} items={items} onSelectedKeyChanged={setFilter} />;
}

export default React.forwardRef(FilterComponent);
