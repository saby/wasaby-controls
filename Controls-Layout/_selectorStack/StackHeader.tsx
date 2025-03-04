import { useSlice } from 'Controls-DataEnv/context';
import { View as FilterSearchView } from 'Controls-ListEnv/filterSearchConnected';
import { Input } from 'Controls-ListEnv/searchConnected';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Ref, forwardRef } from 'react';
import 'css!Controls-Layout/selectorStack';
import type { ListSlice } from 'Controls/dataFactory';

export const HeaderTemplate = forwardRef(
    (
        props: { filterNames: string[]; storeId: string; searchFilterNames: string[] },
        ref: Ref<HTMLDivElement>
    ): JSX.Element | null => {
        const listSlice = useSlice(props.storeId) as ListSlice;
        const HeaderControl = listSlice.state?.searchParam
            ? props.filterNames
                ? FilterSearchView
                : Input
            : FilterView;
        return (
            <div
                ref={ref}
                className={
                    'controls-Layout-SelectorStack__header controls-padding_left-xl controls-padding_right-xl'
                }
            >
                <HeaderControl {...props} />
            </div>
        );
    }
);
