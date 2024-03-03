import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/SuggestTemplateWithTabs/resources/SuggestWithOneTab');

class SuggestTabTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _tabsOptions: object = null;
    protected _beforeMount(): void {
        this._tabsOptions = {
            items: new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 1,
                        title: 'Контрагенты',
                        text: 'test',
                        align: 'left',
                    },
                ],
            }),
            keyProperty: 'id',
            displayProperty: 'title',
        };
    }
}
export default SuggestTabTemplate;
