import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/EmptyText/Simple/Index');
import { Memory } from 'Types/source';

class EmptyTextSimple extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                { key: 1, title: 'Sales of goods and services' },
                { key: 2, title: 'Contract' },
                { key: 3, title: 'Texture' },
            ],
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}
export default EmptyTextSimple;
