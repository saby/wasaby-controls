import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Page/PageTemplate/PageTemplate';
import { PageController } from 'Controls/dataSource';

interface IPopupLayoutOptions extends IControlOptions {
    prefetchResult: Promise<Record<string, object>>;
    pageTemplate: string;
    pageTemplateOptions: string;
}
export default class Template extends Control<IPopupLayoutOptions, void> {
    _template: TemplateFunction = template;
    _prefetchResult: object;
    _prefetchPromise: IPopupLayoutOptions['prefetchResult'];
    _contextPrefetchValue: Record<string, unknown>;

    protected _beforeMount(options?: IPopupLayoutOptions): void {
        if (options.prefetchResult) {
            this._awaitPrefetch(options.prefetchResult);
        }
    }
    protected _beforeUpdate(options?: IPopupLayoutOptions): void {
        if (options.prefetchResult !== this._options.prefetchResult) {
            this._awaitPrefetch(options.prefetchResult);
        }
    }
    private _awaitPrefetch(
        prefetch: IPopupLayoutOptions['prefetchResult']
    ): void {
        if (this._prefetchPromise) {
            this._prefetchPromise.cancel();
        }
        this._prefetchPromise = prefetch.then((prefetchResult) => {
            this._prefetchResult =
                PageController.prepareLoadResult(prefetchResult);
            this._contextPrefetchValue = prefetchResult;
            this._prefetchPromise = null;
            return prefetchResult;
        });
    }
}
