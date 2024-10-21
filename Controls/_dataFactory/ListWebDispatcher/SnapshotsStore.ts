/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ISnapshotsStore, TSnapshots, TSnapshotByName } from './types/ISnapshotsStore';
import { SnapshotName } from 'Controls/_dataFactory/ListWebDispatcher/types/SnapshotName';

export class SnapshotsStore implements ISnapshotsStore {
    private _snapshots: TSnapshots = Object.create(null);

    get<T extends SnapshotName>(name: T): TSnapshotByName<T> | undefined {
        return this._snapshots[name];
    }

    // TODO: Заморозить значение, чтобы нельзя было писать get('Name').anyValue = 12;
    set<T extends SnapshotName>(name: T, value: TSnapshotByName<T>): void {
        this._snapshots[name] = value;
    }

    delete(name: SnapshotName): void {
        if (this._snapshots[name]) {
            delete this._snapshots[name];
        }
    }
}
