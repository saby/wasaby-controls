import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as template from 'wml!Controls-ListEnv-demo/SuggestSearchInput/InBrowser/resources/SuggestTabTemplate';

interface ISuggestTabOptions {
    tabs: object[];
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _tabsOptions: object = null;
    protected _beforeMount(options: ISuggestTabOptions): void {
        this._tabsOptions = {
            source: new Memory({
                keyProperty: 'id',
                data: options.tabs || [
                    {
                        id: 'name',
                        title: 'Сортудники',
                        text: 'test',
                        align: 'left',
                    },
                    {
                        id: 'city',
                        title: 'Города',
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
