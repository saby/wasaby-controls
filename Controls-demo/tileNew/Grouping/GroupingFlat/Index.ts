import * as template from 'wml!Controls-demo/tileNew/Grouping/GroupingFlat/Grouping';
import { TemplateFunction, Control } from 'UI/Base';
import { Memory } from 'Types/source';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImages';
import { groupConstants } from 'Controls/list';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory = null;
    protected _multiSelectVisibility: string = 'hidden';

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: 'Сравнение условий конкурентов по ЭДО.xlsx',
                    image: explorerImages[4],
                    group: groupConstants.hiddenGroup,
                },
                {
                    id: 2,
                    title: 'Сравнение систем по учету рабочего времени.xlsx',
                    image: explorerImages[5],
                    group: groupConstants.hiddenGroup,
                },
                {
                    id: 3,
                    title: 'Конфеты копия',
                    image: explorerImages[3],
                    group: 'image',
                },
                {
                    id: 4,
                    title: 'PandaDoc.docx',
                    image: explorerImages[6],
                    group: 'document',
                },
                {
                    id: 5,
                    title: 'SignEasy.docx',
                    image: explorerImages[7],
                    group: 'document',
                },
                {
                    id: 6,
                    title: 'Договор на поставку печатной продукции',
                    image: explorerImages[0],
                    group: 'document',
                },
                {
                    id: 7,
                    title: 'Договор аренды помещения',
                    image: explorerImages[1],
                    group: 'document',
                },
                {
                    id: 8,
                    title: 'Конфеты',
                    image: explorerImages[3],
                    group: 'image',
                },
                {
                    id: 9,
                    title: 'Скриншот от 25.12.16, 11-37-16',
                    image: explorerImages[2],
                    group: 'document',
                },
            ],
        });
    }
}
