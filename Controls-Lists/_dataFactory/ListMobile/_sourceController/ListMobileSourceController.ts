import type { CrudEntityKey } from 'Types/source';
import type { Direction } from 'Controls/interface';
import type { IListMobileSourceControllerParams } from '../_interface/IListMobileSourceControllerParams';
import type { IRpcCommand, IStompEventGroupListenerCallback } from '../_interface/IExternalTypes';

import { Guid, ObservableMixin } from 'Types/entity';
import { mixin } from 'Types/util';
import { isEqual } from 'Types/object';
import { DataSet } from 'Types/source';
import { IExternalDirection, IRpcCommandMethod } from '../_interface/IExternalTypes';

type DeepPartial<T> = T extends Record<string, unknown>
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export class ListMobileSourceController extends mixin<ObservableMixin>(ObservableMixin) {
    protected _filter: IListMobileSourceControllerParams['filter'];
    protected _pagination: IListMobileSourceControllerParams['pagination'];
    protected _root: IListMobileSourceControllerParams['root'];
    protected _viewportSize: IListMobileSourceControllerParams['viewportSize'];
    protected _source: IListMobileSourceControllerParams['source'];
    protected _handleId?: string;
    protected _observerId: string;

    constructor({ source, ...options }: IListMobileSourceControllerParams) {
        super();
        this._source = source;
        this._observerId = Guid.create();
        this._pagination = options.pagination;
        this._filter = options.filter;
        this.updateOptions(options);
        source.onReceiveEventGroup(this._onReceiveEventGroup.bind(this));
    }

    protected _onReceiveEventGroup(
        params: Parameters<IStompEventGroupListenerCallback>
    ): ReturnType<IStompEventGroupListenerCallback> {
        this._notify('receiveEventGroup', params);
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

        this._handleId = response.getProperty();
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

    protected async _call(command: IRpcCommand) {
        this._notify('commandStarted', command);
        try {
            const response = await this._source.call(command.method, command.params);
            this._notify('commandSucceeded', command, response);
            return response;
        } catch (error) {
            this._notify('commandFailed', command, error);
        }
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
        viewportSize,
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
        if (viewportSize !== undefined && !isEqual(this._viewportSize, viewportSize)) {
            this._viewportSize = viewportSize;
        }
        if (filter?.search !== undefined && !isEqual(this._filter.search, filter.search)) {
            this._filter.search = filter.search;
        }
    }

    /**
     * Установить соединение с бекендом (подписка на event-ы, регистрация уникальной сессии)
     * @public
     * @returns {Promise<void>}
     */
    async connect(): Promise<void> {
        await this._source.connect();
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
        await this._source.disconnect();
    }

    /**
     * Загрузка следующей порции элементов. Опционально можно изменить некоторые опции загрузки
     * @public
     * @returns {Promise<void>}
     */
    load(
        direction?: Direction,
        root?: CrudEntityKey,
        filter?: IListMobileSourceControllerParams['filter']
    ): Promise<DataSet> {
        this.updateOptions({
            filter,
            root,
            pagination: { direction },
        });
        switch (direction) {
            case 'down':
                return this.next(this._pagination.limit);
            case 'up':
                return this.prev(this._viewportSize - this._pagination.limit);
        }
    }

    /**
     * Загрузка следующей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    next(index: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.NEXT,
            params: {
                Handle: this._handleId,
                AnchorIndex: index,
            },
        });
    }

    /**
     * Загрузка предыдущей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    prev(index: number): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.PREV,
            params: {
                Handle: this._handleId,
                AnchorIndex: index,
            },
        });
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
     * Изменить корень дерева
     * @public
     * @returns {Promise<DataSet>}
     */
    changeRoot(root: string | null): Promise<DataSet> {
        return this._call({
            method: IRpcCommandMethod.CHANGE_ROOT,
            params: {
                Handle: this._handleId,
                Ident: root == null ? null : JSON.parse(root),
            },
        });
    }
    //# endregion API Публичного контроллера
}
