import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getData } from 'Controls-ListEnv-demo/Toc/Data';
import 'Controls/operations';
import { Base as MasterDetail } from 'Controls/masterDetail';
import { View as TreeView } from 'Controls/tree';
import { default as TOC } from 'Controls-ListEnv/Toc';
import { useSlice } from 'Controls-DataEnv/context';

const demoStyle = {
    height: '400px',
    width: '600px',
};

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('documents');
    const activeElement = slice.activeElement;

    // при переключении "пальцев" на демке раскрываются узлы в detail
    // Вся работа происходит через слайс
    React.useEffect(() => {
        slice.setExpandedItems([activeElement]);
    }, [activeElement]);

    const master = React.useMemo(() => {
        return (
            <TOC
                imageProperty="none"
                alignment="left"
                storeId="documents"
                selectedStyle="default"
                className="controls-padding_right-3xl controls-padding_top-m"
            />
        );
    }, []);

    const detail = React.useMemo(() => {
        return (
            <TreeView
                storeId="documents"
                attrs={{
                    style: {
                        width: '410px',
                    },
                }}
            />
        );
    }, []);

    return (
        <div ref={ref} style={demoStyle} className="controls-padding_top-m">
            <MasterDetail
                newDesign={true}
                masterWidth={250}
                masterMaxWidth={250}
                masterMinWidth={250}
                master={master}
                detail={detail}
                className={'tw-h-full'}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            documents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    root: 'in_root-1',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    displayProperty: 'caption',
                    keyProperty: 'key',
                },
            },
        };
    },
});
