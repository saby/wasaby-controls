/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { default as NewSourceController, IControllerState } from 'Controls/_dataSource/Controller';
import { ControllerClass as FilterController, IFilterControllerOptions } from 'Controls/filter';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
// eslint-disable-next-line deprecated-anywhere
import { ControllerClass as SearchController, ISearchControllerOptions } from 'Controls/searchDeprecated';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import { Guid } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { ILoadDataResult } from './interface/ILoadDataResult';

/**
 * Класс реализующий хранилище предзагруженных данных
 * @private
 */
export class Storage {
    private _storage: Map<string, ILoadDataResult> = new Map();

    getList(id?: string): ILoadDataResult {
        if (id) {
            return this.get(id);
        } else {
            let config = null;
            this.each((storageConfig) => {
                if (!config && (storageConfig?.type === 'list' || storageConfig.source)) {
                    config = storageConfig;
                }
            });
            return config;
        }
    }

    getSourceController(id?: string): NewSourceController {
        const config = this.getList(id);
        let { sourceController } = config;
        const { filterButtonSource, fastFilterSource } = config;

        if (!sourceController) {
            sourceController = config.sourceController = this._getSourceController(config);

            if (filterButtonSource || fastFilterSource) {
                sourceController.setFilter(this.getFilterController(id).getFilter());
            }
        }

        return sourceController;
    }

    setSourceController(id: string, sourceController: NewSourceController): void {
        this.getList(id).sourceController = sourceController;
    }

    getFilterController(id?: string): FilterController {
        const config = this.getList(id);
        let { filterController } = config;
        const { historyItems } = config;

        if (!filterController) {
            if (isLoaded('Controls/filter')) {
                filterController = config.filterController = this._getFilterController(
                    config as IFilterControllerOptions
                );

                if (historyItems) {
                    filterController.applyFilterDescriptionFromHistory(config.historyItems);
                }
            }
        }
        return filterController;
    }

    setFilterController(id: string, filterController: FilterController): void {
        this.getList(id).filterController = filterController;
    }

    getSearchController(id?: string): Promise<SearchController> {
        const config = this.getList(id);
        if (!config.searchController) {
            if (!config.searchControllerCreatePromise) {
                // eslint-disable-next-line deprecated-anywhere
                config.searchControllerCreatePromise = import('Controls/searchDeprecated').then(
                    (result) => {
                        config.searchController = new result.ControllerClass({
                            ...config,
                        } as ISearchControllerOptions);

                        return config.searchController;
                    }
                );
            }
            return config.searchControllerCreatePromise;
        }

        return Promise.resolve(config.searchController);
    }

    getSearchControllerSync(id?: string): SearchController {
        const config = this.getList(id);

        if (
            !config?.searchController &&
            config?.searchParam &&
            config?.sourceController &&
            isLoaded('Controls/search')
        ) {
            // eslint-disable-next-line deprecated-anywhere
            const searchControllerClass = loadSync<typeof import('Controls/searchDeprecated')>(
              // eslint-disable-next-line deprecated-anywhere
                'Controls/searchDeprecated'
            ).ControllerClass;
            config.searchController = new searchControllerClass({
                ...config,
            } as ISearchControllerOptions);
        }
        return config?.searchController;
    }

    getState(): Record<string, IControllerState> {
        const state = {};
        this.each((config, id) => {
            state[id] = {
                ...config,
                ...this.getSourceController(id).getState(),
            };
        });
        return state;
    }

    destroy(): void {
        this.each(({ sourceController }) => {
            sourceController?.destroy();
        });
        this._storage.clear();
    }

    each(callback: Function): void {
        this._storage.forEach((config: ILoadDataResult, id) => {
            callback(config, id);
        });
    }

    set(data: ILoadDataResult, id?: string): void {
        // id может быть 0, поэтому проверка на null и undefined
        const key = id ?? Guid.create();
        this._storage.set(String(key), data);
    }

    get(id?: string): ILoadDataResult {
        let config;

        if (!id) {
            config = this._storage.entries().next().value[1];
        } else if (id) {
            config = this._storage.get(id);
        } else {
            Logger.error('Controls/dataSource:loadData: ????');
        }

        return config;
    }

    protected _getFilterController(options: IFilterControllerOptions): FilterController {
        const controllerClass =
            loadSync<typeof import('Controls/filter')>('Controls/filter').ControllerClass;
        return options.filterController || new controllerClass({ ...options });
    }

    protected _getSourceController(options: IListDataFactoryArguments): NewSourceController {
        let sourceController;

        if (options.sourceController) {
            sourceController = options.sourceController;
            sourceController.updateOptions(options);
        } else {
            const controllerClass =
                loadSync<typeof import('Controls/dataSource')>(
                    'Controls/dataSource'
                ).NewSourceController;
            sourceController = new controllerClass(options);
        }

        return sourceController;
    }
}

export default Storage;
