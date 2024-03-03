import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as rk from 'i18n!Controls-Actions';

import * as template from 'wml!Controls-Actions/_commands/OpenReport/ReportTypeEditor';
import { IReportItem } from 'Controls-Actions/_commands/OpenReportUtils';

interface IOptions extends IControlOptions {
    propertyValue: IReportItem;
}

const DEFAULT_CAPTION = rk('Тип отчета');

export default class ReportTypeEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: string;
    protected _reportFilter: object;
    protected _disableSettings: boolean;
    protected _reportData: IReportItem;
    private _captionText: string;

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue?.id || null;
        this._captionText = propertyValue?.title || DEFAULT_CAPTION;
        this._reportFilter = propertyValue?.filter || {};
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
            // Получаем конфигурацию отчета
            this._reportData = result?.at(0).getRawData();
            this._reportData.filter = {};
            this._selectedKey = this._reportData?.id || null;
            this._captionText = this._reportData?.title || DEFAULT_CAPTION;
            this._disableSettings = !this._reportData;

            // Устанавливаем значение с фильтрами по умолчанию
            this._notify('propertyValueChanged', [this._reportData], {
                bubbling: true,
            });

            // Вызываем панель настройки фильтров
            const lightAPI = new reportAPI.LightAPI();
            lightAPI
                .openSettings(this, this._reportData.config, { ...this._reportFilter })
                .then((result) => {
                    this._reportData.filter = result;
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
            const lightAPI = new reportAPI.LightAPI();
            lightAPI
                .openSettings(this, this._reportData.config, { ...this._reportFilter })
                .then((result) => {
                    this._reportData.filter = result;

                    this._notify('propertyValueChanged', [this._reportData], {
                        bubbling: true,
                    });
                });
        });
    }
}
