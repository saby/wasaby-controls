/**
 * @kaizen_zone 0804ab53-4f1a-422d-8854-d9021b1bfd63
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { ErrorController, ErrorViewMode, ErrorViewConfig } from 'Controls/error';
import * as template from 'wml!Controls/_dataSource/_error/DataLoader';
import { PrefetchProxy } from 'Types/source';
import {
    default as DataLoaderController,
    ILoadDataResult,
    ILoadDataConfig,
} from 'Controls/_dataSource/DataLoader';

interface IErrorContainerReceivedState {
    sources?: ILoadDataResult[];
    errorViewConfig?: ErrorViewConfig;
}

interface IErrorContainerOptions extends IControlOptions {
    sources: ILoadDataConfig[];
    errorHandlingEnabled: boolean;
    requestTimeout: number;
    errorController: ErrorController;
}

/**
 * Контрол, позволяющий обработать загрузку из нескольких источников данных. В случае возникновения проблем получения
 * данных, будет выведена соответствующая ошибка.
 * @class Controls/_dataSource/_error/DataLoader
 * @extends UI/Base:Control
 *
 * @public
 */

export default class DataLoader extends Control<
    IErrorContainerOptions,
    IErrorContainerReceivedState
> {
    protected _template: TemplateFunction = template;
    protected _sources: ILoadDataConfig[];
    protected _errorViewConfig: ErrorViewConfig;
    private _errorController: ErrorController = new ErrorController({});

    protected _beforeMount(
        { sources, errorHandlingEnabled, requestTimeout }: IErrorContainerOptions,
        ctx?: unknown,
        receivedState?: IErrorContainerReceivedState
    ): Promise<IErrorContainerReceivedState> | IErrorContainerReceivedState | void {
        if (receivedState) {
            this._sources = sources;
            this._errorViewConfig = receivedState.errorViewConfig;
        } else if (sources) {
            const readySources = DataLoader.loadSync(sources, requestTimeout);
            if (readySources.length === Object.keys(sources).length) {
                this._sources = readySources;
                return {
                    errorViewConfig: null,
                };
            }

            // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
            return DataLoader.load(sources, requestTimeout).then(({ sources, errors }) => {
                const errorsCount = errors.length;

                if (errorsCount === sources.length || (errorHandlingEnabled && errorsCount !== 0)) {
                    return this._getErrorViewConfig(errors[0]).then(
                        (errorViewConfig: ErrorViewConfig) => {
                            this._errorViewConfig = errorViewConfig;
                            return { errorViewConfig };
                        }
                    );
                } else {
                    this._sources = sources;
                    return {
                        errorViewConfig: null,
                    };
                }
            });
        }
    }

    private _getErrorViewConfig(error: Error): Promise<ErrorViewConfig | void> {
        return this._getErrorController().process({
            error,
            theme: this._options.theme,
            mode: ErrorViewMode.include,
        });
    }

    private _getErrorController(): ErrorController {
        return this._options.errorController || this._errorController;
    }

    static loadSync(sources: ILoadDataConfig[], loadDataTimeout?: number): ILoadDataResult[] {
        let sourcesResult: ILoadDataResult[] = [];
        const data = Array.isArray(sources) ? sources : Object.values(sources);

        const hasError = data.some((item) => {
            if (item.sourceController && item.sourceController.getLoadError()) {
                return true;
            }
        });

        if (!hasError) {
            sourcesResult = data.map((item) => {
                return DataLoader._createSourceConfig(item);
            });
        }

        return sourcesResult;
    }

    static load(
        sources: ILoadDataConfig[],
        loadDataTimeout?: number
    ): Promise<{
        sources: ILoadDataResult[];
        errors: Error[];
    }> {
        const sourcesResult: ILoadDataResult[] = [];
        const errorsResult: Error[] = [];
        const loadPromise = new DataLoaderController().load(sources, loadDataTimeout);
        return loadPromise.then((results) => {
            results.forEach((loadDataResult, key) => {
                if (loadDataResult.error) {
                    errorsResult.push(loadDataResult.error);
                }

                sourcesResult[key] = DataLoader._createSourceConfig(loadDataResult);
            });
            return {
                sources: sourcesResult,
                errors: errorsResult,
            };
        });
    }

    static _createSourceConfig(sourceConfig: ILoadDataResult): ILoadDataResult {
        const result = { ...sourceConfig };

        result.source = new PrefetchProxy({
            // Не делаем вложенность PrefetchProxy в PrefetchProxy, иначе прикладным программистам сложно получиить
            // оригинальный SbisService, а он им необходим для подписки на onBeforeProviderCall, который не стреляет
            // у PrefetchProxy.
            target:
                sourceConfig.source instanceof PrefetchProxy
                    ? sourceConfig.source.getOriginal()
                    : sourceConfig.source,
            data: {
                query: sourceConfig.data,
            },
        });

        return result;
    }

    static getDefaultOptions(): Partial<IErrorContainerOptions> {
        return {
            errorHandlingEnabled: true,
            requestTimeout: 5000,
        };
    }
}

/**
 * @typedef {Object} ISourceConfig
 * @property {ICrud} source {@link Controls/list:DataContainer#source}
 * @property {Array|function|IList} fastFilterSource {@link Controls/_filter/Controller#fastFilterSource}
 * @property {Object} navigation {@link Controls/list:DataContainer#navigation}
 * @property {String} historyId {@link Controls/_filter/Controller#historyId}
 * @property {Object} filter {@link Controls/list#filter}
 * @property {Object} sorting {@link Controls/list/ISorting#sorting}
 * @property {?Object[]} historyItems {@link  Controls/_filter/Controller#historyItems}
 */

/**
 * @name Controls/_dataSource/_error/DataLoader#sources
 * @cfg {Array.<ISourceConfig>|Record<string, ISourceConfig>} Конфигурации источников данных.
 */

/**
 * @name Controls/_dataSource/_error/DataLoader#errorHandlingEnabled
 * @cfg {Boolean} Автоматически показывать ошибку в случае возникновения проблем получения данных у любого из переданных
 * истоников.
 * @default true
 */

/**
 * @name Controls/_dataSource/_error/DataLoader#requestTimeout
 * @cfg {Number} Максимально допустимое время, за которое должен отработать запрос за данными.
 * @remark Если за отведенное время запрос не успеет успешно отработать, будет сгенерирована 504 ошибка и ожидание
 * ответа прекратится.
 * @default 5000
 */
