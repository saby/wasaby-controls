import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/SuggestWithEmptyTabs/resources/SuggestTabTemplate');

class SuggestTabTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _tabsOptions: object = null;

    protected _beforeMount(): void {
        this._tabsOptions = {
            source: new Memory({
                keyProperty: 'id',
                data: [
                    {
                        id: 1,
                        title: 'Контрагенты',
                        text: 'test',
                        align: 'left',
                    },
                    { id: 2, title: 'Компании', text: 'test', align: 'left' },
                ],
            }),
            keyProperty: 'id',
            displayProperty: 'title',
        };
    }
}
export default SuggestTabTemplate;
