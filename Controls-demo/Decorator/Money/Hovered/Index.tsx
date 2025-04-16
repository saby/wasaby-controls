import { Money } from 'Controls/baseDecorator';
import { useState, useCallback, forwardRef } from 'react';
import 'css!Controls/CommonClasses';

export default forwardRef(function Hovered(props, ref) {
    const [hoveredStateForDoubleColor, setHoveredStateForDoubleColor] = useState(false);
    const toggleHoveredStateForDoubleColor = useCallback(() => {
        setHoveredStateForDoubleColor((prevState) => !prevState);
    }, []);
    const [hoveredStateForTreeColor, setHoveredStateForTreeColor] = useState(false);
    const toggleHoveredStateForTreeColor = useCallback(() => {
        setHoveredStateForTreeColor((prevState) => !prevState);
    }, []);
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    Пример отображения кликабельного элемента, состоящего из двух цветов.
                </div>
                <div
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={toggleHoveredStateForDoubleColor}
                    onMouseLeave={toggleHoveredStateForDoubleColor}
                    className="ws-flexbox ws-align-items-baseline controlsDemo_fixedWidth350"
                >
                    <div
                        className={`icon-Money controls-icon_size-s controls-icon_style-${
                            hoveredStateForDoubleColor ? 'secondary' : 'unaccented'
                        }`}
                    ></div>
                    <span
                        style={{ marginLeft: 4 }}
                        className={`controls-text-${
                            hoveredStateForDoubleColor ? 'secondary' : 'unaccented'
                        }`}
                    >
                        12.07
                    </span>
                    (
                    <Money
                        value={350450}
                        fontColorStyle={hoveredStateForDoubleColor ? 'secondary' : 'unaccented'}
                    />
                    <span
                        className={`controls-text-${
                            hoveredStateForDoubleColor ? 'secondary' : 'unaccented'
                        }`}
                        style={{ marginLeft: 4 }}
                    >
                        до 12.08
                    </span>
                    )
                </div>
            </div>
            <div className="controlsDemo__cell">
                <div
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={toggleHoveredStateForTreeColor}
                    onMouseLeave={toggleHoveredStateForTreeColor}
                    className="ws-flexbox ws-align-items-baseline controlsDemo_fixedWidth350"
                >
                    <div
                        className={`icon-Money controls-icon_size-s controls-icon_style-${
                            hoveredStateForTreeColor ? 'danger' : 'secondary'
                        }`}
                    ></div>
                    <span
                        style={{ marginLeft: 4 }}
                        className={`controls-text-${
                            hoveredStateForTreeColor ? 'danger' : 'secondary'
                        }`}
                    >
                        12.07
                    </span>
                    (
                    <Money
                        value={350450}
                        fontColorStyle={hoveredStateForTreeColor ? 'danger' : 'unaccented'}
                    />
                    <span
                        className={`controls-text-${
                            hoveredStateForTreeColor ? 'danger' : 'unaccented'
                        }`}
                        style={{ marginLeft: 4 }}
                    >
                        до 12.08
                    </span>
                    )
                </div>
            </div>
        </div>
    );
});
