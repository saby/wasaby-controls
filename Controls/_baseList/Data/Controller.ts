import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data/Controller';
import { Loader, TConfigLoadResult } from 'Controls-DataEnv/dataLoader';
import { TDataConfigs } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments, IListDataFactoryLoadResult } from 'Controls/dataFactory';

export interface IDataControllerOptions
    extends Omit<IListDataFactoryArguments, 'name'>,
        IControlOptions {}

export const DATA_SYNTHETIC_STORE_ID = '_dataSyntheticStoreId';

function needLoad(options: IDataControllerOptions): boolean {
    return !options.sourceController;
}

function normalizeConfigs(
    options: IDataControllerOptions
): TDataConfigs<IListDataFactoryArguments> {
    return {
        [DATA_SYNTHETIC_STORE_ID]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                ...options,
                sliceOwnedByBrowser: true,
                dataLoadCallback: null,
                // Чтобы в обычном поиске не запускался поиск, если ему передали опцию searchValue.
                // Список должен просто подсветить значение
                searchParam: null,
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
            data: sourceController.getItems(),
            error: sourceController.getLoadError(),
        },
    } as Record<string, IListDataFactoryLoadResult>;
}

export default class DataController extends Control<
    IDataControllerOptions,
    Promise<TConfigLoadResult> | void
> {
    protected _template: TemplateFunction = template;
    protected _loadResults: TConfigLoadResult;
    protected _configs: TDataConfigs<IListDataFactoryArguments>;

    protected _beforeMount(options: IDataControllerOptions): Promise<TConfigLoadResult> | void {
        const configs = normalizeConfigs(options);

        if (needLoad(options)) {
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
        this._loadResults = null;
    }
}
