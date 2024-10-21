import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { _companies } from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/JumpingLabel/JumpingLabel');
import selectorTemplate = require('Controls-demo/Lookup/FlatListSelector/FlatListSelector');

import 'Controls/input';

class JumpingLabel extends Control<IControlOptions> {
    private _name: string = 'Maxim';
    protected _selectorTemplate: object;
    private _source: Memory = new Memory({
        data: _companies,
        idProperty: 'id',
        filter: (item) => {
            return Boolean(item);
        },
    });
    protected _template: TemplateFunction = controlTemplate;
    protected _beforeMount(): void {
        this._selectorTemplate = {
            templateName: selectorTemplate,
            templateOptions: {
                headingCaption: 'Выберите организацию',
            },
            popupOptions: {
                width: 500,
            },
        };
    }
}

export default JumpingLabel;
