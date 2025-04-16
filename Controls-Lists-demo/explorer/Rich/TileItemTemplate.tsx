import {
    ITileItemProps,
    ItemTemplate as BaseTileItemTemplate,
    SmallItemTemplate as SmallTileItemTemplate,
} from 'Controls/tile';

export function ItemRender(props: ITileItemProps) {
    return props.item.contents.get('nodeType') !== null ? (
        <SmallTileItemTemplate
            {...props}
            className={'controls-background-unaccented js-demo-test-node'}
        />
    ) : (
        <BaseTileItemTemplate
            {...props}
            className={'controls-background-info  js-demo-test-leaf'}
            hasTitle={true}
        />
    );
}
