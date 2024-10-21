/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
const getPopupName = (datePopupType: string) => {
    if (!datePopupType) {
        return 'Controls/datePopup';
    }
    switch (datePopupType) {
        case 'compactDatePicker':
            return 'Controls/compactDatePicker:View';
        case 'shortDatePicker':
            return 'Controls/shortDatePicker:View';
        case 'datePicker':
            return 'Controls/datePopup';
        default:
            return datePopupType;
    }
};

export default getPopupName;
