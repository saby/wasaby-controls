import Collection from './Collection';
import {
    enumerableComparator,
    IEnumerableComparatorSession as ISession,
    IEnumerable,
    enumerator,
} from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { Logger } from 'UICommon/Utils';

import CollectionItem from './CollectionItem';

export default class ColumnsSnapshotUpdatingSession {
    private _collection: Collection;
    private _changedCallback: Function;

    /**
     * Сессии, отслеживающие изменения в каждой колонке.
     * @private
     */
    private _session: ISession[];

    constructor(collection: Collection, changedCallback: Function) {
        this._collection = collection;
        this._changedCallback = changedCallback;
    }

    start(): void {
        this._session = [];

        for (let column = 0; column < this._collection.getColumnsCount(); column++) {
            const columnSnapshot = this._getColumnSnapshot(column);
            this._session.push(
                enumerableComparator.startSession(this._getColumnSnapshotEnumerator(columnSnapshot))
            );
        }
    }

    finish(removedItems?: CollectionItem[]): void {
        if (!this._session) {
            Logger.error('Should be called ::start');
            return;
        }

        this._session.forEach((session, column) => {
            const columnSnapshot = this._getColumnSnapshot(column);
            const columnsSnapshotEnumerator = this._getColumnSnapshotEnumerator(columnSnapshot);
            enumerableComparator.finishSession(session, columnsSnapshotEnumerator);
            try {
                enumerableComparator.analizeSession(
                    session,
                    columnsSnapshotEnumerator,
                    (action, changes) => {
                        const newItems = changes.newItems.map((key) =>
                            this._collection.getItemBySourceKey(key)
                        );
                        // Удаленные записи нельзя получить с помощью getItemBySourceKey,
                        // но из колонки могут переместиться не только удаленные записи
                        // Поэтому смотрим запись и в removedItems и в коллекции
                        const oldItems = changes.oldItems.map(
                            (key) =>
                                this._collection.getItemBySourceKey(key) ||
                                removedItems?.find((it) => String(it.key) === key)
                        );
                        this._changedCallback(
                            'columnsSnapshotChanged',
                            column,
                            action,
                            newItems,
                            changes.newItemsIndex,
                            oldItems,
                            changes.oldItemsIndex
                        );
                    }
                );
            } catch (e) {
                // при первом удалении analizeSession падает при подсчете перемещеннных записей
                //  https://online.sbis.ru/opendoc.html?guid=454c72f4-ef49-462d-aae5-4befec7ddb3f&client=3
            }
        });

        this._session = null;
    }

    private _getColumnSnapshot(column: number): CrudEntityKey[] {
        const columnsSnapshot = this._collection.getColumnsSnapshot();
        // Нужно работать именно с ключами, т.к. индексы при изменении рс меняются у большинства записей
        // и отследить корректные изменения распределенияя записей по колонкам не возможно.
        return columnsSnapshot.columns[column].map((it) => String(it.key));
    }

    private _getColumnSnapshotEnumerator(
        columnSnapshot: CrudEntityKey[]
    ): IEnumerable<CrudEntityKey> {
        return {
            '[Types/_collection/IEnumerable]': true,
            getEnumerator: () => new enumerator.Arraywise(columnSnapshot),
            each: columnSnapshot.forEach,
        };
    }
}
