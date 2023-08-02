import type { Colgroup } from 'Controls/grid';

interface IProps {
    colgroup: Colgroup;
}

export default function ColgroupComponent(props: IProps) {
    const cells = props.colgroup.getCells();
    return (
        <colgroup className="controls-Grid__colgroup">
            {cells.map((cell) => {
                return (
                    <col
                        key={cell.getKey()}
                        className={cell.getBodyClasses()}
                        style={cell.getBodyStyles()}
                    />
                );
            })}
        </colgroup>
    );
}
