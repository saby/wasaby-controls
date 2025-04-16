import { ReactElement } from 'react';
import { ColumnTemplate, IColumnTemplateProps } from 'Controls/grid';

function ContentTemplate(props: IColumnTemplateProps): ReactElement {
    return <props.multiSelectTemplate />;
}

export default function MultiSelectColumn(props: IColumnTemplateProps): JSX.Element {
    return (
        <ColumnTemplate
            {...props}
            contentTemplate={ContentTemplate}
            className={'ws-flexbox ws-align-items-center'}
        />
    );
}
