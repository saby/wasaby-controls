import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as tempalte from 'wml!Controls-demo/list_new/GradientOnHover/Cut/Index';
import { Memory } from 'Types/source';
import 'css!DemoStand/Controls-demo';

class Cut extends Control<IControlOptions> {
    protected _template: TemplateFunction = tempalte;
    protected _unaccentedBackground: boolean = false;
    protected _source: Memory = new Memory({
        keyProperty: 'id',
        data: [
            {
                id: 0,
            },
        ],
    });
}

export default Cut;
