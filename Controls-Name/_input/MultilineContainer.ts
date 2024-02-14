import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Name/_input/MultilineContainer/MultilineContainer';
import { SyntheticEvent } from 'UICommon/Events';
import { ISuggestInput } from 'Controls-Name/_input/interface/ISuggestInput';
import { Record } from 'Types/entity';
import { INameValue } from 'Controls-Name/_input/interface/IInput';
import 'css!Controls-Name/Input';

export interface IMultilineContainerOptions extends ISuggestInput {
    firstLineTemplate?: Function;
    secondLineTemplate?: Function;
}

/**
 * Обертка для поле ввода ФИО.
 * @class Controls-Name/MultilineContainer
 * @extends UI/Base:Control
 * @mixes Controls/input:IBorderVisibility
 * @control
 * @public
 * @demo Controls-Name-demo/MultilineContainer
 */
export default class MultilineContainer extends Control<IMultilineContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _value: INameValue = {};

    protected _beforeMount(options: IMultilineContainerOptions): void {
        this._initOptions(options);
    }

    protected _beforeUpdate(options: IMultilineContainerOptions): void {
        this._initOptions(options);
    }

    protected _initOptions({
        firstName,
        middleName,
        lastName,
        value,
    }: IMultilineContainerOptions): void {
        this._value = {
            firstName: firstName || value?.firstName || '',
            middleName: middleName || value?.middleName || '',
            lastName: lastName || value?.lastName || '',
        };
    }

    protected _valueChangedHandler(
        event: SyntheticEvent,
        name: string,
        stringValue: string,
        value: INameValue
    ): void {
        if (stringValue !== undefined) {
            this._notify(`${name}Changed`, [stringValue, value]);
            this._value = { ...this._value, ...value };
        }
    }

    protected _onDataReceived(event: SyntheticEvent, item: Record): void {
        const fields = ['lastName', 'firstName', 'middleName'];
        const fieldsValue = [];
        fields.forEach((name) => {
            const value = item?.get(name);
            if (value && this._options[name] !== value) {
                this._value[name] = value;
                fieldsValue.push(value);
                this._notify(`${name}Changed`, [value, this._value]);
            }
        });
        this._notify('valueChanged', [fieldsValue.join(' '), this._value, item]);
    }

    protected _onValueChanged(
        event: SyntheticEvent,
        stringValue: string,
        nameValue: INameValue,
        item: Record
    ) {
        event.preventDefault();
        event.stopPropagation();
        this._notify('valueChanged', [stringValue, this._value, item]);
    }

    static defaultProps: object = {};
}

/**
 * @name Controls-Name/MultilineContainer#firstLineTemplate
 * @cfg {TemplateFunction} Содержит разметку с первым полем ввода ФИО.
 */

/**
 * @name Controls-Name/MultilineContainer#secondLineTemplate
 * @cfg {TemplateFunction} Содержит разметку со вторым полем ввода ФИО.
 */
