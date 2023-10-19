import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/BreadCrumbs/DifferendCase/Template');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/BreadCrumbs/DifferendCase/Styles';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _itemsCase1: RecordSet;
    protected _itemsCase2: RecordSet;
    protected _itemsCase3: RecordSet;
    protected _itemsCase4: RecordSet;

    protected _beforeMount(): void {
        this._itemsCase1 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'crumbs one',
                    parent: null,
                },
                {
                    id: 6,
                    title: 'case folder one',
                    parent: 1,
                },
            ],
        });
        this._itemsCase2 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'crumbs one',
                    parent: null,
                },
                {
                    id: 6,
                    title: 'case folder one, with long name folder',
                    parent: 1,
                },
            ],
        });
        this._itemsCase3 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'crumbs one with long crumbs name',
                    parent: null,
                },
                {
                    id: 6,
                    title: 'case folder one, with long name folder',
                    parent: 1,
                },
            ],
        });
        this._itemsCase4 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'crumbs one with long crumbs name',
                    parent: null,
                },
                {
                    id: 6,
                    title: 'case folder',
                    parent: 1,
                },
            ],
        });
    }
}

export default DemoControl;
