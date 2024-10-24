/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TKey } from 'Controls-DataEnv/interface';

export type TBeforeSearchSnapshot = {
    /**
     * Корень перед поиском.
     * Может быть undefined, т.к. не всегда нужно восстанавливать корень.
     *
     * Нужно восстанавливать, если корень до поиска и корень отображения поиска различаются.
     * TODO: !!! Расписать что это за кейс !!!
     *
     * Иногда принимает принудительное значение null.
     * Это означает что корень перед поиском был "сбит", например, сменой фильтра,
     * он был потерян и восстановление в прежний корень небезопасно.
     */
    root?: TKey;
    hasHierarchyFilter: boolean;
    hasRootInFilter: boolean;
};
