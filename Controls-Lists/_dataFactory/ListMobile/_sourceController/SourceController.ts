/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { CrudEntityKey } from 'Types/source';
import { DataSet } from 'Types/source';
import type { IListMobileSourceControllerParams } from '../_interface/IListMobileSourceControllerParams';
import type { TRawStompEvent, TRpcCommand } from '../_interface/IExternalTypes';
import {
    ExternalDirection,
    IStompEventListener,
    RpcCommandMethod,
    TRpcCommandByMethod,
} from '../_interface/IExternalTypes';

import { Guid, ObservableMixin, Record as SbisRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import { mixin } from 'Types/util';
import { isEqual } from 'Types/object';
import { EventChannel } from './EventChannel';
import { KeepAliveControllerSingleton } from './_keepAliveController/KeepAliveControllerSingleton';
import { MarkerDirection, TSelectionRecord, TSelectionRecordContent } from 'Controls/interface';
import { resolve } from 'Types/di';

type DeepPartial<T> = T extends Record<string, unknown>
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

/**
 * Карта соответствия между направлением маркера в UI коде и в методе БЛ.
 * @private
 */
const MARKER_DIRECTION_TO_EXTERNAL_DIRECTION = {
    [MarkerDirection.Forward]: ExternalDirection.FORWARD,
    [MarkerDirection.Backward]: ExternalDirection.BACKWARD,
};

export class SourceController extends mixin<ObservableMixin>(ObservableMixin) {
    protected _filter: IListMobileSourceControllerParams['filter'];
    protected _pagination: IListMobileSourceControllerParams['pagination'];
    protected _root: IListMobileSourceControllerParams['root'];
    protected _source: IListMobileSourceControllerParams['source'];
    protected _handleId: string;
    protected _observerId: string;
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

    private async _init(): Promise<void> {
        await this._initHandleId();
    }

    private async _dispose(): Promise<void> {
        KeepAliveControllerSingleton.getInstance().disconnect(this._observerId);

        await this._call({
            method: RpcCommandMethod.DISPOSE,
            params: {
                _Handle: this._handleId,
            },
        });
    }

    private async _reInit(): Promise<void> {
        await this._dispose();
        await this._init();
    }

    protected async _initHandleId(): Promise<void> {
        const provider_response = await this._call({
            method: RpcCommandMethod.INSTANCE,
            params: {
                _PageId: KeepAliveControllerSingleton.getInstance().connect(this._observerId),
            },
        });

        const providerId = provider_response?.getProperty();

        const filterRecord = buildRecord(this._filter);

        const nodesPaginationRecordSet = new RecordSet<
            SbisRecord<{
                pagination: SbisRecord<{
                    direction: number;
                    page_size: number;
                }>;
            }>
        >({
            adapter: 'adapter.sbis',
            rawData: {},
        });

        nodesPaginationRecordSet.add(
            buildRecord({
                _ident: this._root,
                pagination: buildRecord({
                    direction:
                        this._pagination.direction === 'down'
                            ? ExternalDirection.FORWARD
                            : ExternalDirection.BACKWARD,
                    page_size: this._pagination.limit,
                }),
            })
        );

        const paginationRecord = buildRecord({
            pagination: nodesPaginationRecordSet,
        });

        const response = await this._call({
            method: RpcCommandMethod.GET_WITH_OBSERVER,
            params: {
                _PageId: KeepAliveControllerSingleton.getInstance().connect(this._observerId),
                _Handle: providerId,
                F: filterRecord,
                P: paginationRecord,
                Observer: this._observerId
            },
        });

        this._handleId = response?.getProperty();
    }

    protected async _call(command: TRpcCommand): Promise<DataSet> {
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
        }
        if (root !== undefined && !isEqual(this._root, root)) {
            this._root = root;
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
    }

    /**
     * Установить соединение с бекендом (подписка на event-ы, регистрация уникальной сессии)
     * @public
     * @returns {Promise<void>}
     */
    async connect(): Promise<void> {
        const eventHandler: IStompEventListener = (_: unknown, event: TRawStompEvent) => {
            this._notify('receiveEvent', event);
        };

        this._eventChannel = new EventChannel();
        this._eventChannel.subscribe('event', eventHandler);
        this._eventChannel.connect();
        await this._init();
    }

    /**
     * Закрытие соединения с бекендом (отписка от event-ов, аннулирование уникальной сессии)
     * @public
     * @returns {Promise<void>}
     */
    async disconnect(): Promise<void> {
        await this._dispose();
        this._eventChannel.destroy();
    }

    /**
     * Загрузка следующей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    async next(index: number): Promise<void> {
        if (index) {
            await this._call({
                method: RpcCommandMethod.NEXT,
                params: {
                    _Handle: this._handleId,
                    AnchorIndex: index,
                },
            });
        }
    }

    /**
     * Загрузка предыдущей порции элементов
     * @public
     * @returns {Promise<DataSet>}
     */
    async prev(index: number): Promise<void> {
        if (index) {
            await this._call({
                method: RpcCommandMethod.PREV,
                params: {
                    _Handle: this._handleId,
                    AnchorIndex: index,
                },
            });
        }
    }

    /**
     * Установить маркер
     * @public
     * @returns {Promise<DataSet>}
     */
    async mark(position: number): Promise<void> {
        await this._call({
            method: RpcCommandMethod.MARK,
            params: {
                _Handle: this._handleId,
                Pos: position,
            },
        });
    }

    /**
     * Установить выделение
     * @public
     * @returns {Promise<void>}
     */
    async select(position: number, direction?: MarkerDirection): Promise<void> {
        const params: TRpcCommandByMethod<RpcCommandMethod.SELECT>['params'] = {
            _Handle: this._handleId,
            Pos: position,
        };
        if (direction && typeof MARKER_DIRECTION_TO_EXTERNAL_DIRECTION[direction] !== 'undefined') {
            params.Direction = MARKER_DIRECTION_TO_EXTERNAL_DIRECTION[direction];
        } else {
            params.Direction = null;
        }
        await this._call({
            method: RpcCommandMethod.SELECT,
            params,
        });
    }

    /**
     * Инвертировать выделение
     * @public
     * @returns {Promise<void>}
     */
    async selectAll(): Promise<void> {
        await this._call({
            method: RpcCommandMethod.SELECT_ALL,
            params: {
                _Handle: this._handleId,
            },
        });
    }

    /**
     * Инвертировать выделение
     * @public
     * @returns {Promise<void>}
     */
    async invertSelection(): Promise<void> {
        await this._call({
            method: RpcCommandMethod.INVERT_SELECTION,
            params: {
                _Handle: this._handleId,
            },
        });
    }

    /**
     * Сбросить выделение
     * @public
     * @returns {Promise<void>}
     */
    async resetSelection(): Promise<void> {
        await this._call({
            method: RpcCommandMethod.RESET_SELECTION,
            params: {
                _Handle: this._handleId,
            },
        });
    }

    /**
     * Получить выделение
     * @public
     * @returns {Promise<TSelectionRecordContent>}
     */
    async getSelection(): Promise<TSelectionRecordContent> {
        const result = await this._call({
            method: RpcCommandMethod.GET_SELECTION,
            params: {
                _Handle: this._handleId,
            },
        });

        if (!result) {
            return {
                marked: [],
                excluded: [],
                recursive: true,
                // type не переведен на массив на клиенте.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                type: [],
            };
        }

        const record = result.getRow() as TSelectionRecord;

        return {
            marked: record.get('marked'),
            excluded: record.get('excluded'),
            type: record.get('type'),
            recursive: record.get('recursive'),
        } as TSelectionRecordContent;
    }

    /**
     * Перезагрузить данные
     * @public
     * @returns {Promise<DataSet>}
     */
    refresh(): Promise<DataSet> {
        return this._call({
            method: RpcCommandMethod.REFRESH,
            params: {
                _Handle: this._handleId,
            },
        });
    }

    async setFilter(filter: Record<string, unknown>): Promise<void> {
        this.updateOptions({ filter });
        await this._reInit();
    }

    /**
     * Изменить корень дерева
     * @public
     * @returns {Promise<DataSet>}
     */
    changeRoot(root: CrudEntityKey | null): Promise<DataSet> {
        return this._call({
            method: RpcCommandMethod.CHANGE_ROOT,
            params: {
                _Handle: this._handleId,
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
            method: RpcCommandMethod.EXPAND,
            params: {
                _Handle: this._handleId,
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
            method: RpcCommandMethod.COLLAPSE,
            params: {
                _Handle: this._handleId,
                Pos: position,
            },
        });
    }
    //# endregion API Публичного контроллера
}

function buildRecord<T extends object | SbisRecord>(data: T): SbisRecord<T> {
    if (data instanceof SbisRecord) {
        return data;
    }

    const RecordType = resolve<typeof SbisRecord>('Types/entity:Record');
    return RecordType.fromObject<T>(data, 'adapter.sbis');
}
