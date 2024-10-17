/**
 * Редактор выбора типа отчета мотивации
 * @author Ефимов К.А.
 */

import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import template = require('wml!Controls-Actions/_commands/CreateMotivation/MotivationReportTypeEditor');

interface IMotivationReportTypeEditorOptions extends IControlOptions {
    // текущее значение редактора
    propertyValue: string;
}

export default class MotivationReportTypeEditor extends Control<IMotivationReportTypeEditorOptions> {
    readonly _template: TemplateFunction = template;
    // идентификатор выбранной записи
    protected _selectedKey: string;
    // записи списка отчетов
    protected _items: RecordSet;
    // текущее значение выпадающего списка
    protected _caption: string;

    protected _beforeMount(options: IMotivationReportTypeEditorOptions): void {
        this._setStates(options.propertyValue);
    }

    /**
     * обработчик на смену выбранной записи
     * @param e
     * @param item выбранная запись
     * @protected
     */
    protected _menuItemActivateHandler(e: SyntheticEvent<Event>, item: Model) {
        this._caption = item.get('title');
        this._notify('propertyValueChanged', [item.getKey()], { bubbling: true });
    }

    /**
     * проставляет текущие значения состояний
     * @private
     */
    private async _setStates(propertyValue: string): Promise<RecordSet> {
        const { getReportItems } = await import('Motivation/Reports/create');
        return getReportItems().then((items) => {
            this._items = items;
            if (propertyValue) {
                const index = this._items.getIndexByValue(
                    this._items.getKeyProperty(),
                    propertyValue
                );
                this._caption = index > -1 ? this._items.at(index)?.get('title') : 'Тип отчета';
            } else {
                this._caption = 'Тип отчета';
            }
        });
    }
}
