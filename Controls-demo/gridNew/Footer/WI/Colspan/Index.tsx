import * as React from 'react';
import { Memory } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as GridView } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

function getData() {
    return Countries.getData(7);
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const columns = React.useMemo(() => {
        return [
            { displayProperty: 'number', width: '25px' },
            { displayProperty: 'country', width: '100px' },
            { displayProperty: 'capital', width: '100px' },
            { displayProperty: 'population', width: '150px' },
            { displayProperty: 'square', width: '150px' },
        ];
    }, []);

    const footer = React.useMemo(() => {
        return [
            {
                startColumn: 1,
                endColumn: 2,
            },
            {
                startColumn: 2,
                endColumn: 4,
                template: React.forwardRef(
                    (_tplProps: object, tplRef: React.ForwardedRef<HTMLDivElement>) => {
                        return (
                            <div
                                className="tw-flex tw-w-full controls-background-success"
                                ref={tplRef}
                            >
                                Footer column 2 - 4
                            </div>
                        );
                    }
                ),
            },
            {
                startColumn: 4,
                endColumn: 6,
                template: React.forwardRef(
                    (_tplProps: object, tplRef: React.ForwardedRef<HTMLDivElement>) => {
                        return (
                            <div
                                className="tw-flex tw-w-full controls-background-warning"
                                ref={tplRef}
                            >
                                Footer column 4 - 6
                            </div>
                        );
                    }
                ),
            },
        ];
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flex">
            <GridView storeId="FooterColspan" columns={columns} footer={footer} />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FooterColspan: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
