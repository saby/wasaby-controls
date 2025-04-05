/*
 * Файл экспортирует утилиты для отправки событий при сворачивании и разворачивании узлов в режиме совместимости.
 * Контрол, передаваемый во второй аргумент каждой утилиты, должен содержать метод notifyCallback()
 */
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

/**
 * Вызывает отправку события перед разворотом узла
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const beforeItemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('before', 'Expand', args);

/**
 * Вызывает отправку события перед сворачиванием узла
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const beforeItemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('before', 'Collapse', args);

/**
 * Вызывает отправку события после разворота узла
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const afterItemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('after', 'Expand', args);

/**
 * Вызывает отправку события после сворачивания узла
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const afterItemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange('after', 'Collapse', args);

/**
 * Вызывает отправку события перед разворотом узла.
 * Давно устаревший вариант, используется для обратной совместимости.
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const itemExpand = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange(undefined, 'Collapse', args);

/**
 * Вызывает отправку события перед сворачиванием узла.
 * Давно устаревший вариант, используется для обратной совместимости.
 * @param {TKey} key
 * @param {BaseTreeControl} treeControl
 * @param {IBaseTreeControlOptions} options
 */
export const itemCollapse = (...args: TNotifyBeforeAfterChangeArgs) =>
    _notifyBeforeAfterChange(undefined, 'Collapse', args);
