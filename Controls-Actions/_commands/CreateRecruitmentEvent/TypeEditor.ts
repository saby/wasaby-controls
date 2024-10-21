import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { SbisService } from 'Types/source';
import { IEventInfo } from './Types';

import template = require('wml!Controls-Actions/_commands/CreateRecruitmentEvent/TypeEditor');

/**
 * Опции редактора
 * @private
 */
interface ITypeEditorOptions extends IControlOptions {
    /**
     * Текущая конфигурация создаваемого события
     */
    propertyValue: IEventInfo;
}

/**
 * Редактор типа создаваемого события
 *
 * @class Controls-Actions/commands:RecruitmentEventTypeEditor
 * @extends UI/Base:Control
 * @author Эккерт Д.Р.
 * @public
 */
export default class TypeEditor extends Control<ITypeEditorOptions> {
    protected readonly _template: TemplateFunction = template;
    protected _source = TypeEditor.source;
    protected _filter: object;

    protected _beforeMount(options: ITypeEditorOptions) {
        this._filter = this._calculateFilter(options);
    }

    protected _beforeUpdate(options: ITypeEditorOptions) {
        this._filter = this._calculateFilter(options);
    }

    /**
     * Обработчик изменения типа создаваемого события
     * @param _ объект браузерного события
     * @param type тип события
     * @protected
     */
    protected _onSelectedKeyChanged(_: SyntheticEvent, type: string): void {
        this._notify('propertyValueChanged', [{ ...this._options.propertyValue, type }], {
            bubbling: true,
        });
    }

    /**
     * Обработчик изменения состояния 'Запланировано' у события
     * @param _ объект события
     * @param isPlaned состояния поля 'Запланировано'
     * @protected
     */
    protected _onPlanedChanged(_: SyntheticEvent, isPlaned: boolean): void {
        this._notify('propertyValueChanged', [{ type: null, isPlaned }], { bubbling: true });
    }

    /**
     * Высчитывает какой фильтр для источника применяется
     * @param propertyValue текущее состояния редактора
     * @private
     */
    private _calculateFilter({ propertyValue }: ITypeEditorOptions) {
        return {
            composition: [
                propertyValue?.isPlaned
                    ? 'candidate_event_planned_contact'
                    : 'candidate_event_complete_contact',
            ],
        };
    }

    static defaultProps: Partial<ITypeEditorOptions> = {
        propertyValue: {
            isPlaned: false,
            type: null,
        },
    };

    static source = new SbisService({
        keyProperty: 'key',
        endpoint: {
            contract: 'RecruitmentUI',
        },
        binding: {
            query: 'Menu',
        },
    });
}
