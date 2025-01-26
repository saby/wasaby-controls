import type { IValidationStatus } from 'Controls/interface';
import type { SyntheticEvent } from 'UICommon/Events';

import { type IControlOptions, Control, TemplateFunction } from 'UI/Base';
import { SbisService } from 'Types/source';

import * as template from 'wml!Controls-Actions/_commands/CreateVacancy/RuleEditor';

/**
 * Опции редактора
 * @private
 */
interface IRegulationEditorOptions extends IControlOptions {
    /**
     * Ключ выбранного регламента
     */
    propertyValue: string;
    /**
     * Статус валидации
     */
    validationStatus?: IValidationStatus;
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
    protected _source: SbisService = RegulationEditor.source;
    protected _keyProperty: string = RegulationEditor.keyProperty;
    protected _displayProperty: string = RegulationEditor.displayProperty;
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
        searchParam: this._displayProperty
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

    static keyProperty: string = 'Идентификатор';
    static displayProperty: string = 'Название';
    static source: SbisService = new SbisService({
        keyProperty: RegulationEditor.keyProperty,
        endpoint: 'Regulation',
        binding: {
            query: 'StdListTranslit',
        },
    });
}
