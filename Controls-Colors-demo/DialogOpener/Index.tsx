import * as React from 'react';
import {itemsWithCustom, palette} from '../data';
import {DialogOpener} from 'Controls-Colors/dialogOpener';
import 'css!Controls-Colors-demo/Style';

const helper = new DialogOpener({});

export default React.forwardRef(
    (props, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
        const [selectedKeys, setSelectedKeys] = React.useState(['3']);
        const itemsContainer: React.MutableRefObject<HTMLDivElement> = React.useRef();
        const getColor = React.useCallback((item) => {
            const value = item.value.color;
            return value.indexOf('--') !== -1 ? 'var(' + value + ')' : value;
        }, []);
        const itemsClickHandler = React.useCallback(() => {
            helper.open({
                opener: itemsContainer.current,
                templateOptions: {
                    items: itemsWithCustom,
                    palette,
                    selectedKeys
                },
                width: props.theme === 'default' ? 252 : 405,
                eventHandlers: {
                    onResult(res: string[]) {
                        setSelectedKeys(res);
                    }
                }
            });
        },[selectedKeys]);

        React.useEffect(() => {
            return () => helper.destroy();
        }, []);

        return (
            <div className="tw-flex tw-justify-center"
                 ref={ref}
            >
                <div className="tw-flex tw-justify-baseline controls-cursor_pointer"
                     ref={itemsContainer}
                     onClick={itemsClickHandler}
                >
                    {
                        selectedKeys.length > 0 ? itemsWithCustom.map((item) => {
                            if (selectedKeys.includes(item.id)) {
                                return (
                                    <div className="controls-margin_right-s tw-self-center"
                                         key={item.id}
                                    >
                                        {
                                            item.type === 'color' ? (
                                                    <div className="Controls-Colors-demo_roundItem"
                                                         style={{backgroundColor: getColor(item)}}
                                                    >
                                                    </div>
                                                ) :
                                                (
                                                    item.icon ? (
                                                        <div className={'Controls-Colors-demo_iconItem icon-' + item.icon +
                                                            ' controls-icon_style-' + item.iconStyle + ' controls-icon_size-' +
                                                            item.iconSize
                                                        }>
                                                        </div>
                                                    ) : (
                                                        <div style={{
                                                            color: getColor(item),
                                                            fontWeight: item.value.style.b ? 'bold' : 'normal',
                                                            fontStyle: item.value.style.i ? 'italic' : 'normal',
                                                            textDecoration: item.value.style.s ? 'line-through' : 'none',
                                                            borderBottom: item.value.style.u ? ('1px solid ' + getColor(item)) : ''
                                                        }}>
                                                            {item.caption}
                                                        </div>
                                                    )
                                                )
                                        }
                                    </div>
                                );
                            }
                        }) :
                        <div className='controls-text-label'>Выбрать пометку</div>
                    }
                </div>
            </div>
        );
    });
