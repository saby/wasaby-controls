import { useCallback, forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Data } from 'Controls-demo/gridNew/Results/ResultsColspanCallback/Data';

const { getData } = Data;

const columns = Data.getColumns();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    const itemsReadyCallback = useCallback((items: RecordSet) => {
        items.setMetaData({
            ...items.getMetaData(),
            results: Data.getMeta(items.getAdapter()),
        });
    }, []);
    const resultsColspanCallback = useCallback(
        (column: IColumn, columnIndex: number): TColspanCallbackResult => {
            if (columnIndex === 2) {
                return 'end';
            }
        },
        []
    );
    return (
        <div className={rootClass} ref={ref}>
            <View
                resultsColspanCallback={resultsColspanCallback}
                storeId="ResultsColspanCallback"
                columns={columns}
                resultsPosition="bottom"
                itemsReadyCallback={itemsReadyCallback}
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ResultsColspanCallback: {
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
};
