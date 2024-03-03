import { Slice } from 'Controls-DataEnv/slice';
import {
    IFilterItem,
    FilterDescription,
    FilterCalculator,
    FilterHistory,
    FilterLoader,
} from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import { IFilterArguments, IFilterLoadResult, IFilterState } from './interface';

/**
 * Слайс фильтра
 * Реализует интерфейс, с которым работают connected контролы фильтрации
 */
export default class FilterSlice extends Slice<IFilterState> {
    readonly '[IFilterSlice]': boolean = true;

    applyFilterDescription(filterDescription: IFilterItem[]): void {
        const currentFilter = FilterCalculator.getFilterByFilterDescription(
            {},
            this.state.filterDescription
        );
        const newFilterDescription = FilterDescription.applyFilterDescription(
            this.state.filterDescription,
            filterDescription,
            currentFilter
        );
        if (newFilterDescription) {
            FilterDescription.applyFilterDescriptionToURL(
                newFilterDescription,
                this.state.saveToUrl
            );
            if (this.state.historyId) {
                FilterHistory.update(newFilterDescription, this.state.historyId);
            }
        }
        this.setState({
            filterDescription: newFilterDescription,
        });
    }

    resetFilterDescription(): void {
        const newFilterDescription = FilterDescription.resetFilterDescription(
            this.state.filterDescription
        );

        if (this.state.historyId) {
            FilterHistory.update(newFilterDescription, this.state.historyId);
        }

        if (this.state.saveToUrl) {
            FilterDescription.applyFilterDescriptionToURL(
                newFilterDescription,
                this.state.saveToUrl
            );
        }

        this.setState({
            filterDescription: newFilterDescription,
        });
    }

    /**
     * Открыть окна фильтров
     * @function Controls/_dataFactory/List/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    openFilterDetailPanel(): void {
        this.setState({
            filterDetailPanelVisible: true,
        });
    }

    /**
     * Закрыть окна фильтров
     * @function Controls/_dataFactory/List/Slice#openFilterDetailPanel
     * @public
     * @return {void}
     */
    closeFilterDetailPanel(): void {
        this.setState({
            filterDetailPanelVisible: false,
        });
    }

    reloadFilterItem(filterName: string): void | Promise<RecordSet | Error> {
        return FilterLoader.reloadFilterItem(filterName, this.state.filterDescription);
    }

    override _initState(loadResult: IFilterLoadResult, config: IFilterArguments): IFilterState {
        const filterDescription = loadResult.filterDescription || config.filterDescription;

        if (filterDescription) {
            FilterLoader.initFilterDescriptionFromData(filterDescription);
        }

        return {
            filterDescription: loadResult.filterDescription || config.filterDescription,
            historyId: config.historyId,
            saveToUrl: config.saveToUrl,
            filterDetailPanelVisible: false,
        };
    }
}
