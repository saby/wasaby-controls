import { BaseAction, IActionExecuteParams, IActionOptions } from 'Controls/actions';
import { ListSlice } from 'Controls/dataFactory';
import { Confirmation } from 'Controls/popup';
import { Model } from 'Types/entity';
import { Logger } from 'UI/Utils';
import { showType } from 'Controls/toolbars';

interface IItemActionsExecuteParams extends IActionExecuteParams {
    item: Model;
    container: HTMLElement;
}

export default class ReloadAction extends BaseAction {
    constructor(options: IActionOptions) {
        super({
            ...options,
            id: 'reload',
            icon: 'icon-Refresh',
            title: 'Перезагрузить',
            tooltip: 'Перезагрузить',
            showType: showType.MENU_TOOLBAR,
            'parent@': false,
            parent: null,
        });
    }

    execute(params: IItemActionsExecuteParams): void {
        Confirmation.openPopup(
            {
                type: 'yesno',
                message: `Текущая запись ${params.selection.selected[0]}. Перезагрузить список?`,
            },
            this
        ).then((result) => {
            const slice = this.getSlice();
            if (result) {
                if (slice) {
                    slice.reload();
                } else {
                    Logger.error('Не задан контекст или не найден слайс');
                }
            }
        });
    }

    // В реальности тут может быть свой собственный слайс, отличный от списка.
    private getSlice(): ListSlice | undefined {
        return this._options.context?.listActionsOnItems;
    }
}
