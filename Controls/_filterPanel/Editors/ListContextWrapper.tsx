import { ReactElement, useEffect, useContext } from 'react';
import { useSlice, Provider, useContextNode } from 'Controls-DataEnv/context';
import { IListEditorOptions } from './List/interface/IList';
import List from './List';
import { FilterDescriptionContext, FilterPanelContext } from '../View/Context';
import { FILTER_CONTEXT_NODE_NAME, ListSlice } from 'Controls/dataFactory';

function ListWithContext(props: IListEditorOptions): ReactElement | null {
    const filterItem = useContext(FilterDescriptionContext);
    const slice = useSlice<ListSlice>(filterItem.name);
    const { editorsViewMode } = useContext(FilterPanelContext);
    const items = slice?.state.items;
    const isVisible =
        filterItem.viewMode === 'extended' ||
        editorsViewMode === 'cloud' ||
        !items ||
        items.getCount();

    useEffect(() => {
        if (!isVisible) {
            slice?.setState({
                filter: props.filter,
                source: props.source,
                sorting: props.sorting,
                navigation: props.navigation,
            });
        }
    }, [props.filter, props.source, props.sorting, props.navigation, isVisible, slice]);

    return isVisible ? <List {...props} slice={slice} /> : null;
}

export default function ListContextWrapper(props: IListEditorOptions): ReactElement {
    const contextNode = useContextNode();

    if (contextNode.hasChildren(FILTER_CONTEXT_NODE_NAME)) {
        return (
            <Provider dataLayoutId={FILTER_CONTEXT_NODE_NAME}>
                <ListWithContext {...props} />
            </Provider>
        );
    } else {
        return <List {...props} />;
    }
}
