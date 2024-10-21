import * as React from 'react';
import { IVerticalItemProps, VerticalItem, IItemAction } from 'Controls-Templates/itemTemplates';
import { View } from 'Controls/tile';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { delimitProps } from 'UICore/Jsx';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';
import { TItemActionShowType } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';

function getData() {
    return Gadgets.getRichItems();
}

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

const commonItemsProps: Partial<IVerticalItemProps> = {
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

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1100'}>
            <View
                storeId={'UsingInListTileItemFour'}
                imageProperty={'image'}
                tileSize={'s'}
                itemActions={ACTIONS}
                itemActionsPosition={'custom'}
                itemTemplate={(props) => {
                    const { userAttrs, clearProps } = delimitProps(props);
                    return (
                        <VerticalItem
                            {...clearProps}
                            {...commonItemsProps}
                            style={userAttrs.style}
                            headerPosition={'absolute'}
                            header={getHeader(clearProps)}
                            className={userAttrs.className}
                            caption={props.item.contents.get('title')}
                            description={props.item.contents.get('description')}
                        />
                    );
                }}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            UsingInListTileItemFour: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    },
});
