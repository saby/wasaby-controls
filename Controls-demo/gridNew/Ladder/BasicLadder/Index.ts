import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Ladder/BasicLadder/Template';

function getData() {
    return [
        {
            key: 1,
            string: 'Лесенка',
            number: 123456789,
            money: 100.5,
        },
        {
            key: 2,
            string: 'Лесенка',
            number: 1000000,
            money: 25.99,
        },
        {
            key: 3,
            string: 'без использования',
            number: 1000000,
            money: 25.99,
        },
        {
            key: 4,
            string: 'прикладных (Очень длинный текст для проверки троеточия)',
            number: 300,
            money: 25.99,
        },
        {
            key: 5,
            string: 'прикладных (Очень длинный текст для проверки троеточия)',
            number: 300,
            money: 14999.9,
        },
        {
            key: 6,
            string: 'шаблонов.',
            number: 100500,
            money: 14999.9,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: object[] = [
        {
            displayProperty: 'key',
            width: '150px',
        },
        {
            displayProperty: 'string',
            textOverflow: 'ellipsis',
            displayType: 'string',
            width: '150px',
        },
        {
            displayProperty: 'number',
            displayType: 'number',
            width: '150px',
        },
        {
            displayProperty: 'money',
            displayType: 'money',
            width: '150px',
        },
    ];
    protected _ladderProperties: string[] = ['string', 'number', 'money'];
    protected _header: object[] = [
        { title: 'Ключ' },
        { title: 'Строка' },
        { title: 'Число' },
        { title: 'Деньги' },
    ];

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
}
