import { Confirmation, Dialog } from 'Controls/popup';
import RequestFilterDetailsTemplate from 'Controls/_actionsPopup/RequestFilterDetailsTemplate';
import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TFilter } from 'Controls/interface';

function openFilterPanel(
    filterDescription: IFilterDescriptionItem[],
    currentFilter: TFilter
): Promise<{
    filterDescription?: IFilterDescriptionItem[];
    filter?: TFilter;
}> {
    return new Promise((resolve) => {
        Dialog.openPopup({
            template: 'Controls/filterPanelPopup:Sticky',
            templateOptions: {
                items: filterDescription,
                detailPanelTemplateName: 'Controls/filterPanelPopup:Sticky',
            },
            eventHandlers: {
                onResult: async ({ items }: { items: IFilterDescriptionItem[] }) => {
                    const filterModule =
                        await loadAsync<typeof import('Controls/filter')>('Controls/filter');
                    const filter = filterModule.FilterCalculator.getFilterByFilterDescription(
                        currentFilter,
                        items
                    );
                    resolve({
                        filter,
                        filterDescription: items,
                    });
                },
                onClose: () => {
                    resolve({});
                },
            },
        });
    });
}

export default function RequestSelection(
    filterDescription: IFilterDescriptionItem[],
    currentFilter: Record<string, any>
): Promise<{
    action: 'cancel' | 'continue' | 'applyFilter';
    actionPayload?: any;
}> {
    const buttons = [
        {
            caption: 'Отмена',
            buttonStyle: 'primary',
            value: 'cancel',
        },
        {
            caption: 'Продолжить',
            buttonStyle: 'secondary',
            value: 'continue',
        },
    ];
    const confirmation = new Confirmation({});
    let filterOpened = false;
    return new Promise((resolve) => {
        return confirmation
            .open({
                message: 'Напечатать весь список?',
                detailsContentTemplate: RequestFilterDetailsTemplate,
                buttons,
                detailsOptions: {
                    openFilterPanel: async () => {
                        filterOpened = true;
                        confirmation.close();
                        const openFilterResult = await openFilterPanel(
                            filterDescription,
                            currentFilter
                        );
                        resolve({
                            action: 'applyFilter',
                            actionPayload: openFilterResult,
                        });
                    },
                },
            })
            .then((value) => {
                if (value === 'cancel') {
                    resolve({
                        action: 'cancel',
                    });
                    return;
                } else if (value === 'continue') {
                    resolve({
                        action: 'continue',
                    });
                    return;
                }
                if (!filterOpened) {
                    resolve({
                        action: 'cancel',
                    });
                    return;
                }
            });
    });
}
