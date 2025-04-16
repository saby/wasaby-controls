import * as React from 'react';
import { View } from 'Controls/list';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { ListItem, IListItemProps } from 'Controls-Templates/itemTemplates';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

const itemActions: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-Email',
        title: 'Email',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'Профиль пользователя',
        showType: TItemActionShowType.TOOLBAR,
    },
];

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IListItemProps> = {
        cursor: 'pointer',
        paddingTop: 's',
        paddingBottom: 's',
        paddingLeft: 'l',
        paddingRight: 'l',
    };
    private readonly _viewSource: Memory;

    constructor(props: {}) {
        super(props);
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }

    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo__maxWidth200'}
            >
                <View
                    source={this._viewSource}
                    keyProperty={'key'}
                    markerVisibility={'visible'}
                    itemActions={itemActions}
                    itemTemplate={(props: IListItemProps) => {
                        return <ListItem {...props} {...this._commonItemsProps} />;
                    }}
                />
            </div>
        );
    }
}
