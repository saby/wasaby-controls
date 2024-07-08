import { IDateMenuOptions, BY_PERIOD_KEY } from './IDateMenu';
import { StickyOpener } from 'Controls/popup';
import { Model } from 'Types/entity';

interface IDateMenuPopupOptions extends IDateMenuOptions {
    selectedKeys?: string[] | Date[];
    popupClassName?: string;
    selectedItemCallback: Function;
    periodChangedCallback: Function;
}

/**
 * Обработчик клика по пункту меню с выборо периода.
 * @private
 */
export function onItemClick(item: Model, options: IDateMenuPopupOptions): void | boolean {
    if (item.getKey() === BY_PERIOD_KEY) {
        openDatePopup(options.propertyValue, options);
        return false;
    } else {
        options.selectedItemCallback(item, options);
    }
}

function openDatePopup(value: Date | string, options: IDateMenuPopupOptions): void {
    const stickyOpener = new StickyOpener();
    let template = 'Controls/datePopup';
    const templateOptions = {
        selectionType: options.selectionType,
        isDayAvailable: options.isDayAvailable,
        minRange: options.minRange,
        ranges: options.ranges,
        mask: options.mask,
        dayTemplate: options.dayTemplate,
        startValueValidators: options.startValueValidators,
        endValueValidators: options.endValueValidators,
        resetEndValue: options.resetEndValue,
        resetStartValue: options.resetStartValue,
        editorMode: options.editorMode,
        chooseHalfyears: options.chooseHalfyears,
        chooseMonths: options.chooseMonths,
        chooseQuarters: options.chooseQuarters,
        chooseYears: options.chooseYears,
        shouldPositionBelow: options.shouldPositionBelow,
    };
    if (options.editorMode && options.editorMode === 'Lite') {
        template = 'Controls/shortDatePicker:View';
    }
    if (value && options.selectedKeys[0] === BY_PERIOD_KEY) {
        const isSingle = options.selectionType === 'single';
        let singleValue = value;
        if (isSingle) {
            singleValue = value instanceof Array ? value[0] : value;
        }
        templateOptions.startValue = isSingle ? singleValue : value[0];
        templateOptions.endValue = isSingle ? singleValue : value[1];
    }
    stickyOpener.open({
        template,
        allowAdaptive: true,
        opener: options.openerControl.current || options.openerControl,
        target: options.targetContainer.current || options.targetContainer,
        className: options.popupClassName,
        closeOnOutsideClick: true,
        templateOptions,
        eventHandlers: {
            onResult: (startValue, endValue) => {
                options.periodChangedCallback(startValue, endValue);
                stickyOpener.close();
                stickyOpener.destroy();
            },
        },
    });
}
