import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Logger } from 'UI/Utils';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { View as ExplorerView } from 'Controls/explorer';
import { Container as ScrollContainer } from 'Controls/scroll';
import {
    ItemTemplate as TileItemTemplate,
    SmallItemTemplate as TileNodeItemTemplate,
    ITileItemProps,
} from 'Controls/tile';

import * as MemorySource from 'Controls-demo/explorerNew/ExplorerMemory';
import { GadgetsImages } from 'Controls-demo/DemoData/images/gadgets';
import * as CustomTileItemContent from 'wml!Controls-demo/Explorer/resources/CustomItemContent';

import 'css!Controls-demo/explorerNew/WI/TileItemTemplate/Explorer';
import { useContent } from 'UICore/Jsx';

const itemActions: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
        handler(item) {
            Logger.info('action phone Click ', item);
        },
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU,
        handler() {
            alert('Message Click');
        },
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'profile',
        showType: TItemActionShowType.MENU,
        handler() {
            Logger.info('action profile Click');
        },
    },
    {
        id: 4,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete pls',
        showType: TItemActionShowType.MENU,
        handler() {
            Logger.info('action delete Click');
        },
    },
    {
        id: 5,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
        handler(item) {
            Logger.info('action phone Click ', item);
        },
    },
    {
        id: 6,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU,
        handler() {
            alert('Message Click');
        },
    },
    {
        id: 7,
        icon: 'icon-Profile',
        title: 'profile',
        showType: TItemActionShowType.MENU,
        handler() {
            Logger.info('action profile Click');
        },
    },
    {
        id: 8,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete pls',
        showType: TItemActionShowType.MENU,
        handler() {
            Logger.info('action delete Click');
        },
    },
];

function getData() {
    return [
        {
            id: 1,
            parent: null,
            'parent@': true,
            title: 'Документы отделов',
        },
        {
            id: 11,
            parent: 1,
            'parent@': true,
            title: '1. Электронный документооборот',
        },
        {
            id: 12,
            parent: 1,
            'parent@': true,
            title: '2. Отчетность через интернет',
        },
        {
            id: 121,
            parent: 12,
            'parent@': true,
            title: 'Papo4ka',
            image: GadgetsImages.iPad,
        },
        {
            id: 1211,
            parent: 121,
            'parent@': true,
            title: 'Doc1',
            image: GadgetsImages.mac,
            isDocument: true,
        },
        {
            id: 1212,
            parent: 121,
            'parent@': true,
            title: 'Doc12',
            image: GadgetsImages.appleWathc,
            isDocument: true,
        },
        {
            id: 122,
            parent: 12,
            'parent@': true,
            title: 'Papo4ka2',
            image: GadgetsImages.iPhone,
        },
        {
            id: 13,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.appleWathc,
            isDocument: true,
        },
        {
            id: 14,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.macBook,
            isDocument: true,
        },
        {
            id: 15,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.macBookAir,
            isDocument: true,
        },
        {
            id: 16,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.appleWathc,
            isDocument: true,
        },
        {
            id: 17,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.magicMouse2,
            isDocument: true,
        },
        {
            id: 18,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.iPad,
            isDocument: true,
        },
        {
            id: 19,
            parent: 1,
            'parent@': null,
            title: 'Сравнение условий конкурентов по ЭДО.xlsx',
            image: GadgetsImages.macBook,
            isDocument: true,
        },
        {
            id: 111,
            parent: 11,
            'parent@': true,
            title: 'Задачи',
        },
        {
            id: 91,
            parent: 111,
            'parent@': true,
            title: 'Очень длинный текст внтури папки "Задачи"',
        },
        {
            id: 92,
            parent: 91,
            'parent@': true,
            title: 'Очень длинный текст внтури папки "Очень длинный текст внтури папки Задачи"',
        },
        {
            id: 94,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 95,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 96,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 97,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 98,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 99,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 911,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 912,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 913,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 914,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 915,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 916,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 917,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 918,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 919,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 920,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 921,
            parent: 92,
            'parent@': null,
            title: 'Задача',
        },
        {
            id: 112,
            parent: 11,
            'parent@': null,
            title: 'Сравнение систем по учету рабочего времени.xlsx',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 2,
            parent: null,
            'parent@': true,
            title: 'Техническое задание',
        },
        {
            id: 21,
            parent: 2,
            'parent@': null,
            title: 'PandaDoc.docx',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 22,
            parent: 2,
            'parent@': null,
            title: 'SignEasy.docx',
            image: GadgetsImages.macBookAir,
            isDocument: true,
        },
        {
            id: 3,
            parent: null,
            'parent@': true,
            title: 'Анализ конкурентов',
        },
        {
            id: 4,
            parent: null,
            'parent@': null,
            title: 'Договор на поставку печатной продукции',
            image: GadgetsImages.macBookAir,
            isDocument: true,
        },
        {
            id: 5,
            parent: null,
            'parent@': null,
            title: 'Договор аренды помещения',
            image: GadgetsImages.appleWathc,
            isDocument: true,
        },
        {
            id: 6,
            parent: null,
            'parent@': null,
            title: 'Конфеты',
            image: GadgetsImages.magicMouse2,
        },
        {
            id: 7,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.macBook,
            isDocument: true,
        },
        {
            id: 71,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.mac,
            isDocument: true,
        },
        {
            id: 72,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 73,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.magicMouse2,
            isDocument: true,
        },
        {
            id: 74,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 75,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.macBookAir,
            isDocument: true,
        },
        {
            id: 76,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 77,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.mac,
            isDocument: true,
        },
        {
            id: 78,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPad,
            isDocument: true,
        },
        {
            id: 79,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.macBook,
            isDocument: true,
        },
        {
            id: 80,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.magicMouse2,
            isDocument: true,
        },
        {
            id: 81,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 82,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.mac,
            isDocument: true,
        },
        {
            id: 83,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPad,
            isDocument: true,
        },
        {
            id: 84,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.macBook,
            isDocument: true,
        },
        {
            id: 85,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.iPhone,
            isDocument: true,
        },
        {
            id: 86,
            parent: null,
            'parent@': null,
            title: 'Скриншот от 25.12.16, 11-37-16',
            image: GadgetsImages.magicMouse2,
            isDocument: true,
        },
    ];
}

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const TileItemContent = useContent((contentTemplateProps: object) => {
        return <CustomTileItemContent {...contentTemplateProps} />;
    });

    const tileItemTemplate = useContent((templateProps: ITileItemProps) => {
        return templateProps.item.contents.get('parent@') ? (
            <TileNodeItemTemplate {...templateProps} folderWidth={250} itemWidth={250} />
        ) : (
            <TileItemTemplate
                {...templateProps}
                folderWidth={250}
                itemWidth={250}
                hasTitle={templateProps.item.contents.get('isDocument')}
                contentTemplate={TileItemContent}
            />
        );
    });

    return (
        <div ref={ref}>
            <ScrollContainer className="demo-Explorer__scrollContainer">
                <ExplorerView
                    storeId="ExplorerNewBase"
                    backgroundStyle="default"
                    className="demo-Explorer ControlsDemo-Explorer"
                    imageProperty="image"
                    itemActions={itemActions}
                    showActionButton={true}
                    tileScalingMode="none"
                    tileItemTemplate={tileItemTemplate}
                    columns={[]}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExplorerNewBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    root: null,
                    viewMode: 'tile',
                    source: new MemorySource({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    },
});
