import type { CrudEntityKey } from 'Types/source';
import type { IListMobileSourceControllerParams } from '../_interface/IListMobileSourceControllerParams';
import type {
    IRpcCommand,
    IStompEvent,
    IStompEventGroupListener,
} from '../_interface/IExternalTypes';

import { Guid, ObservableMixin } from 'Types/entity';
import { mixin } from 'Types/util';
import { isEqual } from 'Types/object';
import { DataSet } from 'Types/source';
import { IExternalDirection, IRpcCommandMethod } from '../_interface/IExternalTypes';
import { EventManager } from './EventManager';
import { EventChannel } from './EventChannel';

const SEARCH_PARAM = 'SearchString';

type DeepPartial<T> = T extends Record<string, unknown>
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export class SourceController extends mixin<ObservableMixin>(ObservableMixin) {
    protected _filter: IListMobileSourceControllerParams['filter'];
    protected _pagination: IListMobileSourceControllerParams['pagination'];
    protected _root: IListMobileSourceControllerParams['root'];
    protected _source: IListMobileSourceControllerParams['source'];
    protected _handleId: string;
    protected _observerId: string;
    protected _eventManager: EventManager;
    protected _eventChannel: EventChannel;

    constructor({ source, ...options }: IListMobileSourceControllerParams) {
        super();
        this._source = source;
        this._observerId = Guid.create();
        this._pagination = options.pagination;
        this._filter = options.filter;
        this.updateOptions(options);
    }

    getPagination(): IListMobileSourceControllerParams['pagination'] {
        return this._pagination;
    }

    protected async _initHandleId(): Promise<void> {
        const response = await this._call({
            method: IRpcCommandMethod.GET,
            params: {
                Filter: this._filter,
                Pagination: {
                    pagination: [
                        {
                            pagination: {
                                direction:
                                    this._pagination.direction === 'down'
                                        ? IExternalDirection.FORWARD
                                        : IExternalDirection.BACKWARD,
                                page_size: this._pagination.limit,
                            },
                        },
                    ],
                },
            },
        });

        this._handleId = response?.getProperty();
    }

    protected async _initObserver(): Promise<void> {
        await this._call({
            method: IRpcCommandMethod.SET_OBSERVER,
            params: {
                Handle: this._handleId,
                ObserverId: this._observerId,
            },
        });
    }

    protected async _call(command: IRpcCommand): Promise<DataSet> {
        this._notify('commandStarted', command);
        try {
            const response = await this._source.call(command.method, command.params);
            this._notify('commandSucceeded', command, response);
            return response;
        } catch (error) {
            this._notify('commandFailed', command, error);
        }
        return new DataSet<unknown>();
    }

    //# region API Публичного контроллера
    /**
     * Обновить опции
     * @public
     * @returns {void}
     */
    updateOptions({
        filter,
        pagination,
        root,
    }: DeepPartial<IListMobileSourceControllerParams>): void {
        if (filter != null && !isEqual(this._filter, filter)) {
            this._filter = filter;
            this._notify('filterChanged', filter);
        }
        if (root !== undefined && !isEqual(this._root, root)) {
            this._notify('rootChanged', root);
        }
        if (
            pagination?.direction !== undefined &&
            !isEqual(this._pagination.direction, pagination.direction)
        ) {
            this._pagination.direction = pagination.direction;
        }
        if (pagination?.limit !== undefined && !isEqual(this._pagination.limit, pagination.limit)) {
            this._pagination.limit = pagination.limit;
        }
        if (
            filter?.[SEARCH_PARAM] !== undefined &&
            !isEqual(this._filter[SEARCH_PARAM], filter[SEARCH_PARAM])
        ) {
            this._filter[SEARCH_PARAM] = filter[SEARCH_PARAM];
        }
    }

    /**
     * Установить соединение с бекендом (подписка на event-ы, регистрация уникальной сессии)
     * @public
     * @returns {Promise<void>}
     */
    async connect(): Promise<void> {
        this._eventManager = new EventManager({
            observerId: this._observerId,
        });
        this._eventManager.subscribe('eventGroup', ((_, params) => {
            this._notify('receiveEventGroup', params);
        }) as IStompEventGroupListener);

        this._eventChannel = new EventChannel();
        this._eventChannel.subscribe('event', (_: unknown, event: IStompEvent) =>
            this._eventManager.process(event)
        );

        await this._eventChannel.connect();
        await this._initHandleId();
        await this._initObserver();
    }

    /**
     * Закрытие соединения с бекендом (отписка от event-ов, аннулирование уникальной сессии)
     * @public
     * @returns {Promise<void>}
     */
    async disconnect(): Promise<void> {
        await this._call({
            method: IRpcCommandMethod.DISPOSE,
            params: {
                Handle: this._handleId,
            },
        });
        this._eventChannel.destroy();
        this._eventManager.destroy();
    }

    /**
     * Загрузка следующей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    next(index: number): Promise<DataSet> {
        if (index) {
            return this._call({
                method: IRpcCommandMethod.NEXT,
                params: {
                    Handle: this._handleId,
                    AnchorIndex: index,
                },
            });
        }
        return Promise.resolve(new DataSet<unknown>());
    }

    /**
     * Загрузка предыдущей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    prev(index: number): Promise<DataSet> {
        if (index) {
            return this._call({
                method: IRpcCommandMethod.PREV,
                params: {
                    Handle: this._handleId,
                    AnchorIndex: index,
                },
            });
        }
        return Promise.resolve(new DataSet<unknown>());
    }

    /**
     * Установить маркер
     * @public
     * @returns {Promise<DataSet>}
     */
    mark(position: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.MARK,
            params: {
                Handle: this._handleId,
                Pos: position,
            },
        });
    }

    /**
     * Установить выделение
     * @public
     * @returns {Promise<DataSet>}
     */
    select(position: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.SELECT,
            params: {
                Handle: this._handleId,
                Pos: position,
            },
        });
    }

    /**
     * Перезагрузить данные
     * @public
     * @returns {Promise<DataSet>}
     */
    refresh(): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.REFRESH,
            params: {
                Handle: this._handleId,
            },
        });
    }

    /**
     * Выполнить поиск по данным
     * @public
     * @returns {Promise<void>}
     */
    async search(value: string): Promise<void> {
        this.updateOptions({
            filter: {
                ...this._filter,
                [SEARCH_PARAM]: value,
            },
        });
        await this._initHandleId();
        await this._initObserver();
    }

    /**
     * Сбросить поиск
     * @public
     * @returns {Promise<void>}
     */
    async resetSearch(): Promise<void> {
        const filter = { ...this._filter };
        delete filter[SEARCH_PARAM];
        this.updateOptions({ filter });
        await this._initHandleId();
        await this._initObserver();
    }

    /**
     * Изменить корень дерева
     * @public
     * @returns {Promise<DataSet>}
     */
    changeRoot(root: CrudEntityKey | null): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.CHANGE_ROOT,
            params: {
                Handle: this._handleId,
                Ident: root ?? null,
            },
        });
    }

    /**
     * Открыть узел дерева
     * @public
     * @return {Promise<DataSet>}
     */
    expand(position: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.EXPAND,
            params: {
                Handle: this._handleId,
                Pos: position,
            },
        });
    }

    /**
     * Закрыть узел дерева
     * @public
     * @return {Promise<DataSet>}
     */
    collapse(position: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.COLLAPSE,
            params: {
                Handle: this._handleId,
                Pos: position,
            },
        });
    }

    async keepAlive(pageId: string): Promise<void> {
        await this._call({
            method: IRpcCommandMethod.KEEP_ALIVE,
            params: {
                page_id: pageId,
            },
        });
    }
    //# endregion API Публичного контроллера
}
