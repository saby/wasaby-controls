import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data/compatible/Controller';
import { Loader, TConfigLoadResult } from 'Controls-DataEnv/dataLoader';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments, IListDataFactoryLoadResult } from 'Controls/dataFactory';
import {
    checkOptionsOnMount,
    default as ListContainerConnectedCompatible,
} from './ListContainerConnectedCompatible';
import type { RecordSet } from 'Types/collection';
import type { INavigationSourceConfig } from 'Controls/interface';
import { Logger } from 'UI/Utils';

// TODO: Убрать статические импорты.
import 'Controls/listAspects';

export interface IDataControllerOptions
    extends Omit<IListDataFactoryArguments, 'name'>,
        IControlOptions {
    _syncOptionsAndSliceOnMount?: boolean;
    disableSource?: boolean;
}

export const DATA_SYNTHETIC_STORE_ID = '_dataSyntheticStoreId';

function needLoad(options: IDataControllerOptions, inst: DataController): boolean {
    if (options.disableSource) {
        if (!options.items) {
            Logger.error('Компонент ItemsView не может работать без items.', inst);
        }
        return false;
    }
    return !options.sourceController;
}

function normalizeConfigs(
    options: IDataControllerOptions
): Record<'_dataSyntheticStoreId', IDataConfig<IListDataFactoryArguments>> {
    return {
        [DATA_SYNTHETIC_STORE_ID]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                ...options,
                sliceOwnedByBrowser: true,
                dataLoadCallback: null,
                // Чтобы в обычном списке не запускался поиск, если ему передали опцию searchValue.
                // Список должен просто подсветить значение
                searchParam: null,
                filterButtonSource: null,
                // Чтобы в режиме совместимости itemactions "в старом стиле" не попали в интерактор,
                // и для старых контролов не включалась новая логика.
                itemActions: undefined,
            } as Omit<IDataControllerOptions, 'name'>,
        },
    };
}

function getLoadResultFromOptions(
    options: IDataControllerOptions
): Record<string, IListDataFactoryLoadResult> {
    const sourceController = options.sourceController;

    return {
        [DATA_SYNTHETIC_STORE_ID]: {
            ...(options as Omit<IDataControllerOptions, 'name'>),
            ...(sourceController
                ? {
                      data: sourceController.getItems(),
                      error: sourceController.getLoadError(),
                  }
                : {}),
        },
    } as Record<string, IListDataFactoryLoadResult>;
}

export default class DataController extends Control<
    IDataControllerOptions,
    Promise<TConfigLoadResult> | void
> {
    protected _template: TemplateFunction = template;
    protected _loadResults: Record<'_dataSyntheticStoreId', IListDataFactoryLoadResult> | null;
    protected _configs: Record<
        '_dataSyntheticStoreId',
        IDataConfig<IListDataFactoryArguments>
    > | null;
    protected _children: {
        containerConnected: typeof ListContainerConnectedCompatible;
    };

    protected _beforeMount(options: IDataControllerOptions): Promise<TConfigLoadResult> | void {
        const configs = normalizeConfigs(options);
        let changedOptions = [];

        // Костыльная опция для совместимости
        // Когда используют один sourceController на несколько списков и опции sourceController'a не синхронизируют с опциями списка,
        // надо решать на прикладном уровне, но из-за того, что это раньше работало у нас, пока делаю опцию.
        if (options._syncOptionsAndSliceOnMount && options.sourceController) {
            changedOptions = checkOptionsOnMount(
                options,
                options.sourceController.getState(),
                this
            );

            if (changedOptions.length) {
                options.sourceController.updateOptions(options);
            }
        }

        if (needLoad(options, this) || changedOptions.length) {
            return Loader.load(configs).then((results) => {
                this._configs = configs;
                this._loadResults = results;
            });
        } else {
            this._configs = configs;
            this._loadResults = getLoadResultFromOptions(options);
        }
    }

    protected _beforeUnmount(): void {
        this._configs = null;

        if (needLoad(this._options, this) && this._loadResults) {
            this._loadResults.sourceController?.destroy();
        }

        this._loadResults = null;
    }

    reload(config: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._children.containerConnected?.reload?.(config);
    }
}
