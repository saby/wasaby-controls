/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
export const Readable = [
    { actionName: 'Printer/actions:Print' },
    { actionName: 'Export/actions:PDF' },
    { actionName: 'Export/actions:Excel' },
];

export const Editable = [
    { actionName: 'Controls/actions:Remove' },
    { actionName: 'Controls/actions:Move' },
];

export const Full = [
    { actionName: 'Printer/actions:Print' },
    { actionName: 'Export/actions:PDF' },
    { actionName: 'Export/actions:Excel' },
    { actionName: 'Controls/actions:Remove' },
    { actionName: 'Controls/actions:Move' },
    { actionName: 'HistoryChanges/Action' },
];

export const FullWithSum = [
    { actionName: 'Printer/actions:Print' },
    { actionName: 'Export/actions:PDF' },
    { actionName: 'Export/actions:Excel' },
    { actionName: 'Controls/actions:Remove' },
    { actionName: 'Controls/actions:Move' },
    { actionName: 'HistoryChanges/Action' },
    { actionName: 'Summation/actions:Sum' },
];
