import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { SbisService } from 'Types/source';

import template = require('wml!Controls-Actions/_commands/CreateVacancy/RuleEditor');

/**
 * Опции редактора
 * @private
 */
interface IRegulationEditorOptions extends IControlOptions {
    /**
     * Ключ выбранного регламента
     */
    propertyValue: string;
}

/**
 * Редактор регламента создаваемой вакансии
 *
 * @class Controls-Actions/commands:RegulationEditor
 * @extends UI/Base:Control
 * @author Эккерт Д.Р.
 * @public
 */
export default class RegulationEditor extends Control<IRegulationEditorOptions> {
    protected readonly _template: TemplateFunction = template;
    protected _source = RegulationEditor.source;
    protected _keyProperty = RegulationEditor.keyProperty;
    protected _displayProperty = RegulationEditor.displayProperty;
    protected _selectorOptions = {
        multiSelect: false,
        selectionType: 'leaf',
        filter: {
            DocType: [
                {
                    docType: 'ЗаявкаНаВакансию',
                },
            ],
        },
        searchParam: this._displayProperty,
    };

    /**
     * Обработчик изменения выбранного регламента
     * @param _ объект события
     * @param key ключ регламента
     * @protected
     */
    protected _onSelectedKeyChanged(_: SyntheticEvent, key: string) {
        this._notify('propertyValueChanged', [key], { bubbling: true });
    }

    static keyProperty = 'Идентификатор';
    static displayProperty = 'Название';
    static source = new SbisService({
        keyProperty: RegulationEditor.keyProperty,
        endpoint: 'Regulation',
        binding: {
            query: 'StdListTranslit',
        },
    });
}
