import { memo, Fragment } from 'react';
import { Control as Tumbler } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface ISizeEditorOption {
    id: string;
    value: string;
    caption: string;
}

interface ISizeEditorProps extends IPropertyEditorProps<unknown> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: string;
    options?: string[] | ISizeEditorOption[];
}

/**
 * Реакт компонент, редактор размера
 * @class Controls-editors/_properties/SizeEditor
 * @public
 */
export const SizeEditor = memo((props: ISizeEditorProps) => {
    const { options, onChange, value = {}, LayoutComponent = Fragment } = props;
    const items = new RecordSet({
        keyProperty: 'id',
        rawData: options.map((option) => {
            if (typeof option === 'string') {
                return {
                    caption: option.toUpperCase(),
                    id: option,
                    value: option,
                };
            }
            return { ...option, caption: option.caption.toUpperCase() };
        }),
    });

    return (
        <LayoutComponent>
            <Tumbler
                data-qa="controls-PropertyGrid__editor_size"
                {...props}
                selectedKey={value || 'm'}
                inlineHeight="m"
                fontSize="m"
                items={items}
                keyProperty="id"
                onSelectedKeyChanged={(value) => {
                    const selectedKey = value;
                    onChange(selectedKey);
                }}
                customEvents={['onSelectedKeyChanged']}
            />
        </LayoutComponent>
    );
});
