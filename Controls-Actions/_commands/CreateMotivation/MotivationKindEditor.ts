/**
 * Редактор выбора регламента для ПиВ
 * @author Ефимов К.А.
 */

import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { SbisService } from 'Types/source';

import template = require('wml!Controls-Actions/_commands/CreateMotivation/MotivationKindEditor');

interface IMotivationKindEditorOptions extends IControlOptions {
    // текущее значение редактора
    propertyValue: string;
    // тип документа
    type: number;
}

export default class MotivationKindEditor extends Control<IMotivationKindEditorOptions> {
    readonly _template: TemplateFunction = template;
    // идентификатор выбранной записи
    protected _selectedKey: string;
    // конфигурация лукапа
    protected _source: SbisService;
    protected _filter: object;
    protected _templateOptions: object;
    protected _popupOptions: object = {
        width: 650,
        maxWidth: 650,
    };

    protected _beforeMount(options: IMotivationKindEditorOptions): void {
        this._selectedKey = options.propertyValue || null;
        this._setStates(options.type);
    }

    /**
     * обработчик на смену выбранной записи
     * @param e
     * @param key идентификатор записи
     * @protected
     */
    protected _selectedKeyChangedHandler(e: SyntheticEvent<Event>, key: string) {
        this._notify('propertyValueChanged', [key], { bubbling: true });
    }

    /**
     * проставляет текущие значения состояний
     * @param docType тип документа
     * @private
     */
    private _setStates(docType: number): void {
        this._source = new SbisService({
            endpoint: 'SmotKind',
            keyProperty: 'Key',
            binding: {
                query: 'ListForConfigWithIterator',
            },
        });

        this._filter = {
            Type: docType,
        };

        this._templateOptions = {
            multiSelect: false,
            selectedKeys: this._selectedKey ? [this._selectedKey] : null,
            selectionType: 'leaf',
            kpiType: docType,
        };
    }
}
