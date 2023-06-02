/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';

import { default as InvisibleTileItemDisplay } from '../../display/InvisibleTileItem';
import { getItemAttrs } from 'Controls/baseList';

type IInvisibleItemProps = ITileItemProps<InvisibleTileItemDisplay>;

export default function InvisibleTileItem(
    props: IInvisibleItemProps
): JSX.Element {
    const attrs = getItemAttrs(props.item, props);
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
