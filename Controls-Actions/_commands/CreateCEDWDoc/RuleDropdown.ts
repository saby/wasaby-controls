/**
 * Редактор выбора регламента/типа документа для Кадрового ЭДО
 * @author Ефимов К.А.
 */

import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { SbisService, Memory, Query } from 'Types/source';
import { RecordSet } from 'Types/entity';

import template = require('wml!Controls-Actions/_commands/CreateCEDWDoc/RuleDropdown');

interface IRuleDropdownOptions extends IControlOptions {
    // значение редактора
    propertyValue: string;
    // тип документа
    docType: string;
    // название поля с идентификатором
    keyProperty: string;
}

export default class RuleDropdown extends Control<IRuleDropdownOptions> {
    readonly _template: TemplateFunction = template;
    // источник данных для выпадающего списка
    protected _source: Memory;
    // заголовок выпадающего списка
    protected _caption: string;
    // выбранные ключи
    protected _selectedKeys: string[];
    // рекордсет данных
    protected _items: RecordSet;

    protected _beforeMount(options: IRuleDropdownOptions): void {
        this._setStates(options);
        this._selectedKeys = options.propertyValue !== undefined ? [options.propertyValue] : [];
    }

    protected _beforeUpdate(options: IRuleDropdownOptions): void {
        if (options.docType !== this._options.docType) {
            this._setStates(options);
            this._selectedKeys = [];
        }
    }

    /**
     * обработчик на смену выбранных ключей
     * @param e
     * @param keys ключи
     * @protected
     */
    protected _selectedKeysChangedHandler(e: SyntheticEvent<Event>, keys: string[]): boolean {
        if (this._options.docType === 'StaffStatements') {
            const index = this._items.getIndexByValue('ComplexKey', keys[0]);
            const item = index > -1 ? this._items.at(index) : null;
            if (!item || item.get('IsFolder')) {
                return false;
            }

            this._notify('propertyValueChanged', keys, { bubbling: true });
        } else {
            this._notify('propertyValueChanged', keys, { bubbling: true });
        }
    }

    /**
     * устанавливает значения для отрисовки
     * @param options опции
     * @private
     */
    private _setStates(options: IRuleDropdownOptions): void {
        this._setCaption(options.docType);
        this._setSource(options);
    }

    /**
     * устанавливает заголовок выпадающего списка
     * @param docType тип документа
     * @private
     */
    private _setCaption(docType): void {
        if (docType === 'Отпуск') {
            this._caption = docType;
        } else if (docType === 'BusinessTrip') {
            this._caption = 'Командировка';
        } else {
            this._caption = 'Заявление';
        }
    }

    /**
     * устанавливает источник данных
     * @param options опции
     * @private
     */
    private async _setSource(options: IRuleDropdownOptions): Promise<void> {
        const data = [];
        let docType = options.docType;
        if (docType === 'Отгул') {
            const { TimeOffTypes } = await import('StaffDocs/Enums');
            for (const key in TimeOffTypes) {
                if (TimeOffTypes[key]) {
                    const item = TimeOffTypes[key];
                    data.push({
                        Uuid: item.key,
                        Name: item.value,
                    });
                }
            }
        } else if (docType === 'StaffStatements' || docType === 'BusinessTrip') {
            const docTypes = {};
            docTypes[docType] = null;
            const source = new SbisService({
                endpoint: 'StaffDocsConfig',
            });

            source
                .call('RegulationList', {
                    Config: {
                        DocTypes: docTypes,
                        ReturnSubTypes: 'hierarchy',
                    },
                })
                .then(async (result) => {
                    const rec = result.getRow();
                    const regulations = rec?.get('Regulations');
                    if (regulations) {
                        this._items = regulations;
                        this._source = new Memory({
                            keyProperty: 'Uuid',
                            data: regulations.getRawData(),
                            adapter: regulations.getAdapter(),
                        });
                    }
                });
        } else {
            const source = new SbisService({
                endpoint: {
                    contract: 'Отпуск',
                },
                binding: {
                    query: 'VacationTypesList',
                },
            });

            source
                .query(
                    new Query().where({
                        OnDate: null,
                    })
                )
                .then((result) => {
                    const rs = result.getAll();
                    this._source = new Memory({
                        keyProperty: 'Id',
                        data: rs.getRawData(),
                        adapter: rs.getAdapter(),
                    });
                });
        }

        this._source = new Memory({
            keyProperty: options.keyProperty || 'Uuid',
            data,
        });
    }
}
