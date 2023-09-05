import { Fragment, memo, useCallback, useMemo } from 'react';
import { IComponent, Meta } from 'Types/meta';
import { Control as TumblerControl } from 'Controls/Tumbler';
import { IEditorLayoutProps } from '../../_object-type/ObjectTypeEditor';
import { RecordSet } from 'Types/collection';
import { IBasePropertyEditorProps } from '../BasePropertyEditorProps';
import TumblerItemIConTemplate from './TumblerItemIconTemplate';

export type TumblerEditorItem = {
    id: string;
    title: string;
    icon?: string;
};

interface ITumblerEditorBaseProps
    extends IBasePropertyEditorProps<string, Meta<string> | Meta<number>> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<TumblerEditorItem>;
    titlePosition?: IEditorLayoutProps['titlePosition'];
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
                customEvents={['onSelectedKeyChanged']}
                items={items}
                itemTemplate={TumblerItemIConTemplate}
            />
        </LayoutComponent>
    );
});
