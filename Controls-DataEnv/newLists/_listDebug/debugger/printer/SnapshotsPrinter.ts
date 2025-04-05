import { printStateMutations as printStateMutationsUtil } from './snapshotPrinter/printStateMutations';
import { IListState } from 'Controls-DataEnv/list';

/**
 * @private
 */
export class SnapshotsPrinter {
    static printStateMutations<TState extends IListState = IListState>(
        ...[output, changes, ifEmpty, changeMapper]: Parameters<
            typeof printStateMutationsUtil<TState>
        >
    ) {
        printStateMutationsUtil<TState>(output, changes, ifEmpty, changeMapper);
    }
}
