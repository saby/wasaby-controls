/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as DateRangeTemplate from 'wml!Controls/_filterPanelEditors/DateRange';
import { loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import { IEditorOptions } from 'Controls/filterPanel';
import { StickyOpener } from 'Controls/popup';
import 'css!Controls/filterPanelEditors';
import { process } from 'Controls/error';

interface IDateRangeOptions extends IEditorOptions<Date[]> {
    extendedCaption?: string;
    captionFormatter?: Function;
}

/**
 * Контрол используют в качестве редактора для выбора даты или периода.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanelEditors/DateRange
 * @extends UI/Base:Control
 * @mixes Controls/dateRange:Selector
 * @mixes Controls/date:ICaption
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/DateRangeEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/DateRangeEditor/Index
 * @public
 */

class DateRangeEditor extends Control<IDateRangeOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _stickyOpener: StickyOpener;

    protected _handleRangeChanged(event: SyntheticEvent, startValue: Date, endValue: Date): void {
        this._notifyValueChanged(startValue, endValue);
    }

    protected _notifyValueChanged(startValue: Date, endValue: Date): void {
        const viewMode =
            !startValue && !endValue && this._options.extendedCaption ? 'extended' : 'basic';
        const extendedValue = {
            value: [startValue, endValue],
            textValue: this._getTextValue(startValue, endValue),
            viewMode,
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
        if (this._stickyOpener) {
            this._stickyOpener.close();
        }
    }

    protected _handleOpenClick(): void {
        this._children.dateRange.openPopup();
    }

    protected _openDatePopup(): void {
        if (!this._stickyOpener) {
            this._stickyOpener = new StickyOpener();
        }
        const currentStartValue = this._options.propertyValue?.length
            ? this._options.propertyValue[0]
            : null;
        const currentEndValue = this._options.propertyValue?.length
            ? this._options.propertyValue[1]
            : null;
        const templateOptions = {
            ...this._options,
            startValue: currentStartValue,
            endValue: currentEndValue,
        };
        loadAsync('Controls/date')
            .then((dateLib) => {
                this._stickyOpener.open({
                    template: dateLib.getDatePopupName(this._options.datePopupType),
                    opener: this,
                    fittingMode: 'adaptiveOverflow',
                    closeOnOutsideClick: true,
                    target: this._container,
                    templateOptions,
                    eventHandlers: {
                        onResult: (startValue: Date | null, endValue: Date | null) => {
                            const dateSelected = typeof startValue !== 'string';
                            if (
                                dateSelected &&
                                (currentStartValue !== startValue || currentEndValue !== endValue)
                            ) {
                                this._notifyValueChanged(startValue, endValue);
                            }
                        },
                    },
                });
            })
            .catch((error: Error) => {
                return process({ error });
            });
    }

    private _getTextValue(startValue: Date, endValue: Date): string {
        const dateRangeLib = loadSync('Controls/dateRange');
        const captionFormatter =
            this._options.captionFormatter || dateRangeLib.Utils.formatDateRangeCaption;
        return captionFormatter(startValue, endValue, this._options.extendedCaption);
    }

    protected _beforeUnmount(): void {
        if (this._stickyOpener) {
            this._stickyOpener.destroy();
            this._stickyOpener = null;
        }
    }

    static getDefaultOptions(): object {
        return {
            propertyValue: [null, null],
            fontWeight: 'default',
            shouldPositionBelow: true,
        };
    }
}

export default DateRangeEditor;

/**
 * @name Controls/_filterPanelEditors/DateRange#validators
 * @cfg {Function} Массив функций валидации выбранного значения.
 * @remark В каждую функцию аргументом приходит выбранное значение value
 */
