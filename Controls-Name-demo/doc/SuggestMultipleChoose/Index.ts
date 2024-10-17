import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name-demo/doc/SuggestMultipleChoose/Suggest';
import { getSuggestSource } from 'Controls-Name-demo/doc/SuggestMultipleChoose/Data';
import 'css!Controls-Name-demo/doc/SuggestMultipleChoose/Index';
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
        // при выборе сотрудника заполняем его карточку
        if (item.get('type') === 'person') {
            this._lastName = item.get('lastName');
            this._middleName = item.get('middleName');
            this._firstName = item.get('firstName');
            this._position = item.get('position');
        }
    }
}

export default Demo;
