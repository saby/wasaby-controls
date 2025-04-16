export const FactoryConfig = {
    dataFactoryName: 'Controls-Actions/commands:CreateLeadFactory',
    dataFactoryArguments: {
        objectName: 'CRMThemeSelectionHistory',
        group: 2,
        wrapName: 'Создать счет',
        subGroup: 1,
        filter: {
            БезПапок: false,
            Hierarchy: false,
            RemovedReglaments: 'exclude',
            Requisites: ['CRMThemeSelectionHistory'],
            ThemesTypes: ['Лид'],
            HistoryRecent: false,
            РазделИД: null,
        },
    },
};
