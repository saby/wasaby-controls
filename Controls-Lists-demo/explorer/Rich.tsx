import * as React from 'react';
import { useContent } from 'UICore/Jsx';
import { HierarchicalMemory as Memory } from 'Types/source';

import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls-DataEnv/list';

import { IToolbarOptions, View as Toolbar } from 'Controls/toolbars';
import { Component, IExplorerComponentAPI } from 'Controls-Lists/explorer';
import { HeadingPath } from 'Controls-ListEnv/breadcrumbs';
import { View as Panel } from 'Controls-ListEnv/operationsPanelConnected';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import IMAGES from 'Controls-demo/Explorer/ExplorerImagesLayoutNew';
import type { ITileItemProps } from 'Controls/tile';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { Container as ScrollContainer } from 'Controls/scroll';

// custom actions
import 'Controls-Lists-demo/explorer/ItemActions/DummyAction';
import { TItemActionShowType } from 'Controls/interface';

import 'css!Controls-Lists-demo/treeGrid/ActualDevelopmentState';

const STORE_ID = 'grid_simple';
const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';
const IMAGE_PROPERTY = 'image';
const DATA_COUNT = 1000;

const virtualScrollConfig = {
    pageSize: 50,
};
const Simple = React.memo(
    React.forwardRef(function Simple(
        _props: {},
        ref: React.ForwardedRef<HTMLDivElement>
    ): JSX.Element {
        const explorerRef = React.useRef<IExplorerComponentAPI>();

        const DemoToolbar = useContent((props: IToolbarOptions) => {
            return <Toolbar {...props} direction="vertical" />;
        });

        const DemoTileItemTemplate = useContent((props: ITileItemProps) => {
            const Render = loadSync<
                typeof import('Controls-Lists-demo/explorer/Rich/TileItemTemplate')
            >('Controls-Lists-demo/explorer/Rich/TileItemTemplate').ItemRender;
            return <Render {...props} />;
        });

        return (
            <div ref={ref} className="controls-padding-m">
                <div className="controls-padding-m">
                    <button
                        onClick={() => {
                            explorerRef.current?.scrollToItem(105, 'top');
                        }}
                    >
                        Проскролить к 105
                    </button>
                </div>
                <div
                    className="ws-flexbox controls_border-radius-m controls-padding-m controls-background-unaccented"
                    style={{ width: '800px' }}
                >
                    <div className="ws-flexbox ws-flex-column controls-padding-xs tw-w-full">
                        <div className="controls-padding_bottom-xs">
                            <HeadingPath storeId={STORE_ID} />
                        </div>
                        <div className="controls-background-default">
                            <Panel storeId={STORE_ID} />

                            <ScrollContainer className="ControlsListsDemo-maxHeight-500">
                                {/* Див нужен чтобы не прилетали опции от васаби скролла в Component*/}
                                <div>
                                    <Component
                                        storeId={STORE_ID}
                                        tileItemRender={DemoTileItemTemplate}
                                        virtualScrollConfig={virtualScrollConfig}
                                        itemsDragNDrop={true}
                                        ref={explorerRef}
                                    />
                                </div>
                            </ScrollContainer>
                        </div>
                    </div>
                    <ToolbarContainer
                        storeId={STORE_ID}
                        actions={TOOLBAR_ITEMS}
                        content={DemoToolbar}
                    />
                </div>
            </div>
        );
    })
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Simple.getLoadConfig = (): Record<string, IDataConfig<IListDataFactoryArguments>> => ({
    [STORE_ID]: {
        dataFactoryName: 'Controls-Lists-demo/explorer/Rich/factory',
        dataFactoryArguments: {
            isLatestInteractorVersion: true,
            collectionType: 'TreeGrid',
            displayProperty: 'first_name',
            source: SOURCE,
            columns: COLUMNS,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
            viewMode: 'table',
            multiSelectVisibility: 'onhover',
            listActions: [
                {
                    actionName: 'Controls/actions:Remove',
                },
            ],
            itemActions: [
                {
                    id: 'call',
                    icon: 'icon-Call',
                    title: 'call',
                    parent: null,
                    storeId: STORE_ID,
                    actionName: 'Controls-Lists-demo/explorer/ItemActions/DummyAction',
                },
                {
                    id: 'message',
                    icon: 'icon-EmptyMessage',
                    title: 'message',
                    showType: TItemActionShowType.MENU_TOOLBAR,
                    onExecuteHandler: 'Controls-Lists-demo/explorer/Handlers/Message',
                },
                {
                    id: 'delete',
                    icon: 'icon-Erase',
                    title: 'delete pls',
                    iconStyle: 'danger',
                    showType: TItemActionShowType.MENU_TOOLBAR,
                    parent: null,
                    actionName: 'Controls/actions:Remove',
                },
            ],
            // Плитка
            tileScalingMode: 'none',
            tileMode: 'dynamic',
            tileWidth: 200,
            folderWidth: 250,
            imageProperty: IMAGE_PROPERTY,
        },
    },
});

const TOOLBAR_ITEMS = [
    {
        actionName: 'Controls/actions:ViewMode',
        // TODO: IViewModeActionOptions
        listId: STORE_ID,
        items: [
            {
                id: 'table',
                title: 'Таблица',
                icon: 'icon-Table',
            },

            {
                id: 'tile',
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
            },
        ],
    },
];

const getImage = (index: number) => {
    return {
        [IMAGE_PROPERTY]: IMAGES[IMAGES.length % index],
    };
};

const SOURCE = new Memory({
    keyProperty: KEY_PROPERTY,
    parentProperty: 'parent',
    data: [
        {
            [KEY_PROPERTY]: '1',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: true,
            first_name: 'Nealson',
            last_name: 'Maleham',
            email: 'nmaleham0@dell.com',
            ...getImage(0),
        },
        {
            [KEY_PROPERTY]: '1-1',
            [PARENT_PROPERTY]: '1',
            [NODE_PROPERTY]: false,
            first_name: 'Lucky',
            last_name: 'Echallie',
            email: 'lechallie1@meetup.com',
            ...getImage(1),
        },
        {
            [KEY_PROPERTY]: '1-1-1',
            [PARENT_PROPERTY]: '1-1',
            [NODE_PROPERTY]: null,
            first_name: 'Wheeler',
            last_name: 'Bengochea',
            email: 'wbengochea2@cbc.ca',
            ...getImage(2),
        },
        {
            [KEY_PROPERTY]: '1-1-2',
            [PARENT_PROPERTY]: '1-1',
            [NODE_PROPERTY]: null,
            first_name: 'Jeana',
            last_name: 'Cheltnam',
            email: 'jcheltnam3@mediafire.com',

            ...getImage(3),
        },
        {
            [KEY_PROPERTY]: '1-2',
            [PARENT_PROPERTY]: '1',
            [NODE_PROPERTY]: null,
            first_name: 'Jock',
            last_name: 'Dowell',
            email: 'jdowell4@sitemeter.com',
            ...getImage(4),
        },
        {
            [KEY_PROPERTY]: '2',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: true,
            first_name: 'Cash',
            last_name: 'Cardenoza',
            email: 'ccardenoza5@trellian.com',
            ...getImage(5),
        },
        ...[...Array(DATA_COUNT)].map((_, index) => ({
            [KEY_PROPERTY]: `2-${index}`,
            [PARENT_PROPERTY]: '2',
            [NODE_PROPERTY]: null,
            first_name: 'Generated in Folder',
            last_name: '#' + index,
            email: `ccardenoza${index}@trellian.com`,
        })),
        {
            [KEY_PROPERTY]: '3',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: false,
            first_name: 'Kirbie',
            last_name: 'Sherred',
            email: 'ksherred6@yahoo.co.jp',
            ...getImage(6),
        },
        {
            [KEY_PROPERTY]: '4',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Isiahi',
            last_name: 'Portis',
            email: 'iportis7@auda.org.au',
            ...getImage(7),
        },
        {
            [KEY_PROPERTY]: '5',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Locke',
            last_name: 'Kanzler',
            email: 'lkanzler8@fc2.com',
            ...getImage(8),
        },
        {
            [KEY_PROPERTY]: '6',
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Blondy',
            last_name: 'Artis',
            email: 'bartis9@smh.com.au',
            ...getImage(9),
        },
        ...[...Array(DATA_COUNT)].map((_, index) => ({
            [KEY_PROPERTY]: `${7 + index}`,
            [PARENT_PROPERTY]: null,
            [NODE_PROPERTY]: null,
            first_name: 'Generated',
            last_name: '#' + index,
            email: `bartis${index}@smh.com.au`,
        })),
    ],
});

const COLUMNS = [
    {
        key: 'first_name',
        displayProperty: 'first_name',
    },
    {
        key: 'last_name',
        displayProperty: 'last_name',
    },
    {
        key: 'email',
        displayProperty: 'email',
    },
];

export default Simple;
