import { useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import * as React from 'react';
import { Text as TextInput } from 'Controls/input';

export function EditRender(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (_, value) => {
            return item.set(property, value);
        },
        [item]
    );

    return (
        <TextInput
            value={String(renderValues[property])}
            className={'tw-w-full'}
            contrastBackground
            onValueChanged={onValueChanged}
        />
    );
}
