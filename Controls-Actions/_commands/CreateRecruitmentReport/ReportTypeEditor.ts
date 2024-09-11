import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { reportSource, ReportType } from './Const';
import { SyntheticEvent } from 'UICommon/Events';
import template = require('wml!Controls-Actions/_commands/CreateRecruitmentReport/ReportTypeEditor');
import { Memory } from 'Types/source';
import { Permission } from 'Permission/access';

/**
 * Опции редактора
 * @private
 */
interface IReportTypeEditorOptions extends IControlOptions {
    /**
     * Выбранный тип отчета
     */
    propertyValue: ReportType;
}

/**
 * Редактор типа создаваемого отчета
 *
 * @extends UI/Base:Control
 * @author Эккерт Д.Р.
 * @public
 */
export default class ReportTypeEditor extends Control<IReportTypeEditorOptions> {
    protected readonly _template: TemplateFunction = template;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: this._getFilteredItems(),
        });
    }

    protected _afterMount(options: IReportTypeEditorOptions): void {
        this._notify('propertyValueChanged', [options.propertyValue], { bubbling: true });
    }

    /**
     * Фильтрует данные для построения дропдауна
     */
    protected _getFilteredItems(): typeof reportSource {
        return reportSource.filter((source) =>
            source.rights
                ? source.rights.every((right) =>
                      Permission.checkRights([right.zone], 0, right.requiredLevel)
                  )
                : true
        );
    }

    /**
     * Обработчик изменения выбранного типа отчета
     * @param _ объект события
     * @param key тип отчета
     * @protected
     */
    protected _onSelectedKeyChanged(_: SyntheticEvent, key: ReportType): void {
        this._notify('propertyValueChanged', [key], { bubbling: true });
    }

    static defaultProps: Partial<IReportTypeEditorOptions> = {
        propertyValue: ReportType.Responsible,
    };
}
