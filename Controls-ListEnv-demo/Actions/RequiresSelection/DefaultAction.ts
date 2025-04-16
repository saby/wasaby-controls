import { BaseAction, IActionExecuteParams } from 'Controls/actions';
import { Confirmation } from 'Controls/popup';

export default class DefaultAction extends BaseAction {
    execute(options: IActionExecuteParams): Promise<unknown> | void {
        const selectedKeys = options.selection?.selected || [];
        const excludedKeys = options.selection?.excluded || [];
        const filter = options.filter;
        const selectionMessage = `${
            selectedKeys.length || excludedKeys.length
                ? `Отмечено: ${selectedKeys.join(', ')}
                  ${excludedKeys.length ? `Кроме ${excludedKeys.join(', ')}` : ''}`
                : 'Все записи'
        }`;
        const filterMessage = `${filter.type ? `Тип товара: ${filter.type}` : ''}`;
        Confirmation.openPopup({
            type: 'ok',
            message: `Выполнена команда: ${this.title}\n с отметкой:\n ${selectionMessage} \n Фильтром: \n ${filterMessage}`,
        });
    }
}
