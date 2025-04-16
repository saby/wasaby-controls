import * as React from 'react';
import type { TileCollectionItem, InvisibleTileItem } from 'Controls/tile';
import { ITileViewProps } from 'Controls/_tileRender/interface/ITileView';
import { TileRenderWrapper } from 'Controls/_tileRender/item/RenderWrapper';
import { DefaultTileRender } from 'Controls/_tileRender/item/content/Default';
import { getSpacerProps } from 'Controls/_tileRender/utils/Spacer';
import { TileItemCompatibleLayer } from 'Controls/_tileRender/cL/CompatibleLayer';
import { Spacer } from 'Controls/_tileRender/item/Spacer';
import { getItemRenderProps } from 'Controls/_tileRender/utils/ItemRender';
import { getItemEventHandlerCallbacks } from 'Controls/_tileRender/item/utils/Props/EventHandlers';
import { Model } from 'Types/entity';
import { getItemActionHandlers } from 'Controls/_tileRender/item/utils/Props/Actions';
import { IItemRenderProps } from 'Controls/_tileRender/interface/IRenderAspects';

interface IGetItemRenderProps extends Pick<ITileViewProps, 'itemTemplate' | 'itemRender'> {
    collectionItem: TileCollectionItem;
}

/**
 * Утилита, вычисляющая рендер элемента плитки
 * @param props
 */
function getItemRender(props: IGetItemRenderProps) {
    const { collectionItem, itemTemplate, itemRender } = props;

    // todo Проверить, нужна ли поддержка itemTemplateProperty?
    // const itemTemplate = item.getTemplate(
    //     this.props.collection.getItemTemplateProperty(),
    //     this.props.itemTemplate,
    //     this.props.groupTemplate
    // );

    if (itemRender) {
        return itemRender;
    } else if (itemTemplate) {
        return (
            <TileItemCompatibleLayer collectionItem={collectionItem} itemTemplate={itemTemplate} />
        );
    }

    return <DefaultTileRender />;
}

/**
 * Задача компонента - пройтись по всем элементам коллекции и построить шаблон для каждого из них.
 * На уровне "For" определяется по какой схеме произойдет отрисовка:
 * ┌──────────────────────────────┬──────────────────────────────┬────────────────────────────────────┐
 * │ default                      │ itemRender                   │ itemTemplate                       │
 * ├──────────────────────────────┼──────────────────────────────┼────────────────────────────────────┤
 * │ Стандартный рендер, без      │ Рендер, использующий для     │ Рендер, использующий для доступа к │
 * │ установки внешнего шаблона.  │ доступа к данным react-хуки. │ данным элемент коллекции.          │
 * └──────────────────────────────┴──────────────────────────────┴────────────────────────────────────┘
 * Во всех схемах вызов шаблона элемента осуществляется через дополнительную обёртку "./item/RenderWrapper", которая:
 * • обеспечивает мемоизацию шаблонов элемента за счёт параметров этих шаблонов (через React.memo);
 * • при необходимости зуммирования - вычисляет дополнительные стили и классы шаблона.
 * ┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────────┐
 * │ For                   │    │ For                   │    │ For                       │
 * │ ┌───────────────────┐ │    │ ┌───────────────────┐ │    │ ┌───────────────────────┐ │
 * │ │ RenderWrapper     │ │    │ │ RenderWrapper     │ │    │ │ RenderWrapper         │ │
 * │ │ ┌───────────────┐ │ │    │ │ ┌───────────────┐ │ │    │ │ ┌───────────────────┐ │ │
 * │ │ │ DefaultRender │ │ │    │ │ │ itemRender    │ │ │    │ │ │ CompatibleLayer   │ │ │
 * │ │ └───────────────┘ │ │    │ │ └───────────────┘ │ │    │ │ │ ┌───────────────┐ │ │ │
 * │ └───────────────────┘ │    │ └───────────────────┘ │    │ │ │ │ itemTemplate  │ │ │ │
 * └───────────────────────┘    └───────────────────────┘    │ │ │ └───────────────┘ │ │ │
 *                                                           │ │ └───────────────────┘ │ │
 *                                                           │ └───────────────────────┘ │
 *                                                           └───────────────────────────┘
 * Подготовка параметров шаблона осуществляется всегда на уровне "For".
 * В случае передачи шаблона через "itemTemplate", на уровне "CompatibleLayer" вычисляются дополнительные параметры
 * шаблона, такие как CollectionItem, ItemActionsComponent, MultiSelectComponent и др., используемые в старом подходе.
 * @param props
 * @constructor
 */
export function TileRenderFor(props: ITileViewProps) {
    const itemsRenders: React.ReactElement[] = [];

    const { collection, itemTemplate, itemRender } = props;
    const itemsIterator = collection.getViewIterator();

    itemsIterator.each((collectionItem) => {
        const isSpacer = (collectionItem as InvisibleTileItem)[
            '[Controls/_tile/display/mixins/InvisibleItem]'
        ];

        if (isSpacer) {
            itemsRenders.push(
                <Spacer
                    {...getSpacerProps(collectionItem as InvisibleTileItem)}
                    key={collectionItem.key}
                />
            );
            return;
        }

        const resolvedItemRenderTemplate = getItemRender({
            itemTemplate,
            itemRender,
            collectionItem: collectionItem as TileCollectionItem,
        });

        const itemRenderProps: IItemRenderProps = getItemRenderProps({
            collectionItem: collectionItem as TileCollectionItem,
            collection,
        });

        const itemHandlers = getItemEventHandlerCallbacks({
            itemModel: collectionItem.item as Model,
            props,
        });

        const itemActionHandlers = getItemActionHandlers(props);

        itemsRenders.push(
            <TileRenderWrapper
                isReactTile={true}
                {...itemRenderProps}
                {...itemHandlers}
                {...itemActionHandlers}
                render={resolvedItemRenderTemplate}
                key={collectionItem.key}
            />
        );
    });

    return itemsRenders;
}
