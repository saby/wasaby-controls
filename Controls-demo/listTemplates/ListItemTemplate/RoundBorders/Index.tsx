import { forwardRef } from 'react';
import { View } from 'Controls/list';
import { ListItemTemplate } from 'Controls/listTemplates';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Images from 'Controls-demo/resources/Images';
import Component from 'Controls-demo/gridNew/ColumnScroll/Base';

function getData() {
    return [
        {
            title: 'Заголовок №1',
            description: 'Описание №1',
            photoUrl: Images.tile.tile1,
            dominant: '33, 49, 65',
            complementary: '202, 216, 119',
            dominantTheme: 'dark',
        },
        {
            title: 'Заголовок №2',
            description: 'Описание №2',
            photoUrl: Images.tile.tile2,
            dominant: '73, 73, 73',
            complementary: '119, 195, 216',
            dominantTheme: 'dark',
        },
        {
            title: 'Заголовок №3',
            description: 'Описание №3',
            photoUrl: Images.tile.tile3,
            dominant: '231, 227, 231',
            complementary: '154, 28, 154',
            dominantTheme: 'light',
        },
        {
            title: 'Заголовок №4',
            description: 'Описание №4',
            photoUrl: Images.tile.tile4,
            dominant: '239, 183, 155',
            complementary: '162, 54, 0',
            dominantTheme: 'light',
        },
    ];
}

const roundBorder = {
    tr: 'l',
    tl: 'l',
    br: 'l',
    bl: 'l',
} as const;

const itemActions: IItemAction[] = [
    {
        id: 'delete',
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'Удалить',
    },
];

const RoundBorders = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth550';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="listData"
                markerVisibility="hidden"
                roundBorder={roundBorder}
                itemActions={itemActions}
                itemTemplate={itemTemplate}
            />
        </div>
    );
});

export default RoundBorders;

function itemTemplate(itemTemplateProps) {
    return (
        <ListItemTemplate
            {...itemTemplateProps}
            imageProperty="photoUrl"
            title={itemTemplateProps.item.contents.get('title')}
            description={itemTemplateProps.item.contents.get('description')}
            contentTemplate={itemTemplateProps.item.contents.get('description')}
        />
    );
}

RoundBorders.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        listData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'title',
                    data: getData(),
                }),
                markerVisibility: 'hidden',
            },
        },
    };
};
