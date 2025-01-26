import { BaseAction, IExecuteOptions, IActionOptions } from 'Controls/actions';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { Confirmation } from 'Controls/popup';
import { IMenuControlOptions } from 'Controls/menu';

export default class ActionWithMultiSelect extends BaseAction {
    constructor(options: IActionOptions) {
        super(options);
        this['parent@'] = true;
        this.title = 'Печать';
        this.icon = 'icon-Save';
        this.iconStyle = 'secondary';
    }

    getChildren(root: TKey): Promise<RecordSet> {
        return Promise.resolve(
            new RecordSet({
                rawData: [
                    {
                        id: 'print1',
                        title: 'Первая печатная форма',
                        parent: root,
                    },
                    {
                        id: 'print2',
                        title: 'Вторая печатная форма',
                        parent: root,
                    },
                ],
            })
        );
    }

    getMenuOptions(): Partial<IMenuControlOptions> {
        return {
            multiSelect: true,
        };
    }

    execute(options: Partial<IExecuteOptions>): Promise<unknown> | void {
        if (
            (options.toolbarSelectedKeys as TKey[]).length &&
            !(options.toolbarItem as Model).get('parent@')
        ) {
            return Confirmation.openPopup({
                message: `Печать будет выполнена с записями ${(
                    options.toolbarSelectedKeys as TKey[]
                ).join(', ')}`,
            });
        }
    }
}
