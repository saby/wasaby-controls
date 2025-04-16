import { ReactElement, useEffect, useContext, forwardRef, ForwardedRef, useRef } from 'react';
import { useSlice, Provider, useContextNode } from 'Controls-DataEnv/context';
import { IListEditorOptions } from './List/interface/IList';
import List from './List';
import { FilterDescriptionContext, FilterPanelContext } from '../View/Context';
import { FILTER_CONTEXT_NODE_NAME, ListSlice } from 'Controls/dataFactory';

const ListWithContext = forwardRef(
    (props: IListEditorOptions, ref: ForwardedRef<HTMLDivElement>): ReactElement | null => {
        const filterItem = useContext(FilterDescriptionContext);
        const slice = useSlice<ListSlice>(filterItem.name);
        const { editorsViewMode } = useContext(FilterPanelContext);
        const isMountedRef = useRef<boolean>(false);
        const items = slice?.state.items;
        const isVisible =
            filterItem.viewMode === 'extended' ||
            editorsViewMode === 'cloud' ||
            !items ||
            items.getCount();

        useEffect(() => {
            if (!isVisible && slice) {
                slice.setState({
                    filter: props.filter,
                    source: props.source,
                    sorting: props.sorting,
                    navigation: props.navigation,
                });
                if (!isMountedRef.current && !slice.state.loading) {
                    slice.reload();
                }
            }
        }, [props.filter, props.source, props.sorting, props.navigation, isVisible, slice]);

        useEffect(() => {
            isMountedRef.current = true;
        }, []);

        return isVisible ? (
            <List {...props} slice={slice} ref={ref} />
        ) : (
            <div ref={ref} className={'tw-contents'} />
        );
    }
);

export default forwardRef(function ListContextWrapper(
    props: IListEditorOptions,
    ref: ForwardedRef<HTMLDivElement>
): ReactElement {
    if (useContextNode().hasChildren(FILTER_CONTEXT_NODE_NAME)) {
        return (
            <Provider dataLayoutId={FILTER_CONTEXT_NODE_NAME}>
                <ListWithContext {...props} ref={ref} />
            </Provider>
        );
    } else {
        return <List {...props} ref={ref} />;
    }
});
