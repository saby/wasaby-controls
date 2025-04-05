import { forwardRef } from 'react';
import { View, HeaderContent } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

const header = Countries.getHeader();
header[header.length - 2].template = SquareTemplate;
header[header.length - 1].template = PopulationTemplate;
const columns = Countries.getColumnsWithWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className + ' controlsDemo__wrapper controlDemo__grid-header-cellTemplate';
    /**
     * Необязательно оборачивать список в скролл контейнер.
     * Здесь это сделано для местного решения этих ошибок со stickyHeader.
     * https://online.sbis.ru/opendoc.html?guid=64a425b7-4a53-4bb1-932e-2899ffe5fd98
     * https://online.sbis.ru/opendoc.html?guid=138c14b7-d571-4e61-8177-cb0322763bff
     */
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__inline-flex">
                <View storeId="HeaderCellTemplate" header={header} columns={columns} />
            </Container>
        </div>
    );
});

export default Component;

function SquareTemplate(props) {
    return (
        <HeaderContent
            {...props}
            contentTemplate={() => {
                return (
                    <div style={{ color: '#FF7033' }}>
                        Площадь км<sup>2</sup>
                    </div>
                );
            }}
        />
    );
}

function PopulationTemplate(props) {
    return (
        <HeaderContent
            {...props}
            contentTemplate={() => {
                return (
                    <div style={{ color: '#069922' }}>
                        Плотность населения чел/км<sup>2</sup>
                    </div>
                );
            }}
        />
    );
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        HeaderCellTemplate: {
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
