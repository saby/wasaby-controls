import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import template = require('wml!Controls-demo/Popup/Edit/docs/EditPost/Template');
import {
    data,
    gridColumns,
    gridHeader,
} from 'Controls-demo/Popup/Edit/docs/resources/data';
import 'wml!Controls-demo/List/Grid/DemoItem';

class EditPost extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _gridColumns: object[];
    protected _gridHeader: object[];
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data,
        });
        this._gridColumns = gridColumns;
        this._gridHeader = gridHeader;
    }

    protected _getOpenConfig(): object {
        return {
            opener: this,
            templateOptions: {
                type: 'Edit',
                source: this._viewSource,
            },
        };
    }

    protected _clickHandler(event: Event, record: Model): void {
        this._children.EditOpener.open({ record }, this._getOpenConfig());
    }
}
export default EditPost;
