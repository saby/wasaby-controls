import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';

import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ContentPadding/ContentPadding';

const data = [
    {
        id: 1,
        parent: null,
        type: null,
        title: 'Сравнение условий конкурентов по ЭДО.xlsx',
        description:
            'Несмотря на то, что мониторы больших диагоналей становятся всё доступнее, а их разрешение постоянно растёт, ' +
            'иногда возникает задача в ограниченном пространстве уместить много текста. Например, это может понадобиться для мобильной ' +
            'версии сайта или для интерфейса, в котором важно число строк. В подобных случаях имеет смысл обрезать длинные строки текста, ' +
            'оставив только начало предложения. Так мы приведём интерфейс к компактному виду и сократим объём выводимой информации. Само обрезание ' +
            'строк можно делать на стороне сервера с помощью того же PHP, но через CSS это проще, к тому же всегда можно показать текст целиком, например, ' +
            'при наведении на него курсора мыши',
        'parent@': null,
        imagePosition: 'left',
        image: explorerImages[8],
        isShadow: true,
    },
    {
        id: 2,
        parent: null,
        type: null,
        title: 'Сравнение условий конкурентов по ЭДО.xlsx',
        description:
            'Несмотря на то, что мониторы больших диагоналей становятся всё доступнее, а их разрешение постоянно растёт, ' +
            'иногда возникает задача в ограниченном пространстве уместить много текста. Например, это может понадобиться для мобильной ' +
            'версии сайта или для интерфейса, в котором важно число строк. В подобных случаях имеет смысл обрезать длинные строки текста, ' +
            'оставив только начало предложения. Так мы приведём интерфейс к компактному виду и сократим объём выводимой информации. Само обрезание ' +
            'строк можно делать на стороне сервера с помощью того же PHP, но через CSS это проще, к тому же всегда можно показать текст целиком, например, ' +
            'при наведении на него курсора мыши',
        'parent@': null,
        imagePosition: 'right',
        image: explorerImages[8],
        isShadow: true,
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data,
        });
    }
}
