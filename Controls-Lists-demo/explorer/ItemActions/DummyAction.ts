import { BaseAction, IActionExecuteParams, IActionOptions } from 'Controls/actions';
import { Confirmation } from 'Controls/popup';
import { Model } from 'Types/entity';

interface IItemActionsExecuteParams extends IActionExecuteParams {
    item: Model;
    container: HTMLElement;
}

export default class DummyAction extends BaseAction {
    constructor(props: IActionOptions) {
        super(props);
    }

    execute(params: IItemActionsExecuteParams): void {
        const item = this._options.context.item;
        const slice = this._options.context[this._options.storeId] || this._options.context.slice;
        Confirmation.openPopup(
            {
                type: 'ok',
                message:
                    `Текущая запись ${item.getKey()}.` +
                    (slice ? ` Выделены записи ${JSON.stringify(slice.state.selectedKeys)}` : ''),
            },
            this
        );
    }
}
