import { IDateMenuOptions, BY_PERIOD_KEY } from './IDateMenu';
import { StickyOpener } from 'Controls/popup';
import { Model } from 'Types/entity';

export function onItemClick(item: Model, options: IDateMenuOptions): void | boolean {
    if (item.getKey() === BY_PERIOD_KEY) {
        openDatePopup(options.propertyValue, options);
        return false;
    } else {
        options.selectedItemCallback(item, options);
    }
}

export function openDatePopup(value: Date | string, options: IDateMenuOptions): void {
    const stickyOpener = new StickyOpener();
    let template = 'Controls/datePopup';
    const templateOptions = { ...options };
    if (options.editorMode && options.editorMode === 'Lite') {
        template = 'Controls/shortDatePicker:View';
    }
    if (value && options.selectedKeys[0] === BY_PERIOD_KEY) {
        const isSingle = options.selectionType === 'single';
        templateOptions.startValue = isSingle ? value : value[0];
        templateOptions.endValue = isSingle ? value : value[1];
    }
    stickyOpener.open({
        template,
        allowAdaptive: false,
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
