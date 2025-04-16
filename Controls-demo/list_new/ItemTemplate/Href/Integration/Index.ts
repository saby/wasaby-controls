import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'wml!Controls-demo/list_new/ItemTemplate/FromFile/TempItem';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/Href/Integration/HRef';
function getAnimalData(): {
    key: number;
    title: string;
    href?: string;
}[] {
    return [
        {
            key: 1,
            title: 'Domestic rat',
            href: 'https://zapovednik96.ru/articles/dekorativnaya-krysa/',
        },
        {
            key: 2,
            title: 'Panda',
        },
        {
            key: 3,
            title: 'Treeshrew',
            href: 'https://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%8B%D0%BA%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D1%82%D1%83%D0%BF%D0%B0%D0%B9%D1%8F',
        },
        {
            key: 4,
            title: 'Fox',
            href: 'https://www.techinsider.ru/science/819313-lisa-obraz-zhizni-povadki-i-drugie-interesnye-fakty/',
        },
        {
            key: 5,
            title: 'Eagle',
        },
    ];
}
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateHref: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getAnimalData(),
                    }),
                },
            },
        };
    }
}
