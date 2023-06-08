import * as React from 'react';
import { IIndicatorTemplateProps } from 'Controls/baseList';
import { default as GridIndicatorComponent } from 'Controls/_grid/Render/grid/IndicatorComponent';
import Indicator from 'Controls/_grid/display/Indicator';

export default function IndicatorComponent(
    props: IIndicatorTemplateProps<Indicator>
): React.ReactElement {
    return (
        <tr>
            <td colSpan={props.item.getColspan()}>
                <GridIndicatorComponent {...props} />
            </td>
        </tr>
    );
}
