import { ForwardedRef, forwardRef, useState, useMemo, useEffect, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { Stack } from 'Controls-Layout/selectorStack';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { baseConfigWithAppliedFilter } from 'Controls-Layout-demo/SelectorStack/Source/FlatList/Index';
import { hierarchyConfig } from 'Controls-Layout-demo/SelectorStack/Source/HierarchyList/Index';
import {
    multiSelectConfig,
    multiSelectConfigWithToolbar,
} from 'Controls-Layout-demo/SelectorStack/MultiSelect/Index';
import { historyConfig } from 'Controls-Layout-demo/SelectorStack/HistoryConfig/Index';
import {
    tabsConfig,
    tabsConfigWithCaption,
    tabsConfigWithFilter,
} from 'Controls-Layout-demo/SelectorStack/Configs/WithTabs/Index';
import 'Controls-Layout-demo/SelectorStack/Stack/HistorySourceDemo';
import 'css!Controls-Layout-demo/SelectorStack/Stack/Index';

function SelectorDemo(props: IControlProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const [stackProps, setStackProps] = useState([]);

    const selectedItems = useMemo(() => {
        return new RecordSet({
            rawData: [
                { id: 0, title: 'Балетки' },
                { id: 5, title: 'Кеды' },
                { id: 6, title: 'Кожанные сандали' },
            ],
            keyProperty: 'id',
        });
    }, []);

    const selectedItemsClothes = useMemo(() => {
        return new RecordSet({
            rawData: [
                { id: 12, title: 'Джемпер' },
                { id: 13, title: 'Джинсы' },
            ],
            keyProperty: 'id',
        });
    }, []);

    useEffect(() => {
        const loadConfigs = [
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...baseConfigWithAppliedFilter,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...multiSelectConfigWithToolbar,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...hierarchyConfig,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls-Layout-demo/SelectorStack/Stack/DemoFactory',
                    dataFactoryArguments: {
                        ...multiSelectConfig,
                        selectedItems,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...tabsConfig,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...tabsConfigWithFilter,
                        selectedItems,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls-Layout-demo/SelectorStack/Stack/DemoFactory',
                    dataFactoryArguments: {
                        ...tabsConfigWithCaption,
                        selectedItems: selectedItemsClothes,
                    },
                },
            },
            {
                selectContextNode: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...historyConfig,
                    },
                },
            },
        ];
        Promise.all(loadConfigs.map((config) => Loader.load(config))).then((results) => {
            const configs = results.map((result, index) => {
                return {
                    loadResults: result,
                    configs: loadConfigs[index],
                    itemKey: index,
                };
            });

            setStackProps(configs);
        });
    }, []);

    return (
        <div className={'tw-flex ws-flex-wrap'} ref={ref}>
            {stackProps &&
                stackProps.map((stackProp) => (
                    <div className={'Controls-Layout-demo_selector'} key={stackProp?.itemKey}>
                        <Stack {...stackProp} className={'Controls-Layout-demo_selector'} />
                    </div>
                ))}
        </div>
    );
}

const forwardedSelectorDemo = forwardRef(SelectorDemo);
export default forwardedSelectorDemo;
