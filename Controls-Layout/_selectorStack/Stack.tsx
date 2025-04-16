import { forwardRef, ForwardedRef, useMemo, LegacyRef, ReactElement, useEffect } from 'react';
import { Stack as StackTemplate } from 'Controls/popupTemplate';
import { Provider } from 'Controls-DataEnv/context';
import { HeaderTemplate } from './StackHeader';
import { ContentTemplate } from './StackContent';
import { View as SwitchableAreaView } from 'Controls/switchableArea';
import { useSelectSlice } from 'Controls/selector';
import { useSlice } from 'Controls-DataEnv/context';
import { IListDataFactoryLoadResult, ListSlice } from 'Controls-DataEnv/list';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import RightPanel from './RightPanel';
import { SELECT_SLICE_STORE_ID } from 'Controls/selector';
import { ISelectFactoryLoadResults, ISelectFactoryArguments } from 'Controls/selector';
import { FocusArea } from 'UICore/Focus';
import { useAdaptiveMode } from 'UI/Adaptive';
import 'css!Controls-Layout/selectorStack';

interface ISwitchableContent {
    listName: string;
    isAdaptive: boolean;
}

interface IStackContent {
    listName: string;
    className: string;
}

/**
 * Опции для настройки раскладки стекового окна выбора.
 * @public
 */
export interface ISelectorStackWrapperProps {
    /**
     * Объект, содержащий результаты загрузки {@link Controls/selector:Factory фабрики окна выбора}
     */
    loadResults: {
        [SELECT_SLICE_STORE_ID]: ISelectFactoryLoadResults;
    };
    /**
     * Аргументы для {@link Controls/selector:Factory фабрики окна выбора}
     */
    configs: {
        [SELECT_SLICE_STORE_ID]: {
            dataFactoryName: string;
            dataFactoryArguments: ISelectFactoryArguments;
        };
    };
}

export const SwitchableContent = forwardRef(
    (props: ISwitchableContent, ref: ForwardedRef<unknown>): ReactElement | null => {
        const slice = useSelectSlice();
        const { submitActivated, configs } = slice.state;
        const { storeId } = configs[props.listName];
        const sliceList = useSlice<ListSlice>(storeId);
        useEffect(() => {
            if (submitActivated && sliceList) {
                slice.addSelectLoadByConfig(props.listName, sliceList?.state);
            }
        }, [submitActivated]);
        return (
            <div ref={ref} className={'controls-Layout-SelectorStack__container'}>
                <ContentTemplate listName={props.listName} isAdaptive={props.isAdaptive} />
            </div>
        );
    }
);

const StackContent = forwardRef(
    (props: IStackContent, ref: ForwardedRef<unknown>): ReactElement | null => {
        const slice = useSelectSlice();
        const isAdaptive = useAdaptiveMode().device.isPhone();
        const { configs, listConfigs, listResults } = slice.state;
        const stackWithTabs = useMemo(() => {
            return Object.keys(configs).length > 1;
        }, [configs]);
        return (
            <Provider
                configs={listConfigs[props.listName]}
                loadResults={listResults[props.listName]}
            >
                <StackTemplate
                    headerContentTemplate={
                        <FocusArea autofocus="true">
                            <HeaderTemplate listName={props.listName} isAdaptive={isAdaptive} />
                        </FocusArea>
                    }
                    headerBorderVisible={false}
                    bodyContentTemplate={
                        <SwitchableContent
                            listName={props.listName}
                            ref={ref}
                            isAdaptive={props.isAdaptive}
                        />
                    }
                    rightBorderVisible={stackWithTabs}
                    toolbarContentTemplate={
                        <RightPanel listName={props.listName} isAdaptive={isAdaptive} />
                    }
                    backgroundStyle="unaccented"
                    isAdaptive={isAdaptive}
                    className={props.className}
                />
            </Provider>
        );
    }
);

export const Stack = forwardRef((props, ref: LegacyRef<StackTemplate>): ReactElement => {
    const slice = useSelectSlice();
    const isAdaptive = useAdaptiveMode().device.isPhone();

    const { selectedTabKey, configs } = slice.state;
    const switchableItems = useMemo(() => {
        return Object.keys(configs).map((key) => {
            return {
                key,
                itemTemplate: StackContent,
                templateOptions: {
                    listName: key,
                    isAdaptive,
                },
            };
        });
    }, [configs]);

    return (
        <SwitchableAreaView
            forwardedRef={ref}
            selectedKey={selectedTabKey}
            items={switchableItems}
            className={'controls-Layout-SelectorStack__switchableArea'}
        />
    );
});

/**
 * Раскладка окна выбора из справочника
 * @class Controls-Layout/selectorStack:Template
 * @mixes Controls/selector:ISelectorConfig
 * @demo Controls-Layout-demo/SelectorStack/SelectorTemplate/Index
 * @public
 */
export default function Template(props: ISelectorStackWrapperProps) {
    return (
        <Provider configs={props.configs} loadResults={props.loadResults}>
            <Stack />
        </Provider>
    );
}
