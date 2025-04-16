import { Control, TemplateFunction } from 'UI/Base';
import { IBrowserOptions } from 'Controls/browser';
import { IDataConfig } from 'Controls/dataFactory';
import { ICompatibleListDataFactoryArguments } from 'Controls/dataFactory';
import { getDataFactoryArguments } from 'Controls/baseList';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TFilter } from 'Controls/interface';
import { isEqual } from 'Types/object';
import * as template from 'wml!Controls/_browserSliced/BrowserSliced/BrowserSliced';

type TFactoryConfig = Record<string, IDataConfig<ICompatibleListDataFactoryArguments>>;

const BROWSER_SYNTHETIC_STORE_ID = '_browserSyntheticStoreId';

export default class BrowserSliced extends Control<IBrowserOptions> {
    protected _template: TemplateFunction = template;
    protected _configs: Record<string, IDataConfig<ICompatibleListDataFactoryArguments>>;
    protected _filter: TFilter;

    protected _beforeMount(options: IBrowserOptions): Promise<void> | void {
        this._configs = this._normalizeConfigs(options);
        this._filter = options.filter;
    }

    protected _beforeUpdate({ filter }: IBrowserOptions) {
        if (!isEqual(this._options.filter, filter)) {
            this._filter = filter;
        }
    }

    private _normalizeConfigs(
        options: IBrowserOptions
    ): Record<string, IDataConfig<ICompatibleListDataFactoryArguments>> {
        const configs: TFactoryConfig = {};

        if (options.listsOptions) {
            options.listsOptions.forEach((listOptions) => {
                configs[listOptions.id] = {
                    dataFactoryName: 'Controls/dataFactory:CompatibleList',
                    dataFactoryArguments: this._getDataFactoryArguments({
                        ...options,
                        ...listOptions,
                    }),
                };
            });
        } else {
            configs[BROWSER_SYNTHETIC_STORE_ID] = {
                dataFactoryName: 'Controls/dataFactory:CompatibleList',
                dataFactoryArguments: this._getDataFactoryArguments(options),
            };
        }

        return configs;
    }

    private _getDataFactoryArguments(
        options: IBrowserOptions | IBrowserOptions['listsOptions'][0]
    ): ICompatibleListDataFactoryArguments {
        return {
            ...getDataFactoryArguments(
                {
                    ...options,
                    minSearchLength: options.minSearchLength as number | undefined,
                },
                this
            ),
            searchParam: options.searchParam,
            filterButtonSource: options.filterButtonSource,
            displayProperty: options.displayProperty || 'title',
        };
    }

    async resetPrefetch(): Promise<void> {
        const { Prefetch } = await loadAsync<{
            Prefetch: { clearPrefetchSession: (filter: TFilter) => TFilter };
        }>('Controls-ListEnv/filterPrefetch');
        const { slice } = this._options;
        slice?.setState({
            filter: Prefetch.clearPrefetchSession({
                ...slice?.state.filter,
            }),
        });
    }
}
