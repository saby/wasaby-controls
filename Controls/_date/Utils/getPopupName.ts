/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
const getPopupName = (datePopupType: string) => {
    switch (datePopupType) {
        case 'compactDatePicker':
            return 'Controls/compactDatePicker:View';
        case 'shortDatePicker':
            return 'Controls/shortDatePicker:View';
        default:
            return 'Controls/datePopup';
    }
};

export default getPopupName;
