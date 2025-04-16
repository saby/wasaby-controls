import { Confirmation } from 'Controls/popup';
import { MassAction, IListActionOptions } from 'Controls/actions';
import { RecordSet } from 'Types/collection';
import { ISelectionObject } from 'Controls/interface';

export default class extends MassAction {
    protected _name: string = '';
    constructor(options: IListActionOptions) {
        super(options);
        this._name = options.actionOptions.name;
    }
    execute(meta: Record<string, any>): Promise<string> {
        const selectedKeys = meta.selection.selected;
        let message = '';
        if (!selectedKeys.length) {
            message = 'Не выбраны записи для выполнения команды';
        } else {
            message = `Будет выполнена команда "${
                this._name
            }" с выбранными ключами: ${selectedKeys.join(', ')}`;
        }
        new Confirmation({}).open({
            message,
            type: 'ok',
        });
        return Promise.resolve('reload');
    }

    onSelectionChanged(items: RecordSet, selection: ISelectionObject): void {
        if (this.id === 'sum') {
            this.visible = selection.selected.length > 1;
        }
    }
}
