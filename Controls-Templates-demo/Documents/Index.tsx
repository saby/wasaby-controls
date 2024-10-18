import * as React from 'react';
import { VerticalItem } from 'Controls-Templates/itemTemplates';
import { ItemsView } from 'Controls/treeTile';
import { PreviewTemplate } from 'Controls/tile';
import { RecordSet } from 'Types/collection';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';
import { TItemActionShowType } from 'Controls/itemActions';

const COMMON_PROPS = {
    cursor: 'pointer',
    captionVAlign: 'bottom',
    captionHAlign: 'left',
    captionFontWeight: 'bold',
    captionFontSize: '4xl',
    descriptionVAlign: 'bottom',
    descriptionHAlign: 'left',
    descriptionFontSize: 'm',
    shadowVisibility: 'visible',
};

const ACTIONS = [
    {
        id: 1,
        icon: 'icon-DownloadNew',
        title: 'Открыть на весь экран',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 2,
        icon: 'icon-Signature',
        title: 'Открыть в новой вкладке',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 3,
        icon: 'icon-Link',
        title: 'link',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 4,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'remove',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 5,
        icon: 'icon-Edit',
        title: 'edit',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 6,
        icon: 'icon-Copy',
        title: 'copy',
        showType: TItemActionShowType.MENU,
    },
];

export default class Index extends React.Component {
    protected _items: RecordSet;
    protected _roundBorder: object = { tl: 'm', tr: 'm', br: 'm', bl: 'm' };
    constructor(props: {}) {
        super(props);
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: '1', type: true, title: 'Папка с фото', image: Images.RIVER },
                { key: '2', type: true, title: 'Папка без фото', image: null },
                {
                    key: '3',
                    type: null,
                    title: 'файл с белым градиентом',
                    image: Images.RIVER,
                    isDoc: true,
                },
                {
                    key: '4',
                    type: null,
                    title: 'файл с темным градиентом',
                    image: Images.RIVER,
                    isDoc: false,
                },
            ],
        });
    }
    render(): JSX.Element {
        return (
            <div
                className={
                    'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_fixedWidth800'
                }
            >
                <ItemsView
                    items={this._items}
                    itemActions={ACTIONS}
                    imageProperty={'image'}
                    displayProperty={'title'}
                    actionMode="adaptive"
                    keyProperty={'key'}
                    tileHeight={300}
                    roundBorder={this._roundBorder}
                    nodeProperty={'type'}
                    itemTemplate={(props) => {
                        if (props.item.contents.get('type')) {
                            return (
                                <VerticalItem
                                    {...props}
                                    {...COMMON_PROPS}
                                    imageViewMode={'rectangle'}
                                    actionsPosition={'topRight'}
                                    imageProportion={'1:1'}
                                    caption={
                                        <span style={{ textDecoration: 'underline' }}>
                                            {props.caption}
                                        </span>
                                    }
                                    description={
                                        'Для заголовка и описания можно передавать прикладную верстку'
                                    }
                                    imageEffect={props.imageSrc ? 'custom' : 'none'}
                                    dominantColor={props.imageSrc ? '#23b14d' : 'null'}
                                    brightness={props.imageSrc ? 'dark' : 'light'}
                                    gradientDirection={props.imageSrc ? null : 'toBottomRight'}
                                    gradientStartColor={props.imageSrc ? null : '#f1e8fd22'}
                                    gradientStopColor={props.imageSrc ? null : '#f1e8fd'}
                                />
                            );
                        } else {
                            return (
                                <PreviewTemplate
                                    {...props}
                                    {...COMMON_PROPS}
                                    gradientType={
                                        props.item.contents.get('isDoc') ? 'light' : 'dark'
                                    }
                                    titleStyle={props.item.contents.get('isDoc') ? 'dark' : 'light'}
                                />
                            );
                        }
                    }}
                />
            </div>
        );
    }
}
