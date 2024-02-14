/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, Control } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/ContextResolver';
import { IBrowserOptions } from 'Controls/_browser/Browser';
import { ILoadDataResult, NewSourceController as SourceController } from 'Controls/dataSource';
import { ControllerClass as SearchController } from 'Controls/searchDeprecated';
import { ControllerClass as FilterController } from 'Controls/filter';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { connectToDataContext } from 'Controls/context';

export interface IBrowserContextResolverOptions extends IBrowserOptions {
    storeId: string;
    _dataOptionsValue: any;
}

class BrowserWrapper extends Control<IBrowserContextResolverOptions> {
    protected _template: TemplateFunction = template;
    protected _sourceController: SourceController;
    protected _searchController: SearchController;
    protected _operationsController: OperationsController;
    protected _filterController: FilterController;

    protected _findPrefetchResult(options: IBrowserContextResolverOptions): ILoadDataResult {
        if (options.storeId !== undefined) {
            return options._dataOptionsValue[options.storeId];
        }
    }

    private _resolveControllers(options: IBrowserContextResolverOptions): void {
        if (!options.listsOptions && options.storeId) {
            const prefetchResult = this._findPrefetchResult(options);
            if (prefetchResult) {
                this._filterController = prefetchResult.filterController;
                this._searchController = prefetchResult.searchController;
                this._operationsController = prefetchResult.operationsController;
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
}

BrowserWrapper.displayName = 'Controls/_browser/ContextResolver';
export default connectToDataContext(BrowserWrapper);
