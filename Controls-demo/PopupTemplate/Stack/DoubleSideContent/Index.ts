import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Stack/DoubleSideContent/Index');
import 'css!Controls-demo/PopupTemplate/Stack/DoubleSideContent/Index';
import { RecordSet } from 'Types/collection';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _toolbarItems: RecordSet = new RecordSet({
        rawData: [
            {
                id: 'delete',
                icon: 'icon-Erase',
                showType: 2,
                viewMode: 'ghost',
            },
            {
                id: 'rubles',
                icon: 'icon-Ruble',
                showType: 2,
                viewMode: 'ghost',
            },
            {
                id: 'delete',
                icon: 'icon-ExpandList',
                showType: 2,
                viewMode: 'ghost',
            },
            {
                id: 'apply',
                icon: 'icon-Yes',
                showType: 2,
                iconStyle: 'success',
                viewMode: 'filled',
            },
        ],
    });

    protected _tumblerItems: RecordSet = new RecordSet({
        rawData: [
            { id: 1, title: 'Автоматически' },
            { id: 2, title: 'Вручную' },
        ],
    });
}
export default Index;
