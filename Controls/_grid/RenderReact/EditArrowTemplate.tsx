/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import DataCell from 'Controls/_grid/display/DataCell';
import { TItemEventHandler } from 'Controls/_baseList/ItemComponent';
import DataRow from 'Controls/_grid/display/DataRow';
import { TInternalProps } from 'UICore/Executor';

interface IProps extends TInternalProps {
    item: DataRow;
    column: DataCell;
    hoverBackgroundStyle: string;
    editArrowBackgroundStyle: string;
    highlightOnHover: boolean;
    editable: boolean;
    textOverflow: boolean;
    onEditArrowClick: TItemEventHandler;
}

export default function EditArrowTemplate(props: IProps): JSX.Element {
    const backgroundStyle = props.column.getEditArrowBackgroundStyle(
        props.editArrowBackgroundStyle,
        props.highlightOnHover,
        props.hoverBackgroundStyle,
        props.editable
    );
    let rootClasses =
        'controls-Grid__editArrow-wrapper js-controls-ListView__visible-on-hoverFreeze';
    rootClasses += ' js-controls-Grid__editArrow';
    if (props.attrs && props.attrs.className) {
        rootClasses += ` ${props.attrs.className}`;
    }

    const iconClasses = 'controls-Grid__editArrow-icon';
    const iconTransform =
        props.item.getDirectionality() === 'rtl' ? 'rotate(180, 8, 10)' : '';
    return (
        <div className={rootClasses}>
            {props.textOverflow && (
                <div className={'controls-Grid__editArrow-withTextOverflow'} />
            )}
            <div
                className={`controls-Grid__editArrow-blur controls-Grid__editArrow-blur_${backgroundStyle}`}
            />
            <div
                onClick={(event) => {
                    return props.onEditArrowClick(event, props.item);
                }}
                className={`controls-Grid__editArrow controls-Grid__editArrow_background_${backgroundStyle}`}
                data-qa={'edit-arrow'}
            >
                <svg
                    className={iconClasses}
                    viewBox={'0 0 16 16'}
                    xmlns={'http://www.w3.org/2000/svg'}
                >
                    <path
                        transform={iconTransform}
                        d={'M9,9.94l-6,6v-2l4-4-4-4v-2Zm5,0-6,6v-2l4-4-4-4v-2Z'}
                    />
                </svg>
            </div>
        </div>
    );
}
