import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as rk from 'i18n!Controls-Actions';

import * as template from 'wml!Controls-Actions/_commands/OpenReport/ReportTypeEditor';

interface IReportItem {
    id: string;
    title: string;
    config?: string;
    action?: string;
    filter?: object;
}

interface IOptions extends IControlOptions {
    propertyValue: IReportItem;
}

const DEFAULT_CAPTION = rk('Тип отчета');

export default class ReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: string;
    protected _disableSettings: boolean;
    protected _reportData: IReportItem;
    private _captionText: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue?.id || null;
        this._captionText = propertyValue?.title || DEFAULT_CAPTION;
        this._reportData = propertyValue || null;
        this._disableSettings = !this._reportData;
    }

    /**
     * Обработчик клика по кнопке выбора отчета
     * @protected
     */
    protected async _onChooseReportClick(): Promise<void> {
        return Promise.all([
            import('ReportBase/reportListDialog'),
            import('ReportBase/WarehouseReport/reportAPI'),
        ]).then(async ([reportDialog, reportAPI]: [undefined, undefined]) => {
            const result = await new reportDialog.API().open(this, {
                multiSelect: false,
                selectedKeys: [this._selectedKey],
            });

            const selectedReport = result.at(0);
            // Получаем конфигурацию отчета

            this._reportData = {
                id: selectedReport.get('id'),
                title: selectedReport.get('title'),
                config: selectedReport.get('config'),
                action: selectedReport.get('action'),
                filter: {}
            };

            this._selectedKey = this._reportData.id || null;
            this._captionText = this._reportData.title || DEFAULT_CAPTION;
            this._disableSettings = !this._reportData;

            // Устанавливаем значение с фильтрами по умолчанию
            this._notify('propertyValueChanged', [this._reportData], {
                bubbling: true,
            });

            // Вызываем панель настройки фильтров
            const lightAPI = new (reportAPI.LightAPI)();
            lightAPI.openSettings(this, this._reportData.config, this._reportData.filter || {}).then((filters) => {
                this._reportData.filter = filters;
                this._notify('propertyValueChanged', [this._reportData], {
                    bubbling: true,
                });
            });
        });
    }

    /**
     * Обработчик клика по кнопке настроек фильтров отчета
     * @protected
     */
    protected _onSettingsClick(): void {
        import('ReportBase/WarehouseReport/reportAPI').then(async (reportAPI) => {
            // Вызываем панель настройки фильтров
            const lightAPI = new (reportAPI.LightAPI)();
            lightAPI.openSettings(this, this._reportData.config, this._reportData.filter || {}).then((filters) => {
                this._reportData.filter = filters;

                this._notify('propertyValueChanged', [this._reportData], {
                    bubbling: true,
                });
            });
        });
    }
}
