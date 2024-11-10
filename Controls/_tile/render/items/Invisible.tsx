/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';

import { default as InvisibleTileItemDisplay } from '../../display/InvisibleTileItem';

type IInvisibleItemProps = ITileItemProps<InvisibleTileItemDisplay>;

export default function InvisibleTileItem(props: IInvisibleItemProps): JSX.Element {
    const attrs = props.item.getItemAttrs(props);
    if (props.item.isLastInvisibleItem()) {
        const className =
            'controls-TileView__item_invisible controls-ListView__itemV ' +
            'controls-TreeTileView__separator js-controls-List_invisible-for-VirtualScroll';
        return (
            <div
                {...attrs}
                ref={props.$wasabyRef}
                className={className}
                key={`separator-${props.item.key}`}
            />
        );
    }

    return (
        <div
            {...attrs}
            ref={props.$wasabyRef}
            className={props.item.getInvisibleClasses()}
            style={props.item.getItemStyles(props)}
            data-qa={'controls-TileView__item_not_invisible'}
        />
    );
}
