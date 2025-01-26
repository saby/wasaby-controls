import { SELECTOR_CONTEXT_NAME } from 'Controls-Layout/selectorStack';
export const getConfig = () => {
    return {
        [SELECTOR_CONTEXT_NAME]: {
            dataFactoryName: 'Controls/selector:Factory',
            dataFactoryArguments: {
                configs: {
                    employee: {
                        prefetchConfig: 'Controls-Layout-demo/SelectorStack/PrefetchConfig',
                        filterConfig: {
                            placeholder: 'Сотрудники',
                            storeId: 'employee',
                            filterNames: ['booleanEditor'],
                        },
                    },
                },
            },
        },
    };
};
