import * as React from 'react';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Container as ScrollContainer } from 'Controls/scroll';
import { MoreButtonTemplate } from 'Controls/list';
import { View as GridView } from 'Controls/grid';
import { Button } from 'Controls/buttons';
import { IColumnConfig } from 'Controls/gridReact';

import 'css!Controls-demo/gridReact/MoreButton/style';

const COLUMNS: IColumnConfig[] = [
    {
        key: 'title',
        displayProperty: 'title',
        width: '1fr',
    },
];

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

function getData() {
    return generateData({
        count: 30,
        entityTemplate: { title: 'lorem' },
    });
}

function Demo() {
    const getRowProps = React.useCallback(() => {
        return {};
    }, []);

    const [moreButtonIndicator, setMoreButtonIndicator] = React.useState(true);

    const toggleMoreButtonIndicator = React.useCallback((): void => {
        setMoreButtonIndicator(!moreButtonIndicator);
    }, [moreButtonIndicator]);

    const moreButtonTemplate = React.useMemo(() => {
        return React.forwardRef(
            (moreButtonTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) => {
                return (
                    <div ref={ref} className="ControlsDemo__moreButton_wrapper">
                        <MoreButtonTemplate {...moreButtonTemplateProps} />
                        {moreButtonIndicator && (
                            <i className="ControlsDemo__moreButton_indicator tw-cursor-help" title="Дополнительная информация"/>
                        )}
                    </div>
                );
            }
        );
    }, [moreButtonIndicator]);

    return (
        <div className="controlsDemo__wrapper controlsDemo_maxWidth800 Controls-list__navigation_MoreButton_buttonConfig controlsDemo_line-height18">
            <ScrollContainer className="controlsDemo__height400">
                <GridView
                    storeId="NavigationMoreButtonTemplate"
                    columns={COLUMNS}
                    getRowProps={getRowProps}
                    moreButtonTemplate={moreButtonTemplate}
                    moreFontColorStyle="danger"
                />
            </ScrollContainer>
            <Button
                caption={
                    (moreButtonIndicator ? 'Убрать' : 'Добавить') + " индикатор у кнопки 'Ещё'"
                }
                onClick={toggleMoreButtonIndicator}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NavigationMoreButtonTemplate: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 7,
                            hasMore: false,
                            page: 0,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    },
});
