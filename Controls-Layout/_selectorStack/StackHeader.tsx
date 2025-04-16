import { useStrictSlice } from 'Controls-DataEnv/context';
import { Ref, forwardRef } from 'react';
import type { ListSlice } from 'Controls/dataFactory';
import { MultiSelectorCheckbox, SimpleMultiSelector } from 'Controls-ListEnv/operationsConnected';
import { IFilterConfig, useSelectSlice } from 'Controls/selector';
import SubmitButton from './stackHeader/SubmitButton';
import Filter from './stackHeader/Filter';
import TopTemplate from './stackHeader/TopTemplate';
import { Title } from 'Controls/heading';
import 'css!Controls-Layout/selectorStack';

interface IStackHeaderProps extends IFilterConfig {
    listName: string;
    isAdaptive: boolean;
}

export const HeaderTemplate = forwardRef(
    (props: IStackHeaderProps, ref: Ref<HTMLDivElement>): JSX.Element | null => {
        const selectSlice = useSelectSlice();
        const tabConfig = selectSlice.state.configs[props.listName];
        const listSlice = useStrictSlice<ListSlice>(tabConfig.storeId);
        const stackWithTabs = Object.keys(selectSlice.state.configs).length !== 1;
        const multiSelectorVisible =
            selectSlice.state.multiSelect &&
            (stackWithTabs || !!listSlice.state.selectedKeys.length);
        const checkboxVisible = selectSlice.state.multiSelect && !stackWithTabs;
        const filterTemplateOptions = tabConfig.filterConfig?.filterTemplateOptions;
        const searchTemplateOptions = tabConfig.filterConfig?.searchTemplateOptions;
        const topTemplateConfig = tabConfig.topTemplateConfig;
        return (
            <div
                ref={ref}
                className={`controls-Layout-SelectorStack__header 
                    ${!checkboxVisible && !props.isAdaptive ? 'controls-padding_left-xl' : ''} `}
            >
                {!props.isAdaptive && checkboxVisible && (
                    <MultiSelectorCheckbox storeId={tabConfig.storeId} />
                )}
                {tabConfig.caption && (
                    <Title
                        className={'ws-ellipsis controls-margin_left-3xs  controls-margin_right-m'}
                        caption={tabConfig.caption}
                        fontSize={'4xl'}
                        readOnly={true}
                        tooltip={tabConfig.caption}
                    />
                )}
                <Filter
                    {...filterTemplateOptions}
                    {...searchTemplateOptions}
                    storeId={filterTemplateOptions?.storeId || tabConfig.storeId}
                />
                <TopTemplate {...topTemplateConfig} storeId={tabConfig.storeId} />
                {props.isAdaptive ? null : (
                    <div className={'controls-Layout-SelectorStack__header__rightTemplate'}>
                        {multiSelectorVisible && (
                            <SimpleMultiSelector storeId={tabConfig.storeId} />
                        )}
                        <SubmitButton />
                    </div>
                )}
            </div>
        );
    }
);
