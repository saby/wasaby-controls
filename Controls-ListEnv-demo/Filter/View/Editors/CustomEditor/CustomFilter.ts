import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/CustomEditor/CustomFilter';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemsWork = new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: '1',
                title: 'Работающие',
            },
            {
                key: '2',
                title: 'Уволенные',
            },
            {
                key: '3',
                title: 'Все сотрудники',
            },
        ],
    });
    protected _itemsTime = new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: '1',
                title: 'Сейчас',
            },
            {
                key: '2',
                title: 'За последние 3 месяца',
            },
            {
                key: '3',
                title: 'За последний год',
            },
        ],
    });
    protected _valueWork: string = '1';
    protected _valueTime: string = '1';

    protected _beforeMount(options): void {
        if (options.propertyValue) {
            this._valueWork = options.propertyValue[0];
            this._valueTime = options.propertyValue[1];
        }
    }

    protected _beforeUpdate(options): void {
        if (!isEqual(options.propertyValue, this._options.propertyValue)) {
            this._valueWork = options.propertyValue[0];
            this._valueTime = options.propertyValue[1];
        }
    }

    protected _onWorkKeyChanged(event: Event, newPropertyValue): void {
        this._valueWork = newPropertyValue.value;
        this._onKeyChanged(event);
    }

    protected _onTimeKeyChanged(event: Event, newPropertyValue): void {
        this._valueTime = newPropertyValue.value;
        this._onKeyChanged(event);
    }

    protected _onKeyChanged(event: Event): void {
        event.stopPropagation();
        this._notify(
            'propertyValueChanged',
            [
                {
                    value: [this._valueWork, this._valueTime],
                    textValue: this._getText(this._valueWork, this._valueTime),
                    viewMode: 'basic',
                },
            ],
            { bubbling: true }
        );
    }

    private _getText(keyWork: string, keyTime: string): string {
        let text = this._itemsWork.getRecordById(keyWork).get('title');
        if (keyWork === '1') {
            text += ` ${this._itemsTime.getRecordById(keyTime).get('title').toLowerCase()}`;
        }
        return text;
    }
}
