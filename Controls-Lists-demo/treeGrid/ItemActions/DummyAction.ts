import { BaseAction, IActionExecuteParams } from 'Controls/actions';
import { Confirmation } from 'Controls/popup';
import { Model } from 'Types/entity';

interface IItemActionsExecuteParams extends IActionExecuteParams {
    item: Model;
    container: HTMLElement;
}

export default class DummyAction extends BaseAction {
    execute(params: IItemActionsExecuteParams): void {
        Confirmation.openPopup(
            {
                type: 'ok',
                message: `Текущая запись ${this._options.context.item.getKey()}`,
            },
            this
        );
    }
}
