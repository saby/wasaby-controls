import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ContentPosition/Template';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { HierarchicalMemory } from 'Types/source';

const DATA = [
    {
        key: 1,
        parent: null,
        type: null,
        title: 'Заголовок',
        description: 'Заголовок и описание на изображении. Сверху или снизу',
        'parent@': null,
        image: explorerImages[8],
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: DATA,
        });
    }
}
