import { memo } from 'react';
import { Label } from 'Controls/input';
import { IEditorLayoutProps } from 'Controls-editors/object-type';

export const PropsDemoEditorLayout = memo(
    ({ title, description, children }: IEditorLayoutProps) => {
        return (
            <div className="PropsDemoEditorWrapper" title={description}>
                {title ? (
                    <div className="PropsDemoEditorWrapper__title">
                        <Label caption={title} />
                    </div>
                ) : null}
                <div className="PropsDemoEditorWrapper__editor">{children}</div>
            </div>
        );
    }
);
