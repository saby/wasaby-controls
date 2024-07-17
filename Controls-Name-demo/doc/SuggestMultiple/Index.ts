import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/SuggestMultiple/Suggest';
import { getSuggestSource } from 'Controls-Name-demo/doc/SuggestMultiple/Data';
import 'css!Controls-Name-demo/doc/SuggestMultiple/Index';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _lastName: string = '';
    protected _middleName: string = '';
    protected _firstName: string = '';
    protected _fields: string[] = [];
    protected _position: string = '';
    protected _suggestSource: Memory = null;

    protected _beforeMount(): void {
        this._fields = ['lastName', 'firstName', 'middleName'];

        this._suggestSource = getSuggestSource();
    }

    protected _chooseHandler(event: Event, item: Record): void {
        if (item.get('type') === 'person') {
            this._position = item.get('position');
        }
    }
}

export default Demo;
