import { default as Cell, ICellProps } from '../RenderReact/Cell';
import * as React from 'react';

export default function ItemEditorComponent(props: ICellProps) {
    return (
        <Cell {...props} contentTemplate={null}>
            <div className={'controls-GridView__itemEditor_contentWrapper'}>
                {props.children ? (
                    React.cloneElement(props.children, { ...props, style: null })
                ) : (
                    <props.contentTemplate {...props} style={null} />
                )}
            </div>
        </Cell>
    );
}
