import { SELECT_SLICE_STORE_ID } from 'Controls/selector';
import { ISelectorTabConfig } from 'Controls/selector';
import { IGetConfigProps } from './Index';

const FLAT_LIST =
    'Controls-Layout-demo/SelectorStack/SelectorTemplate/workspaceTemplate/FlatList:ContentTemplate';
const HIERARCHY_LIST =
    'Controls-Layout-demo/SelectorStack/SelectorTemplate/workspaceTemplate/HierarchyList:ContentTemplate';

function getShoesConfig(props: IGetConfigProps): ISelectorTabConfig {
    const config: ISelectorTabConfig = {
        tabCaption: 'Обувь',
        prefetchConfig: {
            configLoader:
                'Controls-Layout-demo/SelectorStack/SelectorTemplate/prefetchConfig/PrefetchConfigShoes',
            configLoaderArguments: props,
        },
        contentConfig: {
            workspaceConfig: {
                templateName: props.hierarchy ? HIERARCHY_LIST : FLAT_LIST,
                templateOptions: {
                    storeId: 'shoes',
                },
            },
        },
        filterConfig: {
            searchTemplateOptions: {
                contrastBackground: true,
            },
        },
        storeId: 'shoes',
    };

    if (props.toolbar) {
        config.contentConfig.toolbarConfig = {
            actions:
                'Controls-Layout-demo/SelectorStack/SelectorTemplate/toolbarConfig/actions:actions',
        };
    }

    if (props.history) {
        config.historyConfig = {
            historyId: 'shoesHistoryId',
            allowPin: true,
        };
    }

    if (props.filter) {
        config.filterConfig = {
            filterTemplateOptions: {
                storeId: 'shoes',
                filterNames: ['discount'],
            },
            searchTemplateOptions: {
                contrastBackground: true,
            },
        };
    }

    if (props.addButton) {
        config.addButtonConfig = {
            menuConfigGetter:
                'Controls-Layout-demo/SelectorStack/SelectorTemplate/addButtonConfig/configGetter',
            activateHandler:
                'Controls-Layout-demo/SelectorStack/SelectorTemplate/addButtonConfig/activateHandler',
        };
    }
    return config;
}

function getClothesConfig(props: IGetConfigProps): ISelectorTabConfig {
    const config: ISelectorTabConfig = {
        tabCaption: 'Одежда',
        prefetchConfig: {
            configLoader:
                'Controls-Layout-demo/SelectorStack/SelectorTemplate/prefetchConfig/PrefetchConfigClothes',
            configLoaderArguments: props,
        },
        contentConfig: {
            workspaceConfig: {
                templateName: props.hierarchy ? HIERARCHY_LIST : FLAT_LIST,
                templateOptions: {
                    storeId: 'clothes',
                },
            },
        },
        storeId: 'clothes',
        caption: props.caption,
    };

    if (props.filter) {
        config.filterConfig = {
            searchTemplateOptions: {
                contrastBackground: true,
            },
        };
    }
    return config;
}

export const getConfig = (props: IGetConfigProps) => {
    const configs: Record<string, ISelectorTabConfig> = {
        shoes: getShoesConfig(props),
    };

    if (props.tabs) {
        configs.clothes = getClothesConfig(props);
    }

    return {
        [SELECT_SLICE_STORE_ID]: {
            dataFactoryName: 'Controls/selector:Factory',
            dataFactoryArguments: {
                loadDataTimeout: 10000,
                multiSelect: props.multiSelect,
                configs,
            },
        },
    };
};

export const getArguments = (props: IGetConfigProps) => {
    const configs: Record<string, ISelectorTabConfig> = {
        shoes: getShoesConfig(props),
    };

    if (props.tabs) {
        configs.clothes = getClothesConfig(props);
    }

    return {
        loadDataTimeout: 10000,
        multiSelect: props.multiSelect,
        configs,
        initialKey: props.initialKey,
    };
};
