import { Control } from 'UI/Base';

/**
 * Действие создания отчета
 *
 * @public
 */
export default class CreateReport {
    execute(_: object, initiator: Control): void {
        import('Controls/popup').then(({ StackOpener }) => {
            new StackOpener().open({
                // eslint-disable-next-line ui-modules-dependencies
                template: 'EOCore/report:Selector',
                opener: initiator,
                width: 650,
                closeOnOutsideClick: true,
                templateOptions: {
                    itemPadding: { top: 'l', bottom: 'l' },
                    hasPeriodFilter: true,
                    hasPeriodIspections: true,
                    showUsedTab: true,
                    reportClickEventType: 'create',
                    searchInputPlaceholder: 'Поиск...',
                    headingCaption: '',
                    isWasaby: true,
                    orgId: '-1',
                    isPeriodical: true,
                    idConfig: 'all',
                },
            });
        });
    }
}
