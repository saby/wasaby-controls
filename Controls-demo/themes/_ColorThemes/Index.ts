import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/themes/_ColorThemes/Template');
import { RecordSet } from 'Types/collection';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _tabsItems: RecordSet | null = null;
    protected _tabsSelectedKey: string = '1';
    protected _listSelectedKey: string = '1';

    static _styles: string[] = ['DemoStand/Controls-demo'];

    protected _beforeMount(): void {
        this._tabsItems = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Document',
                },
                {
                    id: '2',
                    title: 'Files',
                },
                {
                    id: '3',
                    title: 'Orders',
                },
            ],
        });
    }
}
export default Index;
