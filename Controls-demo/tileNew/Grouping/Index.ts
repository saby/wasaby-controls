import * as template from 'wml!Controls-demo/tileNew/Grouping/Grouping';
import { TemplateFunction, Control, IControlOptions } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImages';
import { groupConstants } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return [
        {
            id: 1,
            parent: null,
            type: null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: explorerImages[4],
            isDocument: true,
            group: groupConstants.hiddenGroup,
            width: 200,
        },
        {
            id: 2,
            parent: null,
            type: null,
            title: 'Сравнение систем по учету рабочего времени.xlsx',
            image: explorerImages[5],
            isDocument: true,
            group: groupConstants.hiddenGroup,
            width: 200,
        },
        {
            id: 3,
            parent: null,
            type: null,
            title: 'Конфеты копия',
            image: explorerImages[3],
            group: 'image',
            width: 300,
        },
        {
            id: 4,
            parent: null,
            type: null,
            title: 'PandaDoc.docx',
            image: explorerImages[6],
            isDocument: true,
            group: 'document',
            width: 200,
        },
        {
            id: 5,
            parent: null,
            type: null,
            title: 'SignEasy.docx',
            image: explorerImages[7],
            isDocument: true,
            group: 'document',
            width: 200,
        },
        {
            id: 6,
            parent: null,
            type: null,
            title: 'Договор на поставку печатной продукции',
            image: explorerImages[0],
            isDocument: true,
            group: 'document',
            width: 200,
        },
        {
            id: 7,
            parent: null,
            type: null,
            title: 'Договор аренды помещения',
            image: explorerImages[1],
            isDocument: true,
            group: 'document',
            width: 200,
        },
        {
            id: 8,
            parent: null,
            type: null,
            title: 'Конфеты',
            image: explorerImages[3],
            group: 'image',
            width: 300,
        },
        {
            id: 9,
            parent: null,
            type: null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: explorerImages[2],
            isDocument: true,
            group: 'document',
            width: 200,
        },
    ];
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _multiSelectVisibility: string = 'hidden';

    protected _switchMultiSelect(): void {
        this._multiSelectVisibility =
            this._multiSelectVisibility === 'hidden' ? 'visible' : 'hidden';
        const slice = this._options._dataOptionsValue.Grouping;
        slice.setState({
            multiSelectVisibility: this._multiSelectVisibility,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Grouping: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
