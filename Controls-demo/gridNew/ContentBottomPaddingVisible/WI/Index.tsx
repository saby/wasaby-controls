import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { View as GridView } from 'Controls/grid';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Container as ScrollContainer } from 'Controls/scroll';
import { AddButton, IVirtualScrollConfig } from 'Controls/list';

const { getData } = Countries;
const columns = Countries.getColumnsWithWidths(false);
const header = Countries.getHeader();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [hasFooter, setHasFooter] = React.useState(false);
    const [hasResults, setHasResults] = React.useState(false);
    const getGridViewProps = React.useMemo(() => {
        const resultProps = {};
        if (hasFooter) {
            resultProps.footerTemplate = () => {
                return <AddButton caption={'Add record'} />;
            };
        }
        if (hasResults) {
            resultProps.resultsPosition = 'bottom';
        }

        return resultProps;
    }, [hasFooter, hasResults]);
    const virtualScrollConfig = React.useMemo<IVirtualScrollConfig>(() => {
        return { pageSize: 10 };
    }, []);
    const divStyle = {
        display: 'flex',
    };
    return (
        <div
            ref={ref}
            className={'controlsDemo__wrapper controlsDemo_wrapper-treeGrid-base-treeGridView'}
        >
            <button
                onClick={() => {
                    setHasFooter(!hasFooter);
                }}
            >
                {`Подвал выведен в таблице: ${hasFooter}`}
            </button>
            <button
                onClick={() => {
                    setHasResults(!hasResults);
                }}
            >
                {`Результаты выведены в таблице: ${hasResults}`}
            </button>
            <div style={divStyle}>
                <div>
                    <span>Нет опций на ухе</span>
                    <ScrollContainer
                        className={'controlsDemo__height500 controlsDemo_fixedWidth800 '}
                        style={{
                            border: '1px dashed black',
                        }}
                    >
                        <GridView
                            storeId={'ContentBottomPaddingVisible'}
                            virtualScrollConfig={virtualScrollConfig}
                            columns={columns}
                            header={header}
                            bottomPaddingMode={'additional'}
                            {...getGridViewProps}
                        />
                    </ScrollContainer>
                </div>
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ContentBottomPaddingVisible: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
