/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    DateMenuBase,
    BY_PERIOD_KEY,
} from 'Controls/_filterPanel/Editors/DateMenu/DateMenuBase';
import * as DateTemplate from 'wml!Controls/_filterPanel/Editors/DateMenu/_DateMenu';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { factory } from 'Types/chain';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import 'css!Controls/filterPanel';

export interface IDateMenuOptions extends IControlOptions {
    propertyValue: Date;
    items?: RecordSet;
    extendedCaption?: string;
    captionFormatter?: Function;
    displayProperty: string;
    keyProperty: string;
    viewMode?: string;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanel/Editors/Date
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @private
 */

class DateEditor extends DateMenuBase {
    protected _template: TemplateFunction = DateTemplate;
    protected _caption: string;
    protected _fastItem: Model;

    protected _initState(options: IDateMenuOptions): void {
        this._items = this._getItems(options);
        this._selectedKeys = this._getSelectedKeys(options);
        this._setTextValue(options, options.propertyValue);
    }

    protected _selectItem(item: Model): void | boolean {
        const key = item.getKey();
        this._selectedKeys = [key];
        this._caption = item.get(this._options.displayProperty);
        this._propertyValueChanged(key, this._caption);
    }

    protected _propertyValueChanged(
        newValue: string | Date | Date[],
        textValue?: string
    ): void {
        const extendedValue = {
            value: newValue,
            textValue,
            viewMode: 'basic',
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    protected _onItemClick(event: SyntheticEvent, item: Model): void | boolean {
        return this._itemClick(event, item);
    }

    protected _setTextValue(
        options: IDateMenuOptions,
        value: Date | Date[]
    ): Promise<void> | void {
        const item = this._items.getRecordById(this._selectedKeys[0]);
        if (item && this._selectedKeys[0] !== BY_PERIOD_KEY) {
            this._caption = item.get(options.displayProperty);
        } else if (value) {
            return loadAsync('Controls/dateRange').then(({ Utils }) => {
                const captionFormatter =
                    options.captionFormatter || Utils.formatDateRangeCaption;
                const startValue = value instanceof Array ? value[0] : value;
                const endValue = value instanceof Array ? value[1] : value;
                this._caption = captionFormatter(
                    startValue,
                    endValue,
                    options.extendedCaption
                );
            });
        }
    }

    protected _getItems(options: IDateMenuOptions): RecordSet {
        const items = super._getItemsWithDateRange(options);
        if (this._isAdditionalFilter(options)) {
            this._fastItem = factory(items)
                .filter((item) => {
                    return item.get('frequent');
                })
                .first();
            if (this._fastItem) {
                items.remove(this._fastItem);
            }
        } else {
            this._fastItem = null;
        }
        return items;
    }

    protected _periodChanged(startValue: Date, endValue: Date): void {
        const isSingle = this._isSingleSelection(this._options);
        this._selectedKeys = [BY_PERIOD_KEY];
        const valueRange = [startValue, endValue];
        this._setTextValue(this._options, valueRange).then(() => {
            this._stickyOpener.close();
            this._propertyValueChanged(
                isSingle ? startValue : valueRange,
                this._caption
            );
        });
    }

    private _isAdditionalFilter(options: IDateMenuOptions): boolean {
        return (
            options.viewMode === 'extended' ||
            (options.viewMode === 'frequent' &&
                options.extendedCaption &&
                isEqual(options.propertyValue, options.resetValue))
        );
    }
}

export default DateEditor;
