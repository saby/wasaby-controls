import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { Memory } from 'Types/source';

const source = new Memory({
    data: [
        {
            key: 'before',
            title: 'За февраль 2024',
            date: new Date(2024, 1),
        },
        {
            key: 'after',
            title: 'За март 2024',
            date: new Date(2024, 2),
        },
    ],
    keyProperty: 'key',
    filter: (item, query: { period?: Date[] }) => {
        if (query.period) {
            const date1 = item.get('date');
            const date2 = query.period[0];
            return (
                !date2 ||
                (date1.getYear() === date2.getYear() && date1.getMonth() === date2.getMonth())
            );
        } else {
            return true;
        }
    },
});

const filterDescription = [
    {
        editorTemplateName: 'Controls/filterPanelEditors:DateRange',
        emptyKey: null,
        name: 'period',
        resetValue: [null, null],
        textValue: '',
        value: [null, null],
        type: 'dateRange',
        viewMode: 'frequent',
        caption: 'Отчетный период',
        editorOptions: {
            _date: new Date(2024, 1),
            chooseHalfyears: false,
            chooseQuarters: false,
            datePopupType: 'shortDatePicker',
            emptyCaption: 'Отч. периоды',
            extendedCaption: 'Отчетный период',
            resetEndValue: null,
            resetStartValue: null,
        },
    },
];

const menuPopupOptions = {
    templateOptions: {
        filterDescription,
        filterDescriptionEmptyText: 'Все',
    },
};

export default React.forwardRef(function Demo(_, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    icon="icon-AddButtonNew"
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    searchPlaceholder="Регламент"
                    menuBreadCrumbsVisibility="visible"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    menuPopupOptions={menuPopupOptions}
                />
            </div>
        </div>
    );
});
