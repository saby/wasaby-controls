/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as rk from 'i18n!Controls';
import { Control, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { StickyOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IRangeSelectableOptions } from 'Controls/dateRange';

interface IDateMenuOptions extends IControlOptions, IRangeSelectableOptions {
    propertyValue: Date;
    items?: RecordSet;
    dateMenuItems?: RecordSet;
    extendedCaption?: string;
    captionFormatter?: Function;
    displayProperty: string;
    keyProperty: string;
    viewMode?: string;
}

export const BY_PERIOD_KEY = 'byPeriod';
const BY_PERIOD_TITLE = rk('За период');
const ON_DATE_TITLE = rk('На дату');

export class DateMenuBase extends Control<IDateMenuOptions> {
    protected _selectedKeys: string[] = [];
    protected _items: RecordSet;
    protected _stickyOpener: StickyOpener;

    protected _beforeMount(options: IDateMenuOptions): void {
        this._initState(options);
    }

    protected _beforeUpdate(newOptions: IDateMenuOptions): void {
        if (
            newOptions.propertyValue !== this._options.propertyValue ||
            newOptions.items !== this._options.items ||
            newOptions.dateMenuItems !== this._options.dateMenuItems ||
            newOptions.viewMode !== this._options.viewMode
        ) {
            this._initState(newOptions);
        }
    }

    protected _initState(options: IDateMenuOptions): void {
        this._items = this._getItemsWithDateRange(options);
        this._selectedKeys = this._getSelectedKeys(options);
    }

    protected _itemClick(event: SyntheticEvent, item: Model): void | boolean {
        event.stopPropagation();
        if (item.getKey() === BY_PERIOD_KEY) {
            this._openDatePopup(this._options.propertyValue);
            return false;
        } else {
            this._selectItem(item);
        }
    }

    protected _selectItem(item: Model): void {
        // for overrides
    }

    protected _isSingleSelection({ selectionType }: IDateMenuOptions): boolean {
        return selectionType === 'single';
    }

    protected _getSelectedKeys({
        propertyValue,
        resetValue,
    }: IDateMenuOptions): string[] {
        const selectedKeys = [];
        if (propertyValue !== undefined) {
            const item = this._items.getRecordById(propertyValue);
            if (item) {
                selectedKeys.push(item.getKey());
            }
            if (!selectedKeys.length && propertyValue !== resetValue) {
                selectedKeys.push(BY_PERIOD_KEY);
            }
        }
        return selectedKeys;
    }

    protected _getItemsWithDateRange(options: IDateMenuOptions): RecordSet {
        const defaultItems = new RecordSet({
            rawData: [
                {
                    [options.keyProperty]: BY_PERIOD_KEY,
                    [options.displayProperty]: this._isSingleSelection(options)
                        ? ON_DATE_TITLE
                        : BY_PERIOD_TITLE,
                },
            ],
            keyProperty: options.keyProperty,
        });
        const dateMenuItems = options.dateMenuItems || options.items;
        if (dateMenuItems) {
            const items = dateMenuItems.clone();
            items.append(defaultItems);
            return items;
        }
        return defaultItems;
    }

    protected _openDatePopup(value: Date, popupClassName?: string): void {
        if (!this._stickyOpener) {
            this._stickyOpener = new StickyOpener();
        }
        let template = 'Controls/datePopup';
        const templateOptions = { ...this._options };
        if (this._options.editorMode && this._options.editorMode === 'Lite') {
            template = 'Controls/shortDatePicker:View';
        }
        if (value && this._selectedKeys[0] === BY_PERIOD_KEY) {
            templateOptions.startValue = value[0];
            templateOptions.endValue = value[1];
        }
        this._stickyOpener.open({
            template,
            allowAdaptive: false,
            opener: this,
            target: this._container,
            className: popupClassName,
            templateOptions,
            eventHandlers: {
                onResult: this._periodChanged.bind(this),
            },
        });
    }

    protected _periodChanged(startValue: Date, endValue: Date): void {
        // for overrides
    }

    protected _beforeUnmount(): void {
        if (this._stickyOpener) {
            this._stickyOpener.destroy();
        }
    }

    static getDefaultOptions(): object {
        return {
            displayProperty: 'title',
            keyProperty: 'id',
        };
    }
}
