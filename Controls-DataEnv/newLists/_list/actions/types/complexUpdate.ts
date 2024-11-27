import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { _private_TMiddlewaresPropsForMigrationToDispatcher } from 'Controls-DataEnv/abstractList';

import type { IListState } from '../../interface/IListState';

export type TReduceStateAction = TAbstractAction<
    'reduceState',
    {
        prevState: IListState;
        nextState: IListState;
    }
>;

/**
 * Тип действия, для выполнения старого кода комплексного обновления.
 * Непереведенный код списочного слайса.
 */
export type TOldBeforeApplyStateAction = TAbstractAction<
    'oldBeforeApplyState',
    {
        prevState: IListState;
        nextState: IListState;
        _propsForMigration: _private_TMiddlewaresPropsForMigrationToDispatcher;
    }
>;

/**
 * Тип действий комплексного обновления состояния, доступные в WEB списке.
 */
export type TAnyComplexUpdateAction = TOldBeforeApplyStateAction | TReduceStateAction;
// FIXME: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.
