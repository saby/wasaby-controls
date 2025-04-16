import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TitlePositionOnImage/Template';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            id: 1,
            parent: null,
            type: null,
            title: 'Шаблон 5.2 с изображением и заголовком на нем',
            gradientColor: '#E0E0E3',
            description: 'Заголовок на изображении, описание - под изображением',
            imageProportion: '1:1',
            titleLines: 3,
            imagePosition: 'top',
            'parent@': null,
            imageHeight: 's',
            image: explorerImages[8],
            isShadow: true,
        },
        {
            id: 2,
            parent: null,
            type: null,
            title: 'Шаблон 5.2 с изображением и заголовком на нем',
            gradientColor: '#E0E0E3',
            titleColorStyle: 'danger',
            description: 'Проверяем работу titleColorStyle. Заголовок красный.',
            imageProportion: '1:1',
            titleLines: 3,
            imagePosition: 'top',
            'parent@': null,
            imageHeight: 's',
            image: explorerImages[8],
            isShadow: true,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
