import * as React from 'react';
import { Icon } from 'Controls/icon';
import { useItemData } from 'Controls/grid';
import { Model } from 'Types/entity';

interface ISeriesRemoveButtonTemplate {
    onClick: (name: string) => void;
    keyProperty: string;
}

function SeriesRemoveButtonTemplate(props: ISeriesRemoveButtonTemplate) {
    const { onClick, keyProperty = 'name' } = props;

    const { renderValues } = useItemData<Model>([keyProperty]);

    const onRemoveItem = React.useCallback(() => {
        onClick(renderValues[keyProperty]);
    }, [keyProperty, onClick, renderValues]);

    return (
        <Icon
            onClick={onRemoveItem}
            iconSize="s"
            iconStyle="unaccented"
            icon="icon-CloseNew"
            className="tw-cursor-pointer controls-margin_left-m"
        />
    );
}

export { SeriesRemoveButtonTemplate };
