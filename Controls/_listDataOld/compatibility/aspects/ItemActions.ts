import type { IBaseControlOptions } from 'Controls/baseList';

export type TOldBaseControlItemActions = {
    callDeleteToolbarAction: typeof callDeleteToolbarAction;
};

/*
 * ##############################################################################################
 * В этом файле складываем всё необходимое для работы действий над записью в режиме совместимости
 */

/*
 * Отправляет wasaby-событие в Browser.
 * (Используется при обраьотске нажатия клавиши Del)
 */
function callDeleteToolbarAction(options: IBaseControlOptions): void {
    options.notifyCallback(
        'onCallListAction',
        [
            {
                id: 'remove',
                actionName: 'Controls/actions:Remove',
            },
        ],
        {
            bubbling: true,
        }
    );
}

export const OldBaseControlItemActions: TOldBaseControlItemActions = {
    callDeleteToolbarAction,
};
