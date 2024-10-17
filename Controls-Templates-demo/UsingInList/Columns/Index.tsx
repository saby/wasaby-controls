import * as React from 'react';
import { IItemAction, IVerticalItemProps, VerticalItem } from 'Controls-Templates/itemTemplates';
import { ItemsView } from 'Controls/columns';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';
import { delimitProps } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { TItemActionShowType } from 'Controls/itemActions';

const ACTIONS: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-DownloadNew',
        title: 'Открыть на весь экран',
        iconSize: 's',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 2,
        icon: 'icon-Signature',
        title: 'Открыть в новой вкладке',
        iconSize: 's',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 4,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'remove',
        iconSize: 's',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 3,
        icon: 'icon-Link',
        title: 'link',
        iconSize: 's',
        showType: TItemActionShowType.MENU,
    },
];

interface IItemTemplateProps extends TInternalProps {
    itemActionsTemplate: React.FunctionComponent;
}

function getHeader(props: IItemTemplateProps): React.ReactElement {
    return (
        <props.itemActionsTemplate
            {...props}
            viewMode={'filled'}
            menuActionVisibility={'hidden'}
            itemActionsClass={'Controls-Templates-demo__ItemActions_position_custom'}
        />
    );
}

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IVerticalItemProps> = {
        actionsVisibility: 'onhover',
        roundAngleBL: 's',
        roundAngleBR: 's',
        roundAngleTL: 's',
        roundAngleTR: 's',
        cursor: 'pointer',
        captionFontSize: 'xl',
        captionFontWeight: 'bold',
        descriptionFontSize: 'm',
        descriptionFontColorStyle: 'unaccented',
        shadowVisibility: 'visible',
        paddingTop: 's',
        paddingBottom: 's',
        paddingLeft: 's',
        paddingRight: 's',
        captionLines: 1,
        descriptionLines: 3,
        imageViewMode: 'circle',
        imagePosition: 'top',
        imageEffect: 'border',
    };
    private readonly _items: RecordSet;

    constructor(props: {}) {
        super(props);
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: Gadgets.getRichItems(),
        });
    }

    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo_fixedWidth400'}
            >
                <ItemsView
                    items={this._items}
                    columnsCount={3}
                    itemActions={ACTIONS}
                    itemActionsPosition={'custom'}
                    itemTemplate={(props) => {
                        const { userAttrs, clearProps } = delimitProps(props);
                        return (
                            <VerticalItem
                                {...clearProps}
                                {...this._commonItemsProps}
                                style={userAttrs.style}
                                imageSrc={props.item.contents.get('image')}
                                header={getHeader(clearProps)}
                                headerPosition={'absolute'}
                                caption={props.item.contents.get('title')}
                                description={props.item.contents.get('description')}
                            />
                        );
                    }}
                />
            </div>
        );
    }
}
