import { useItemData } from 'Controls/gridReact';

export default function ChangableWidthCell() {
    const { renderValues } = useItemData(['country']);
    return (
        <div className={'ws-flex-column ws-ellipsis'}>
            {renderValues.country && <div>{renderValues.country}</div>}
        </div>
    );
}
