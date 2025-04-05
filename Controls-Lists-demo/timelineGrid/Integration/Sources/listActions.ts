// Зафиксированная для тестов дата текущего дня на демо
const FIXED_DATE = new Date(2023, 0, 9, 14);

export default [
    {
        actionName: 'Controls-Lists/timelineGrid:ScaleAction',
        direction: 'increase',
        listId: 'TimelineGridBase',
        _fixedTimelineDate: FIXED_DATE,
    },
    {
        actionName: 'Controls-Lists/timelineGrid:ScaleAction',
        direction: 'decrease',
        listId: 'TimelineGridBase',
        _fixedTimelineDate: FIXED_DATE,
    },
];
