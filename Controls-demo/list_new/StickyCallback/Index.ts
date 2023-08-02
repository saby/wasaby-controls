import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/StickyCallback/Index';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData(): {
    key: number;
    title: string;
    description: string;
}[] {
    return [
        {
            key: 1,
            title: 'Notebooks',
            description:
                'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
        },
        {
            key: 2,
            title: 'Tablets',
            description:
                'Tablets are great for playing games, reading, homework, keeping kids entertained in the back seat of the car',
        },
        {
            key: 3,
            title: 'Laptop computers 2',
            description:
                'Explore PCs and laptops to discover the right device that powers all that you do',
        },
        {
            key: 4,
            title: 'Apple gadgets',
            description: 'Explore new Apple accessories for a range of Apple products',
        },
        {
            key: 5,
            title: 'Android gadgets 2',
            description: 'These 25 clever phone accessories and Android-compatible gadgets',
        },
        {
            key: 6,
            title: 'Notebooks',
            description:
                'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
        },
        {
            key: 7,
            title: 'Tablets',
            description:
                'Tablets are great for playing games, reading, homework, keeping kids entertained in the back seat of the car',
        },
        {
            key: 8,
            title: 'Laptop computers',
            description:
                'Explore PCs and laptops to discover the right device that powers all that you do',
        },
        {
            key: 9,
            title: 'Apple gadgets',
            description: 'Explore new Apple accessories for a range of Apple products',
        },
        {
            key: 10,
            title: 'Android gadgets',
            description: 'These 25 clever phone accessories and Android-compatible gadgets',
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
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _stickyCallback(item: Model): string | undefined {
        const title = item.get('title');
        return title === 'Laptop computers 2' || title === 'Android gadgets 2'
            ? 'topBottom'
            : undefined;
    }
}
