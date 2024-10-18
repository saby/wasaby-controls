import { Rpc } from 'Types/source';
import { RpcCommandMethod } from 'Controls-Lists/_dataFactory/ListMobile/_interface/IExternalTypes';
import { Guid } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { GinniSourceController } from './GinniSourceController';
import { DJINNI_ENDPOINT, DJINNI_PROVIDER, DEFAULT_INTERVAL_MS } from './constants';
import { Errors } from './enums';

export class KeepAliveControllerSingleton {
    /**
     * Список активных подключений
     * @private
     */
    private _connectedSources?: Set<string>;

    /**
     * Идентификатор страницы
     * @private
     */
    private _pageId?: string;

    /**
     * Источник данных
     * @private
     */
    private _djinniSourceController?: Rpc;

    /**
     * Идентификатор таймера
     * @private
     */
    private _dispatchingIntervalId?: number;

    private constructor() {}

    /**
     * Добавление в список активных подключений
     * @param observerId Добавляемый идентификатор
     * @returns Идентификатор страницы
     * @public
     */
    connect(observerId: string): string {
        const pageId = this._getPageId();
        const connectedSources = this._getConnectedSources();

        if (connectedSources.has(observerId)) {
            return pageId;
        }

        if (!connectedSources.size) {
            this._dispatchingIntervalId = setInterval(() => {
                this._getGinniSourceController().call(RpcCommandMethod.KEEP_ALIVE, {
                    page_id: this._pageId,
                });
            }, DEFAULT_INTERVAL_MS);
        }

        connectedSources.add(observerId);
        return pageId;
    }

    /**
     * Удаление из списка активных подключений
     * @param observerId Удаляемый идентификатор
     * @returns Идентификатор страницы
     * @public
     */
    disconnect(observerId: string): string {
        if (this._pageId === undefined) {
            Logger.error(Errors.PAGE_ID_NOT_CREATED);
            return '';
        }

        const pageId = this._pageId;
        const connectedSources = this._getConnectedSources();

        if (!connectedSources.has(observerId)) {
            return pageId;
        }

        connectedSources.delete(observerId);

        if (connectedSources.size === 0) {
            this._destroy();
        }

        return pageId;
    }

    /**
     * Получение идентификатора страницы
     * @returns идентификатор страницы
     * @private
     */
    private _getPageId(): string {
        if (!this._pageId) {
            this._pageId = Guid.create();
        }
        return this._pageId;
    }

    /**
     * Получение списка активных подключений
     * @returns список подключений
     * @private
     */
    private _getConnectedSources(): Set<string> {
        if (this._connectedSources === undefined) {
            this._connectedSources = new Set();
        }
        return this._connectedSources;
    }

    /**
     * Получение источника данных
     * @returns источник данных
     * @private
     */
    private _getGinniSourceController(): GinniSourceController {
        if (this._djinniSourceController === undefined) {
            this._djinniSourceController = new GinniSourceController({
                endpoint: DJINNI_ENDPOINT,
                provider: DJINNI_PROVIDER,
            });
        }
        return this._djinniSourceController;
    }

    /**
     * Разрушение экземпляра
     * @private
     */
    private _destroy() {
        if (this._dispatchingIntervalId) {
            clearInterval(this._dispatchingIntervalId);
            this._dispatchingIntervalId = undefined;
        }
        this._pageId = undefined;
        this._connectedSources = undefined;
        this._djinniSourceController = undefined;
        KeepAliveControllerSingleton.instance = undefined;
    }

    /**
     * Экземпляр контроллера
     * @private
     */
    private static instance?: KeepAliveControllerSingleton;

    /**
     * Получение экземпляра
     * @public
     */
    static getInstance() {
        if (!KeepAliveControllerSingleton.instance) {
            KeepAliveControllerSingleton.instance = new KeepAliveControllerSingleton();
        }
        return KeepAliveControllerSingleton.instance;
    }
}
