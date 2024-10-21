import { Slice } from 'Controls-DataEnv/slice';
import { ISearchState, ISearchDataFactoryParams } from './interfaces';

class SearchSlice extends Slice<ISearchState> {
    readonly '[ISearchSlice]': boolean = true;

    protected _initState(
        loadResult: {},
        dataFactoryParams: ISearchDataFactoryParams
    ): ISearchState {
        const searchInitialValue = dataFactoryParams.searchValue || '';
        return {
            searchValue: searchInitialValue,
            searchInputValue: searchInitialValue,
        };
    }

    search(searchValue: string): void {
        this.setState({
            searchValue,
            searchInputValue: searchValue,
        });
    }

    setSearchInputValue(value: string): void {
        this.setState({
            searchInputValue: value,
        });
    }

    resetSearch(): void {
        this.setState({
            searchValue: '',
            searchInputValue: '',
        });
    }

    resetSearchQuery(): void {
        this.setState({
            searchValue: '',
        });
    }
}

export { SearchSlice };
