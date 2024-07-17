import { TKey } from 'Controls/_interface/IItems';
import { BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';

type TNotifyBeforeAfterChangeArgs = [
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
];

function _notifyBeforeAfterChange(
    on: 'before' | 'after' | undefined,
    action: 'Expand' | 'Collapse',
    args: TNotifyBeforeAfterChangeArgs
): void | Promise<void> {
    if (args[1].getViewModel().isDestroyed()) return;
    const item = args[1].getViewModel().getItemBySourceKey(args[0]);
    if (!item || item.isDestroyed()) return;
    const eName = `${on}${on ? 'Item' : 'item'}${action}`;
    return args[2].notifyCallback(eName, [item.item]) as void | Promise<void>;
}

export const beforeItemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('before', 'Expand', args);

export const beforeItemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('before', 'Collapse', args);

export const afterItemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('after', 'Expand', args);

export const afterItemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('after', 'Collapse', args);

export const itemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange(undefined, 'Collapse', args);

export const itemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange(undefined, 'Collapse', args);
