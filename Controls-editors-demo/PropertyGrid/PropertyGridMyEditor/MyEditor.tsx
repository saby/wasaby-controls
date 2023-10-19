import { memo } from 'react';
import { IPropertyEditorProps } from 'Types/meta';

interface IMyEditorProps extends IPropertyEditorProps<string> {
    placeholder?: string;
}

export const MyEditor = memo((props: IMyEditorProps) => {
    const { value, onChange, LayoutComponent, placeholder } = props;

    return (
        <LayoutComponent>
            <input
                placeholder={placeholder}
                type="text"
                onChange={(e) => onChange(e.target.value)}
                value={value}
            />
        </LayoutComponent>
    );
});
