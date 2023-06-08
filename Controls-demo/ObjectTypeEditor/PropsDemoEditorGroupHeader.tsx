import { IGroupHeaderProps } from 'Controls-editors/object-type';

export function PropsDemoEditorGroupHeader({ title }: IGroupHeaderProps) {
    return (
        <div className="PropsDemoEditorGroupHeader">
            {title ? (
                <div className="PropsDemoEditorGroupHeader__title">{title}</div>
            ) : null}
        </div>
    );
}
