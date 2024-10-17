import { Model } from 'Types/entity';
import { Path } from 'Controls/dataSource';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/breadCrumbs_new/Path/Base/Index';
import 'css!Controls-demo/breadCrumbs_new/Path/Base/Index';

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _breadcrumbs: Path = [
        new Model({
            keyProperty: 'id',
            rawData: {
                id: 1,
                parent: null,
                title: 'breadcrumb1breadcrumb1',
            },
        }),
        new Model({
            keyProperty: 'id',
            rawData: {
                id: 2,
                parent: 1,
                title: 'breadcrumb2breadcrumb2',
            },
        }),
        new Model({
            keyProperty: 'id',
            rawData: {
                id: 3,
                parent: 2,
                title: 'breadcrumb3breadcrumb3',
            },
        }),
    ];
}
