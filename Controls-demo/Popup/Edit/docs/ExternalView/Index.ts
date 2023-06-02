import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import template = require('wml!Controls-demo/Popup/Edit/docs/ExternalView/Template');
import { data } from 'Controls-demo/Popup/Edit/docs/resources/data';

class ExternalView extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _record: Model;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data,
        });
        // Данный код выполнится на роутинге для получения записи с которой будет работать.
        this._viewSource.read('0').then((record) => {
            return (this._record = record);
        });
    }
}
export default ExternalView;
