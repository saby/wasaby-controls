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
import 'css!Controls-Layout/selectorStack';

interface ISwitchableContent {
    className: string;
    listName: string;
}

interface IContextProviderData {
    listResults?: Record<string, IListDataFactoryLoadResult>;
    listConfigs?: Record<string, IDataConfig>;
}

export interface ISelectorStackWrapperProps {
    loadResults: {
        [SELECT_SLICE_STORE_ID]: ISelectFactoryLoadResults;
    };
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
            <div
                ref={ref}
                className={`${props.className} controls-Layout-SelectorStack__container`}
            >
                <HeaderTemplate listName={props.listName} />
                <ContentTemplate listName={props.listName} />
            </div>
        );
    }
);

export const Stack = forwardRef((props, ref: LegacyRef<StackTemplate>): ReactElement => {
    const slice = useSelectSlice();

    const { selectedTabKey, configs, listConfigs, listResults } = slice.state;
    const stackWithTabs = useMemo(() => {
        return Object.keys(configs).length > 1;
    }, [configs]);
    const switchableItems = useMemo(() => {
        return Object.keys(configs).map((key) => {
            return {
                key,
                itemTemplate: SwitchableContent,
                templateOptions: {
                    listName: key,
                },
            };
        });
    }, [configs]);

    const providerData = useMemo<IContextProviderData>(() => {
        const contextKeys = Object.keys(configs);
        return contextKeys.reduce((data: IContextProviderData, key) => {
            return {
                listConfigs: {
                    ...data.listConfigs,
                    ...listConfigs[key],
                },
                listResults: {
                    ...data.listResults,
                    ...listResults[key],
                },
            };
        }, {});
    }, [listConfigs, listResults]);

    return (
        <Provider configs={providerData.listConfigs} loadResults={providerData.listResults}>
            <StackTemplate
                ref={ref}
                bodyContentTemplate={
                    <SwitchableAreaView
                        forwardedRef={ref}
                        selectedKey={selectedTabKey}
                        items={switchableItems}
                        className={'controls-Layout-SelectorStack__switchableArea'}
                    />
                }
                rightBorderVisible={stackWithTabs}
                toolbarContentTemplate={RightPanel}
                backgroundStyle="unaccented"
            />
        </Provider>
    );
});

/**
 * Раскладка окна выбора из справочника
 * @class Controls-Layout/selectorStack:Stack
 */

export default function StackWrapper(props: ISelectorStackWrapperProps) {
    return (
        <Provider configs={props.configs} loadResults={props.loadResults}>
            <Stack />
        </Provider>
    );
}
