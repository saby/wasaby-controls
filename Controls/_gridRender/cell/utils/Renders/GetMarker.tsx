import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

interface IGetMarkerClassName {
    markerClassName: ICellComponentProps['markerClassName'];
    markerPosition: ICellComponentProps['markerPosition'];
    topLeftBorderRadius: ICellComponentProps['topLeftBorderRadius'] | 'default';
    paddingTop: ICellComponentProps['paddingTop'];
    decorationStyle: ICellComponentProps['decorationStyle'];
    markerSize: ICellComponentProps['markerSize'];
}

/*
 * Метод для формирования строки классов маркера
 */
function getMarkerClassName({
    markerClassName,
    markerPosition = 'default',
    topLeftBorderRadius = 'default',
    paddingTop = 'null',
    decorationStyle = 'default',
    markerSize = 'content-xs',
}: IGetMarkerClassName) {
    let className = markerClassName + ' controls-GridReact__cell-marker';
    if (markerPosition === 'default') {
        className += ' controls-GridReact__cell-marker_default';
    } else if (markerPosition === 'outside') {
        className += ` controls-ListView__itemV_marker_outside_${markerSize}`;
    }
    // На маркер вешаем выравнивание по базовой линии, т.к. он расположен абсолютно и
    // не выравнивается от грида.
    className += ' controls-GridReact__cell-baseline_default';

    // Если маркер выровнен по картинке, нужно смещать его до уровня картинки.
    if (markerSize?.includes('image')) {
        className += ' controls-ListView__itemV_marker_with_image';
    }

    // По умолчанию располагаем маркер в абсолютных координатах относительно верхнего левого угла.
    // Если есть отступ сверху или скругление, маркер надо сместить чуть ниже.
    const hasRoundBorder = topLeftBorderRadius !== 'default';
    const hasTopSpacing = paddingTop !== 'null';
    if (hasTopSpacing || (hasRoundBorder && !hasTopSpacing)) {
        const topSpacing = hasTopSpacing ? paddingTop.toLowerCase() : topLeftBorderRadius;
        className += ` controls-ListView__itemV_marker-${decorationStyle}_topPadding-${topSpacing}`;
    }

    return className;
}

export default function getMarker(
    props: Pick<
        IDataCellComponentProps,
        | 'markerVisible'
        | 'markerSize'
        | 'markerClassName'
        | 'markerPosition'
        | 'paddingTop'
        | 'topLeftBorderRadius'
        | 'decorationStyle'
    >
) {
    const Marker = isLoaded('Controls/markerComponent')
        ? loadSync<typeof import('Controls/markerComponent').default>('Controls/markerComponent')
        : null;

    return (
        Marker && (
            <Marker
                markerSize={props.markerSize}
                className={getMarkerClassName({
                    markerClassName: props.markerClassName,
                    markerPosition: props.markerPosition,
                    paddingTop: props.paddingTop,
                    topLeftBorderRadius: props.topLeftBorderRadius,
                    decorationStyle: props.decorationStyle,
                    markerSize: props.markerSize,
                })}
            />
        )
    );
}
