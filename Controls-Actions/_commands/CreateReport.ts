import { Control } from 'UI/Base';
/**
 * Действие создания отчета
 *
 * @public
 */
export default class CreateReport {
    execute(_: object, initiator: Control): void {
        import('Feature/feature').then(({ Feature }) => {
            if (Feature.get(['eo_create_btn'])[0]) {
                import('EORegistry/CreateButtonConfigGetter').then(({ openCreateButton }) => {
                    openCreateButton(initiator);
                });
            } else {
                import('Controls/popup').then(({ StickyOpener }) => {
                    new StickyOpener().open({
                        // eslint-disable-next-line ui-modules-dependencies
                        template: 'EOCore/report:Selector',
                        allowAdaptive: true,
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
        });
    }
}
