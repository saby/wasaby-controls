import { ITileActionProps } from 'Controls/_tileRender/item/utils/Props/Actions';

export function Actions(props: ITileActionProps) {
    if (props.actionsVisibility === 'hidden') {
        return null;
    }

    return <div>actions</div>;
}
