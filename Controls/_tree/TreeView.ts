/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { ListView } from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { TreeItem } from 'Controls/baseTree';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import 'css!Controls/baseTree';

export default class TreeView extends ListView {
    protected _defaultItemTemplate: TemplateFunction | string = 'Controls/tree:ItemTemplate';

    protected _beforeMount(newOptions: any): void {
        super._beforeMount(newOptions);
    }

    protected _beforeUpdate(newOptions: any): void {
        super._beforeUpdate(newOptions);

        if (this._options.expanderSize !== newOptions.expanderSize) {
            this._listModel.setExpanderSize(newOptions.expanderSize);
        }
    }
}
