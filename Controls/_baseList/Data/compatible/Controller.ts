import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { delimitProps } from 'UICore/Jsx';
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
import { DATA_SYNTHETIC_STORE_ID } from './constants';
import 'Controls/dataFactory';

type TFactoryConfigs = Record<string, IDataConfig<IListDataFactoryArguments>>;

export interface IDataControllerOptions
    extends Omit<IListDataFactoryArguments, 'name'>,
        IControlOptions {
    _syncOptionsAndSliceOnMount?: boolean;
    disableSource?: boolean;
    factoryConfigs?: TFactoryConfigs;
    storeId: string;
}

function needLoad(options: IDataControllerOptions, inst: Control): boolean {
    if (options.disableSource) {
        if (!options.items) {
            Logger.error('Компонент ItemsView не может работать без items.', inst);
        }
        return false;
    }
    return !(options.sourceController || options.items);
}

export function getDataFactoryArguments(
    options: Omit<IDataControllerOptions, 'storeId'>,
    inst: Control
): IListDataFactoryArguments {
    const {
        clearProps: { name, ...allProps },
    } = delimitProps(options);

    return {
        ...allProps,
        items: needLoad(options, inst) ? undefined : options.items,
        sliceOwnedByBrowser: true,
        // Чтобы в обычном списке не запускался поиск, если ему передали опцию searchValue.
        // Список должен просто подсветить значение
        searchParam: undefined,
        filterButtonSource: undefined,
        // Чтобы в режиме совместимости itemactions "в старом стиле" не попали в интерактор,
        // и для старых контролов не включалась новая логика.
        itemActions: undefined,
    };
}

function normalizeConfigs(
    options: IDataControllerOptions,
    inst: DataController
): Record<string, IDataConfig<IListDataFactoryArguments>> {
    if (options.factoryConfigs) {
        return options.factoryConfigs;
    } else {
        return {
            [options.storeId]: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: getDataFactoryArguments(options, inst),
            },
        };
    }
}

function getLoadResultFromOptions(
    options: IDataControllerOptions
): Record<string, IListDataFactoryLoadResult> {
    const sourceController = options.sourceController;

    return {
        [options.storeId]: {
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
    protected _loadResults: Record<string, IListDataFactoryLoadResult> | null;
    protected _configs: TFactoryConfigs | null;
    protected _children: {
        containerConnected: typeof ListContainerConnectedCompatible;
    };

    protected _beforeMount(options: IDataControllerOptions): Promise<TConfigLoadResult> | void {
        const configs = normalizeConfigs(options, this);
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
            this._loadResults[this._options.storeId].sourceController?.destroy();
        }

        this._loadResults = null;
    }

    reload(config: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._children.containerConnected?.reload?.(config);
    }

    static defaultProps: Partial<IDataControllerOptions> = {
        storeId: DATA_SYNTHETIC_STORE_ID,
    };
}
