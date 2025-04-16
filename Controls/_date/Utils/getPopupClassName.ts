import { IBaseSelectorOptions } from 'Controls/_date/interface/IBaseSelector';

export function getFontSizeClass(fontSize: string): string {
    // c fontSize 18px (20px, 24px и тд) линк смещается на 1px вниз, с 14px (13px, 12px и тд) на 1px вверх
    // относительно стандратного положения
    switch (fontSize) {
        case '4xl':
            return 'l';
        case '3xl':
            return 'l';
        case 'm':
            return 's';
        case 's':
            return 's';
        case 'xs':
            return 's';
        default:
            return 'm';
    }
}

export default function getPopupClassName(
    dateProps: Partial<IBaseSelectorOptions>,
    theme: string
): string {
    let className = '';
    if (dateProps.datePopupType === 'shortDatePicker') {
        if (!dateProps.chooseMonths && !dateProps.chooseQuarters && !dateProps.chooseHalfyears) {
            className = `controls-DateRangeSelectorLite__picker-years controls_popupTemplate_theme-${theme}`;
        } else {
            className = 'controls-DateRangeSelectorLite__picker-normal';
        }
        className += ` controls_shortDatePicker_theme-${theme}`;
    } else if (dateProps.datePopupType === 'compactDatePicker') {
        className +=
            `controls_compactDatePicker_theme-${theme} ` +
            'controls-CompactDatePicker__selector-margin controls-CompactDatePicker__popup';
    } else if (dateProps.datePopupType === 'datePicker') {
        className += `controls_datePicker_theme-${theme} controls-DatePopup__selector-marginTop_fontSize-${getFontSizeClass(
            dateProps.fontSize
        )}`;
        className += ' controls-DatePopup__selector-marginLeft';
        className += ` controls_popupTemplate_theme-${theme}`;
    }

    if (dateProps.popupClassName) {
        className += ` ${dateProps.popupClassName}`;
    }

    return className;
}
