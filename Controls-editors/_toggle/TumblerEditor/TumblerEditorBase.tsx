import { Fragment, memo, useCallback } from 'react';
import { Meta } from 'Types/meta';
import { Control as TumblerControl } from 'Controls/Tumbler';
import { IPropertyGridEditorLayout } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { IBasePropertyEditorProps } from 'Controls-editors/properties';
import TumblerItemIConTemplate from './TumblerItemIconTemplate';

const CUSTOM_EVENTS = ['onSelectedKeyChanged'];

export type TumblerEditorItem = {
    id: string;
    title: string;
    icon?: string;
};

interface ITumblerEditorBaseProps
    extends IBasePropertyEditorProps<string, Meta<string> | Meta<number>> {
    options?: RecordSet<TumblerEditorItem>;
    titlePosition?: IPropertyGridEditorLayout['titlePosition'];
}

export const TumblerEditorBase = memo((props: ITumblerEditorBaseProps) => {
    const { value, onChange, options: items, LayoutComponent = Fragment, titlePosition } = props;

    const onValueChanged = useCallback(
        (val) => {
            onChange(val);
        },
        [value]
    );

    return (
        <LayoutComponent titlePosition={titlePosition}>
            <TumblerControl
                data-qa="controls-PropertyGrid__editor_tumbler"
                selectedKey={value}
                onSelectedKeyChanged={onValueChanged}
                customEvents={CUSTOM_EVENTS}
                items={items}
                itemTemplate={TumblerItemIConTemplate}
            />
        </LayoutComponent>
    );
});
