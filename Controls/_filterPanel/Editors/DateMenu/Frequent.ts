/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { DateMenuBase } from 'Controls/_filterPanel/Editors/DateMenu/DateMenuBase';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import * as DateTemplate from 'wml!Controls/_filterPanel/Editors/DateMenu/Frequent';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import 'css!Controls/filterPanel';
import { Memory } from 'Types/source';

const POPUP_CLASS_NAME = 'controls-DateMenuEditor-frequent-popup_shift';

interface IDateEditorFrequentOptions extends IControlOptions {
    selectedKeys: string[] | Date[];
    items?: RecordSet;
    captionFormatter?: Function;
    displayProperty: string;
    keyProperty: string;
    viewMode?: string;
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date, отображается в виде меню.
 * @class Controls/_filterPanel/Editors/Date
 * @extends UI/Base:Control
 * @mixes Controls/date:Input
 * @private
 */

class DateEditorFrequent extends DateMenuBase {
    protected _template: TemplateFunction = DateTemplate;
    protected _source: Memory;

    protected _initState(options: IDateEditorFrequentOptions): void {
        super._initState(options);
        this._source = new Memory({
            data: this._items.getRawData(),
            keyProperty: options.keyProperty,
        });
    }

    protected _selectItem(item: Model): void | boolean {
        this._notify('itemClick', [
            [item.getKey()],
            item.get(this._options.displayProperty),
        ]);
    }

    protected _getSelectedKeys(options: IDateEditorFrequentOptions): string[] {
        const selectedKeys =
            options.selectedKeys instanceof Array
                ? options.selectedKeys[0]
                : options.selectedKeys;
        const resetValue =
            options.resetValue instanceof Array
                ? options.resetValue[0]
                : options.resetValue;
        return super._getSelectedKeys({
            propertyValue: selectedKeys,
            resetValue,
        });
    }

    protected _openDatePopup(value: Date): void {
        super._openDatePopup(this._options.selectedKeys, POPUP_CLASS_NAME);
    }

    protected _periodChanged(startValue: Date, endValue: Date): void {
        const { Utils } = loadSync('Controls/dateRange');
        const captionFormatter =
            this._options.captionFormatter || Utils.formatDateRangeCaption;
        if (startValue || endValue || this._options.extendedCaption) {
            const textValue = captionFormatter(
                startValue,
                endValue,
                this._options.extendedCaption
            );
            if (this._isSingleSelection(this._options)) {
                this._notify('itemClick', [[startValue], textValue]);
            } else {
                this._notify('itemClick', [
                    [[startValue, endValue]],
                    textValue,
                ]);
            }
        }
        this._stickyOpener.close();
    }
}

export default DateEditorFrequent;
