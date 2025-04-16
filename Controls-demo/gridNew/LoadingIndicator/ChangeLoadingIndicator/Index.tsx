import { Memory } from 'Types/source';
import { generateData, slowDownSource } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as React from 'react';
import { Container as Scroll } from 'Controls/scroll';
import { LoadingIndicatorTemplate } from 'Controls/list';
import { View } from 'Controls/grid';

function getData() {
    return generateData({
        count: 50,
        entityTemplate: { title: 'lorem' },
    });
}

function getSource(): Memory {
    const source = new Memory({
        keyProperty: 'key',
        data: getData(),
    });
    slowDownSource(source, 4000);
    return source;
}

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const [message, setMessage] = React.useState<string>('Initial message');

    const messageTemplate = React.useMemo(() => {
        return <div>{message}</div>;
    }, [message]);

    const columns: [] = [{ displayProperty: 'title', key: 'column-1' }];

    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <button
                onClick={() => {
                    setMessage('New message');
                }}
            >
                Поменять сообщение индикатора загрузки
            </button>
            <div className="controlsDemo__cell">
                <Scroll className="controlsDemo__height400" style={{ maxWidth: '700px' }}>
                    <View
                        name="list"
                        columns={columns}
                        storeId="ChangeLoadingIndicator"
                        loadingIndicatorTemplate={
                            <LoadingIndicatorTemplate
                                message={messageTemplate}
                                position={'global'}
                            />
                        }
                    />
                </Scroll>
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ChangeLoadingIndicator: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'key',
                    displayProperty: 'title',
                    source: getSource(),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 20,
                            page: 0,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    },
});
