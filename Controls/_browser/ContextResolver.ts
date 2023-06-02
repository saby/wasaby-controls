/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, Control } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/ContextResolver';
import { IBrowserOptions } from 'Controls/_browser/Browser';
import {
    ILoadDataResult,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { ControllerClass as SearchController } from 'Controls/search';
import { ControllerClass as FilterController } from 'Controls/filter';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { PrefetchProxy, ICrudPlus } from 'Types/source';

export interface IBrowserContextResolverOptions extends IBrowserOptions {
    storeId: number | string;
    _dataOptionsValue: any;
}

export default class BrowserWrapper extends Control<IBrowserContextResolverOptions> {
    protected _template: TemplateFunction = template;
    protected _sourceController: SourceController;
    protected _searchController: SearchController;
    protected _operationsController: OperationsController;
    protected _filterController: FilterController;

    protected _findPrefetchResult(
        options: IBrowserContextResolverOptions
    ): ILoadDataResult {
        const hasKey =
            options.hasOwnProperty('storeId') && options.storeId !== undefined;
        const context = options._dataOptionsValue;
        if (hasKey) {
            return context[options.storeId];
        } else {
            let result = null;
            Object.values(context)
                .filter((data: ILoadDataResult) => {
                    return data instanceof Object && data.type === 'list';
                })
                .forEach((value: ILoadDataResult) => {
                    if (
                        !result &&
                        BrowserWrapper._isSameOptionsInPrefetchAndControl(
                            value,
                            options
                        )
                    ) {
                        result = value;
                    }
                });

            return result;
        }
    }

    private _resolveControllers(options: IBrowserContextResolverOptions): void {
        if (!options.listsOptions && options.storeId) {
            const prefetchResult = this._findPrefetchResult(options);
            if (prefetchResult) {
                this._filterController = prefetchResult.filterController;
                this._searchController = prefetchResult.searchController;
                this._operationsController =
                    prefetchResult.operationsController;
                this._sourceController = prefetchResult.sourceController;
            }
        }
    }

    protected _beforeMount(options: IBrowserContextResolverOptions): void {
        if (options._dataOptionsValue) {
            this._resolveControllers(options);
        }
    }

    protected _beforeUpdate(options: IBrowserContextResolverOptions): void {
        if (
            options._dataOptionsValue &&
            options._dataOptionsValue !== this._options._dataOptionsValue
        ) {
            this._resolveControllers(options);
        }
    }

    private static _isSameOptionsInPrefetchAndControl(
        value: ILoadDataResult,
        options: IBrowserOptions
    ): boolean {
        const isSameHistoryId =
            value.filterController?.getHistoryId() === options.historyId;
        const isSameSource =
            value.sourceController?.getSource() ===
            BrowserWrapper._getOriginSource(options.source);
        const isSameSourceController =
            value.sourceController === options.sourceController;
        return (isSameHistoryId && isSameSource) || isSameSourceController;
    }

    private static _getOriginSource(
        source: PrefetchProxy | ICrudPlus
    ): ICrudPlus {
        if (source instanceof PrefetchProxy) {
            return source.getOriginal();
        }
        return source;
    }
}
