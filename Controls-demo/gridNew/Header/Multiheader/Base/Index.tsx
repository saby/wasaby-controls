import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { MultiHeader } from 'Controls-demo/gridNew/DemoHelpers/Data/MultiHeader';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

const header = MultiHeader.getHeader1();
const columns = Countries.getColumnsWithWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__grid-header-multiHeader-base controlsDemo__height400 controlsDemo_widthFit';
    /**
     * Необязательно оборачивать список в скролл контейнер.
     * Здесь это сделано для местного решения этих ошибок со stickyHeader.
     * https://online.sbis.ru/opendoc.html?guid=64a425b7-4a53-4bb1-932e-2899ffe5fd98
     * https://online.sbis.ru/opendoc.html?guid=138c14b7-d571-4e61-8177-cb0322763bff
     */
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height400 controlsDemo__inline-flex">
                <View
                    backgroundStyle="default"
                    storeId="MultiheaderBase"
                    header={header}
                    columns={columns}
                />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        MultiheaderBase: {
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
