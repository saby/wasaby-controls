import { Control, TemplateFunction } from 'UI/Base';

import * as template from 'wml!Controls-Actions/_commands/OpenFeedback/WidgetEditor';

// Зависимости из внешних модулей
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import { DataSet, PrefetchProxy, SbisService } from 'Types/source';
import {
    default as WidgetModel,
    KEY,
    DISPLAY_KEY,
    SOURCE_OPTIONS,
} from 'optional!Channel/models/NewsWidget';

/**
 * Окно настройки кнопки обратной связи
 * @extends UI/Base:Control
 * @control
 * @author Косарев К.А.
 */
interface IOptions {
    propertyValue: IWidgetOptions;
}
interface IWidgetOptions {
    name?: string;
    UUID?: string;
}

export default class WidgetEditor extends Control {
    protected _template: TemplateFunction = template;
    protected _inputSize: number;
    protected _lookupSource: SbisService = new SbisService(SOURCE_OPTIONS);
    protected _lookupKey: string = KEY;
    protected _lookupDisplayKey: string = DISPLAY_KEY;
    protected _startLookupItems: PrefetchProxy;
    protected _selectedKeys: string[] = [];
    protected _filter: object = {
        for_news: true,
        ProductGroupType: 'РекламацияВх',
    };

    protected _beforeMount({ propertyValue }: IOptions): void {
        if (propertyValue?.UUID) {
            this._selectedKeys = [propertyValue.UUID];
            this._startLookupItems = new PrefetchProxy({
                target: this._lookupSource,
                data: {
                    query: new DataSet({
                        rawData: {
                            _type: 'recordset',
                            d: [[propertyValue.UUID, propertyValue.name]],
                            s: [
                                { n: KEY, t: 'Строка' },
                                { n: DISPLAY_KEY, t: 'Строка' },
                            ],
                        },
                        adapter: 'adapter.sbis',
                        keyProperty: KEY,
                        model: WidgetModel,
                    }),
                },
            });
        }
    }

    /**
     * Обработчик на изменение значения в лукапе
     * @protected
     */
    protected _onWidgetChange(e: SyntheticEvent<MouseEvent>, items: RecordSet<WidgetModel>): void {
        let UUID;
        let name;
        const item = items.at(0);
        if (item) {
            UUID = item.get('ChannelUUID');
            name = item.get('Name');
        }
        this._notify('propertyValueChanged', [{ name, UUID }], { bubbling: true });
    }
}
