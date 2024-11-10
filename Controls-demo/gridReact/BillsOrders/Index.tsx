import * as React from 'react';

import { date as dateFormat } from 'Types/formatter';
import { Date } from 'Controls/baseDecorator';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import 'Controls/gridReact';
import {
    TrackedPropertiesTemplate,
    ITrackedPropertiesTemplateProps,
    IVirtualScrollConfig,
} from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Button } from 'Controls/buttons';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { getSource } from '../resources/BillsOrdersData';
import DateNumberCell from './CellRenders/DateNumberCell';
import MainDataCell from './CellRenders/MainDataCell';
import SumStateCell from './CellRenders/SumStateCell';

const ACTIONS: IItemAction[] = getMoreActions().map((it) => {
    return { ...it, showType: TItemActionShowType.MENU };
});
const LADDER_PROPERTIES: string[] = ['date', 'number'];
const VIRTUAL_SCROLL_CONFIG: IVirtualScrollConfig = {
    pageSize: 10,
};

// Аналог stickyProperty
function StickedProperties(props: ITrackedPropertiesTemplateProps): React.ReactElement {
    const date = props.trackedValues.date as Date;
    return (
        <TrackedPropertiesTemplate {...props}>
            {date && <Date value={date} format={dateFormat.FULL_DATE_FULL_YEAR} />}
        </TrackedPropertiesTemplate>
    );
}

interface IState {
    showImportantFlag: boolean;
    getRowProps: TGetRowPropsCallback;
    columns: IColumnConfig[];
}

interface IProps {
    forwardedRef: React.ForwardedRef<HTMLDivElement>;
}

export default class Demo extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            showImportantFlag: false,
            getRowProps: (item) => {
                return {
                    actionsClassName: 'controls-itemActionsV_position_topRight',
                };
            },
            columns: [
                {
                    key: 'date-number',
                    width: '100px',
                    render: <DateNumberCell />,
                    getCellProps: (_item) => {
                        return { halign: 'right' };
                    },
                },
                {
                    key: 'main-data',
                    width: '2fr',
                    render: <MainDataCell />,
                },
                {
                    key: 'sum-state',
                    width: '1fr',
                    render: <SumStateCell showImportantFlag={false} />,
                },
            ],
        };
    }

    private _toggleShowImportantFlag(): void {
        const newShowImportantFlag = !this.state.showImportantFlag;
        const newColumns = this.state.columns.slice();
        newColumns[2].render = <SumStateCell showImportantFlag={newShowImportantFlag} />;

        this.setState({
            showImportantFlag: newShowImportantFlag,
            columns: newColumns,
        });
    }

    render() {
        return (
            <div ref={this.props.forwardedRef} className={'controlsDemo__wrapper'}>
                <Button
                    caption={'Change showImportantFlag'}
                    onClick={() => this._toggleShowImportantFlag()}
                />

                <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                    <GridView
                        storeId="listData"
                        columns={this.state.columns}
                        virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                        multiSelectVisibility={'visible'}
                        itemActions={ACTIONS}
                        getRowProps={this.state.getRowProps}
                        ladderProperties={LADDER_PROPERTIES}
                        trackedProperties={LADDER_PROPERTIES}
                        trackedPropertiesTemplate={StickedProperties}
                    />
                </ScrollContainer>
            </div>
        );
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: getSource(),
                    navigation: {
                        source: 'page',
                        sourceConfig: { hasMore: false, page: 1, pageSize: 10 },
                        view: 'infinity',
                    },
                },
            },
        };
    }
}
