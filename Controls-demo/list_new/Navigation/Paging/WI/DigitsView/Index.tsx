import { Container } from 'Controls/scroll';
import { HotKeysContainer, View } from 'Controls/list';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as React from 'react';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { DataContext } from 'Controls-DataEnv/context';
const Index = React.forwardRef(function Index(props, ref) {
    const virtualScrollConfig = {
        pageSize: 40,
    };
    const slice = React.useContext(DataContext).DigitsViewCallback;
    const digitRenderCallback = React.useCallback((index: number) => {
        switch (index) {
            case 1:
                return '🐭';
            case 4:
                return '🐠';
            case 9:
                return '☀';
            case 15:
                return '🍑';
        }
    }, []);
    const newNavigation = {
        ...slice.state.navigation,
        viewConfig: {
            pagingMode: 'numbers',
            digitRenderCallback,
        },
    };
    React.useEffect(() => {
        slice.setState({
            navigation: newNavigation,
        });
    }, []);
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth800'}>
            <Container className={'controlsDemo__height400'}>
                <HotKeysContainer>
                    <View
                        storeId={'DigitsViewCallback'}
                        moveMarkerOnScrollPaging={true}
                        virtualScrollConfig={virtualScrollConfig}
                    />
                </HotKeysContainer>
            </Container>
        </div>
    );
});
Index.getLoadConfig = (): Record<string, IDataConfig<IListDataFactoryArguments>> => {
    return {
        DigitsViewCallback: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: generateData({
                        count: 150,
                        entityTemplate: { title: 'lorem' },
                    }),
                }),
                navigation: {
                    source: 'page',
                    view: 'infinity',
                    sourceConfig: {
                        pageSize: 50,
                        page: 0,
                        hasMore: false,
                    },
                    viewConfig: {
                        pagingMode: 'numbers',
                    },
                },
            },
        },
    };
};
export default Index;
