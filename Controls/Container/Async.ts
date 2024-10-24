/**
 * @kaizen_zone 4cbeec99-a5a5-48bf-8531-411cf558b0c0
 */
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { Async as BaseAsync, IAsyncOptions, TAsyncStateReceived } from 'UICore/Async';
import rk = require('i18n!Controls');
import { IoC } from 'Env/Env';
import { ErrorController, ErrorViewConfig, ErrorViewMode } from 'Controls/error';
import { IControlOptions } from 'UICommon/Base';

export interface IOptions extends IAsyncOptions {
    errorCallback: (viewConfig: void | ErrorViewConfig, error: unknown) => void;
}

const ERROR_NOT_FOUND = 404;

/**
 * Контейнер для асинхронной загрузки контролов.
 * Подробное описание и примеры вы можете найти <a href='/doc/platform/developmentapl/interface-development/pattern-and-practice/async-load/'>здесь</a>.
 *
 * @extends UICore/Async:Async
 *
 * @public
 */

export default class Async extends BaseAsync {
    protected defaultErrorMessage: string = rk('У СБИС возникла проблема');
    private errorCallback: (viewConfig: void | ErrorViewConfig, error: unknown) => void;

    _beforeMount(
        options: IOptions,
        _: unknown,
        receivedState: TAsyncStateReceived
    ): Promise<TAsyncStateReceived> {
        this.errorCallback = options.errorCallback;
        return super._beforeMount(options, _, receivedState);
    }

    protected _loadAsync<T = unknown>(name: string): Promise<T> {
        return ModulesLoader.loadAsync<T>(name).catch((error) => {
            IoC.resolve('ILogger').error(`Couldn't load module "${name}"`, error);
            error.cause = { needShow: true };

            return new ErrorController()
                .process({ error, mode: ErrorViewMode.include })
                .then((viewConfig: ErrorViewConfig<{ message: string }>) => {
                    if (this.errorCallback && typeof this.errorCallback === 'function') {
                        this.errorCallback(viewConfig, error);
                    }

                    if (!viewConfig?.status || viewConfig.status !== ERROR_NOT_FOUND) {
                        ModulesLoader.unloadSync(name);
                    }

                    const message = viewConfig?.options?.message;
                    throw new Error(message || this.defaultErrorMessage);
                });
        });
    }

    // перегрузка метода, чтобы UICore.async:Async не перестроился до ErrorController,
    // если задан errorCallback, значит ошибка будет обработана "дружелюбно"
    protected _setErrorState(err: Error, name: string): void {
        if (!this.errorCallback || typeof this.errorCallback !== 'function') {
            super._setErrorState(err, name);
        }
    }

    static defaultProps: IControlOptions = {
        notLoadThemes: true,
    };
}

/**
 * Колбэк для обработки ошибки возникнувшей при загрузке компонента, например, если нужно показать дружелюбную ошибку вместо простого текста ошибки.
 * @name Controls/Container/Async#errorCallback
 * @cfg {Function}
 * @remark
 * Если не передавать (т.е. не обрабатывать ошибку), то при ошибке загрузки компонента будет выведен текст ошибки,
 * поясняющий причину ошибки.
 * С этим callback можно обработать ошибку как нужно прикладному разработчику.
 * @see Controls/error:ErrorController
 *
 */
