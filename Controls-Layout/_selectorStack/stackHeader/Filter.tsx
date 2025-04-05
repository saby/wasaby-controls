import { useStrictSlice } from 'Controls-DataEnv/context';
import { View as FilterSearchView } from 'Controls-ListEnv/filterSearchConnected';
import { Input } from 'Controls-ListEnv/searchConnected';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Ref, forwardRef, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import type { ListSlice } from 'Controls/dataFactory';
import 'css!Controls-Layout/selectorStack';

interface IFilterProps extends IControlProps {
    filterNames?: string[];
    storeId: string;
    searchFilterNames?: string[];
}

const Filter = forwardRef((props: IFilterProps, ref: Ref<HTMLDivElement>): ReactElement | null => {
    const { storeId, filterNames, searchFilterNames, ...filterProps } = props;
    const listSlice = useStrictSlice<ListSlice>(storeId);
    let FilterControl;

    if (listSlice.state.searchParam) {
        if (listSlice.state.filterDescription) {
            FilterControl = FilterSearchView;
        } else {
            FilterControl = Input;
        }
    } else if (listSlice.state.filterDescription) {
        FilterControl = FilterView;
    }

    return FilterControl ? (
        <FilterControl
            {...filterProps}
            storeId={props.storeId}
            filterNames={filterNames}
            contrastBackground={true}
            searchFilterNames={searchFilterNames}
            ref={ref}
        />
    ) : null;
});

export default Filter;
