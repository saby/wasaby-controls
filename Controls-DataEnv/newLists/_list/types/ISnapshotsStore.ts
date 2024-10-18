/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { SnapshotName } from './SnapshotName';
import { TBeforeSearchSnapshot } from './snapshots/TBeforeSearch';
import { TBeforeShowOnlySelected } from './snapshots/TBeforeShowOnlySelected';
import { TBeforeOpenOperationsPanel } from './snapshots/TBeforeOpenOperationsPanel';
import { TBeforeComplexUpdate } from './snapshots/TBeforeComplexUpdate';

export type TSnapshots = Partial<{
    [SnapshotName.BeforeSearch]: TBeforeSearchSnapshot;
    [SnapshotName.BeforeShowOnlySelected]: TBeforeShowOnlySelected;
    [SnapshotName.BeforeOpenOperationsPanel]: TBeforeOpenOperationsPanel;
    [SnapshotName.BeforeComplexUpdate]: TBeforeComplexUpdate;
}>;

export type TSnapshotByName<T extends SnapshotName> = TSnapshots[T];

export interface ISnapshotsStore {
    get: <T extends SnapshotName>(name: T) => TSnapshotByName<T> | undefined;
    set: <T extends SnapshotName>(name: T, value: TSnapshotByName<T>) => void;
    delete: (name: SnapshotName) => void;
}
