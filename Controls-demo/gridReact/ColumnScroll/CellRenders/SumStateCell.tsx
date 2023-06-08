import { useRenderData } from 'Controls/gridReact';
import { Money, Number } from 'Controls/baseDecorator';

interface IRenderValues {
    sum: number;
    icons: string[];
}

export default function SumStateCell(props: { cellNumber: number }) {
    const { renderValues } = useRenderData<IRenderValues>(['sum', 'icons']);
    return (
        <div
            className={'ws-flexbox ws-justify-content-between'}
            style={{ width: '100%' }}
        >
            <Number
                value={props.cellNumber}
                fontColorStyle={'secondary'}
                fontWeight={'bold'}
            />{' '}
            -
            <Money
                value={renderValues.sum}
                fontColorStyle={'secondary'}
                fontWeight={'bold'}
            />
        </div>
    );
}
