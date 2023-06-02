/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls/_popupTemplate/Page/Page';
import { PageController } from 'Controls/dataSource';
import { CancelablePromise } from 'Types/entity';

type TPrefetchResult =
    | Record<string, unknown>[]
    | Record<string, Record<string, unknown>>;

interface IPageTemplateOptions extends IControlOptions {
    prefetchResult: Promise<TPrefetchResult> | TPrefetchResult;
    pageTemplate: string;
    pageTemplateOptions: object;
    pageId: string;
}

/**
 * Контрол, который отвечает за построение шаблона страницы в окне
 * @class Controls/_popupTemplate/Page
 * @extends UI/Base:Control
 * @control
 * @private
 */
export default class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _prefetchData: Record<string, unknown>;
    protected _processingLoaders: CancelablePromise<unknown>[] = [];

    protected _beforeMount(options: IPageTemplateOptions): void {
        if (options.prefetchResult) {
            this._processPreloadResult(options.pageId, options.prefetchResult);
        }
    }

    protected _beforeUpdate(options: IPageTemplateOptions): void {
        if (
            options.prefetchResult &&
            this._options.prefetchResult !== options.prefetchResult
        ) {
            this._cancelCurrentLoading();
            this._prefetchData = null;
            this._processPreloadResult(options.pageId, options.prefetchResult);
        }
    }

    protected _beforeUnmount(): void {
        this._cancelCurrentLoading();
    }

    /**
     * Обработчик подгрузки новых страниц внутри попапа.
     * Загружаем для них данные и спускаем вместе с остальными.
     * @param event
     * @param pageKeys
     * @protected
     */
    protected _preloadItemsByKeysHandler(
        event: SyntheticEvent,
        pageKeys: string[]
    ): void {
        const result = {};
        const configs = pageKeys.map((key) => {
            return PageController.getPageConfig(key).then((config) => {
                return PageController.loadData(
                    config,
                    this._options.pageTemplateOptions
                )
                    .then((loaderResult) => {
                        result[key] = loaderResult;
                    })
                    .catch((err) => {
                        // Обрабатываем ошибку промиса, чтобы не красилась консоль
                    });
            });
        });
        const cancellablePromise = new CancelablePromise(Promise.all(configs));
        this._processingLoaders.push(cancellablePromise);
        cancellablePromise.promise.then(() => {
            this._prefetchData = {
                ...this._prefetchData,
                ...result,
            };
            this._processingLoaders.splice(
                this._processingLoaders.indexOf(cancellablePromise),
                1
            );
        });
    }

    /**
     * Отменяем резульататы загрузок, которые не завершились, чтобы они не попапли в новые данные.
     * @protected
     */
    protected _cancelCurrentLoading(): void {
        if (this._processingLoaders) {
            this._processingLoaders.forEach((promise) => {
                promise.cancel();
            });
            this._processingLoaders = [];
        }
    }

    private _processPreloadResult(
        pageId: string,
        dataLoaderResult: Promise<TPrefetchResult> | TPrefetchResult
    ): void {
        if (dataLoaderResult instanceof Promise) {
            dataLoaderResult.then((result) => {
                this._prefetchData = this._getPrefetchData(pageId, result);
            });
        } else {
            this._prefetchData = this._getPrefetchData(
                pageId,
                dataLoaderResult
            );
        }
    }

    /**
     *
     * @param pageId
     * @param prefetchResult
     * @private
     */
    private _getPrefetchData(
        pageId: string,
        prefetchResult: TPrefetchResult
    ): Record<string, unknown> {
        const result = {
            [pageId]: prefetchResult,
        };

        Object.keys(prefetchResult).forEach((key) => {
            const data = prefetchResult[key];
            if (data && data._isAdditionalDependencies) {
                Object.keys(data).forEach((pageKey) => {
                    if (pageKey !== '_isAdditionalDependencies') {
                        result[pageKey] = data[pageKey] as TPrefetchResult;
                    }
                });
            }
        });

        return result;
    }
}
