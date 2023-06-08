/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/Editors/SelectionContainer';

interface ISelectedContainerOptions {
    propertyValue: string | string[];
    multiSelect?: boolean;
}

/**
 * Контейнер для работы со списочным редактором, который отслеживает изменение выбранного элемента и уведомляет с помощью события selectedKeyChanged.
 * @class Controls/_filterPanel/Editors/SelectionContainer
 * @private
 */

/**
 * @event selectedKeyChanged Происходит при изменении выбранного значения в списке.
 * @name Controls/_filterPanel/Editors/SelectionContainer#selectedKeyChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {number|string} selectedKey Ключ выбранного элемента.
 */

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[];

    protected _beforeMount(options: ISelectedContainerOptions) {
        this._selectedKeys = this._getSelectedKeys(
            options.multiSelect,
            options.propertyValue
        );
    }

    protected _beforeUpdate(options: ISelectedContainerOptions) {
        if (this._options.propertValue !== options.propertyValue) {
            this._selectedKeys = this._getSelectedKeys(
                options.multiSelect,
                options.propertyValue
            );
        }
    }

    protected _selectedKeysChanged(event: Event, key: string[]): void {
        event.stopPropagation();
        this._updateKeyAndNotifyChanged(key);
    }

    protected _selectedKeyChanged(event: Event, key: string): void {
        this._updateKeyAndNotifyChanged([key]);
    }

    private _updateKeyAndNotifyChanged(key: string[]): void {
        this._selectedKeys = this._getSelectedKeys(
            this._options.multiSelect,
            key
        );
        const result = this._options.multiSelect ? key : key[0];
        this._notify('selectedKeysChanged', [result]);
    }

    /**
     * Метод получения выбранных ключей
     * @param multiSelect
     * @param propertyValue
     */
    private _getSelectedKeys(
        multiSelect: boolean,
        propertyValue: string | string[]
    ): string[] {
        if (propertyValue !== null && propertyValue !== undefined) {
            return multiSelect && propertyValue instanceof Array
                ? propertyValue
                : [propertyValue];
        } else {
            return [];
        }
    }
}
