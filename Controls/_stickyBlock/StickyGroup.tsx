/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import * as Ctx from 'Controls/_stickyBlock/StickyContextReact';
import { delimitProps } from 'UICore/Jsx';
import { StickyIntersectionController } from 'Controls/_stickyBlock/Controllers/StickyIntersectionController';
import BlocksCollection from 'Controls/_stickyBlock/BlocksCollection';
import { getNextId } from 'Controls/_stickyBlock/Utils/Utils';
import StickySizeController from 'Controls/_stickyBlock/Controllers/StickySizeController';
import {
    FixedPosition,
    IFixedPositionUpdatedBlock,
    IStickyBlockData,
    IStickyBlockRegisterData,
    IStickyContextModels,
    IStickyOffset,
    Mode,
    ScrollPosition,
    StackOperation,
    StickyPosition,
    StickyShadowVisibility,
} from 'Controls/_stickyBlock/types';
import { getOffsetByContainer, resetSticky, restoreSticky, } from 'Controls/_stickyBlock/Controllers/helpers/functions';
import { getDecomposedPositionFromString } from 'Controls/_stickyBlock/Utils/getDecomposedPosition';
import { IStickyGroupedBlock } from 'Controls/_stickyBlock/interfaces/IStickyBlock';
import { object } from 'Types/util';
import { usePreviousProps } from './Hooks/UsePreviusProps';
import { EMPTY_STICKY_MODEL } from './constants';
import ScrollState from 'Controls/_scroll/Utils/ScrollState';

const getVerticalOffsets = (
    block: IStickyBlockData,
    stickyPosition: string,
    groupOffset: IStickyOffset,
    container: HTMLElement
) => {
    const offsets = {
        top: undefined,
        bottom: undefined,
    };
    for (const position of [StickyPosition.Top, StickyPosition.Bottom]) {
        if (stickyPosition.toLowerCase().indexOf(position) !== -1) {
            const offset = getOffsetByContainer(block.stickyRef.current, position, container);
            offsets[position] = offset + groupOffset[position];
        }
    }
    return offsets;
};

const getHorizontalOffsets = (
    blocks: BlocksCollection,
    block: IStickyBlockData,
    stickyPosition: string
) => {
    const offsets = {
        left: undefined,
        right: undefined,
    };
    for (const position of [StickyPosition.Left, StickyPosition.Right]) {
        if (stickyPosition.toLowerCase().indexOf(position) !== -1) {
            const blockStack = blocks.getStack()[position];
            if (!blockStack.length) {
                return;
            }
            const indexBlock = blockStack.indexOf(block.id);
            const prevBlockId = indexBlock > 0 ? indexBlock - 1 : 0;
            const prevBlock = blocks.get(blockStack[prevBlockId]);
            let offset = indexBlock > 0 ? prevBlock.offset.left : 0;

            if (prevBlock.props.mode !== Mode.Replaceable && indexBlock > 0) {
                offset += prevBlock.stickyRef.current.getBoundingClientRect().width;
            }

            offsets[position] = offset;
        }
    }
    return offsets;
};

function StickyGroup(
    { offsetTop = 0, shadowVisibility = StickyShadowVisibility.Visible, ...props },
    ref
) {
    const { clearProps, $wasabyRef, userAttrs } = delimitProps(props);

    const [groupId, setGroupId] = React.useState('');
    const [_, setGroupVersion] = React.useState(0);
    const [registeredInController] = React.useState(!!props.position);
    const [dataContext] = React.useState<IStickyContextModels>({});
    const [scrollContainer, setScrollContainer] = React.useState<HTMLElement>(undefined);
    const [blocks] = React.useState(() => {
        return new BlocksCollection();
    });
    const version = React.useRef(0);
    const height = React.useRef(0);

    const getScrollContainer = (container) => {
        if (!scrollContainer) {
            const scrollContainerNode = container.closest('.controls-Scroll');
            setScrollContainer(scrollContainerNode as HTMLElement);
            return scrollContainerNode;
        }
        return scrollContainer;
    };

    const getProps = () => {
        const firstStickyProps = blocks.get(Object.keys(blocks.getBlocks())[0]).props;
        return {
            mode: props.mode || firstStickyProps.mode,
            position: props.position || firstStickyProps.position,
            shadowVisibility: shadowVisibility || firstStickyProps.shadowVisibility,
            offsetTop,
            fixedPositionInitial: props.fixedPositionInitial,
        };
    };

    const getGroupId = () => {
        if (groupId) {
            return groupId;
        } else if (Object.keys(blocks.getBlocks()).length !== 0) {
            return blocks.get(Object.keys(blocks.getBlocks()).shift()).groupData.id;
        }
    };

    React.useEffect(() => {
        return () => {
            sizeController.destroy();
            intersectionObserver.destroy();
        };
    }, []);

    const register = (block: IStickyBlockRegisterData) => {
        let idTemp = getGroupId();
        if (!idTemp) {
            idTemp = getNextId();
            setGroupId(idTemp);
        }

        props.setStickyGroupId(idTemp);

        intersectionObserver.init(getScrollContainer(block.stickyRef.current.parentElement));

        block.groupData = { position: props.position, id: idTemp };
        blocks.add(block);
        if (block.props.position) {
            resetSticky(blocks.getBlocks());
            const addedToStack = blocks.addToStack(
                block.id,
                getScrollContainer(block.stickyRef.current.parentElement)
            );
            restoreSticky(blocks.getBlocks());
            if (!addedToStack) {
                sizeController.updateBlockSize(block.id, 0, 0);
            }
        }

        blocks.get(block.id).offset = {
            top: undefined,
            bottom: undefined,
            left: undefined,
            right: undefined,
        };
        intersectionObserver.observe(block);
        sizeController.observe(block.stickyRef.current, block.id);

        const isStickedOnTop = props.position && props.position.indexOf(StickyPosition.Top) !== -1;
        const isStickedOnBottom =
            props.position && props.position.indexOf(StickyPosition.Bottom) !== -1;
        const isStickedOnLeft =
            block.props.position && block.props.position.indexOf(StickyPosition.Left) !== -1;
        const isStickedOnRight =
            block.props.position && block.props.position.indexOf(StickyPosition.Right) !== -1;

        dataContext[block.id] = {
            offset: {
                top: isStickedOnTop ? (props.stickyModel?.offset?.top || 0) : undefined,
                bottom: isStickedOnBottom ? (props.stickyModel?.offset?.bottom || 0) : undefined,
                left: isStickedOnLeft ? 0 : undefined,
                right: isStickedOnRight ? 0 : undefined,
            },
            shadow: {
                top: false,
                bottom: false,
                left: false,
                right: false,
            },
            fixedPosition: FixedPosition.None,
            syntheticFixedPosition: {
                fixedPosition: FixedPosition.None,
                prevPosition: FixedPosition.None,
            },
        };
        if ($wasabyRef) {
            $wasabyRef(block.stickyRef.current.parentElement);
        }

        const isGroupRegistered = Object.keys(dataContext).length > 1;
        if (!isGroupRegistered && props.position) {
            props.registerCallback({
                id: idTemp,
                stickyRef: {
                    current: block.stickyRef.current.parentElement,
                },
                isGroup: true,
                props: getProps(),
            });
        } else {
            if (props.position) {
                props.addedBlockInGroupCallback();
            }
        }
    };

    const unregister = (id: string) => {
        const groupId = getGroupId();
        const isMultiHeader = blocks.get(id).stickyRef.current.className.includes('multi-header');
        // Если стики в одну строку, то в теории пересчет теней и оффсетов стики группы делать не нужно.
        if (registeredInController && isMultiHeader) {
            props.removedBlockInGroupCallback();
        }
        intersectionObserver.unobserve(id);
        sizeController.unobserve(blocks.get(id).stickyRef.current);
        blocks.remove(id);
        blocks.removeFromStack(id);
        delete dataContext[id];

        if (Object.keys(blocks.getBlocks()).length === 0 && props.position) {
            props.unregisterCallback(groupId);
        }
    };

    React.useLayoutEffect(() => {
        return () => {
            props.groupChangeFixedPositionCallback(
                getGroupId(),
                FixedPosition.None,
                props.scrollState
            );
        };
    }, []);

    const modeChanged = (id: string, mode: Mode) => {
        blocks.get(id).props.mode = mode;

        const firstBlock = blocks.get(Object.keys(blocks.getBlocks())[0]);
        // Для совместимости.
        if (!props.mode && firstBlock.id === id && registeredInController) {
            props.modeChangedCallback(getGroupId(), mode);
        }
        updateOffset();
        updateShadows();
    };

    const offsetChanged = (id: string, offset: number) => {
        (blocks.get(id).props as IStickyGroupedBlock).offsetLeft = offset;
        if (props.position) {
            props.offsetChangedCallback(getGroupId());
        }
        updateOffset();
    };

    const getWidth = () => {
        let blocksWidth = 0;
        if (!props.position && blocks.getStack()[StickyPosition.Left].length > 0) {
            for (const id of blocks.getStack()[StickyPosition.Left]) {
                blocksWidth += blocks.get(id).stickyRef.current.offsetWidth;
            }
        }
        return blocksWidth;
    };

    const updateVerticalOffset = () => {
        for (const id in blocks.getBlocks()) {
            if (blocks.getBlocks().hasOwnProperty(id)) {
                const block = blocks.get(id);
                if (props.position && props.stickyModel) {
                    dataContext[id].offset = {
                        ...getVerticalOffsets(
                            block,
                            props.position,
                            props.stickyModel.offset,
                            block.stickyRef.current.parentElement
                        ),
                        left: undefined,
                        right: undefined,
                    };
                    blocks.get(id).offset = { ...dataContext[id].offset };
                }
            }
        }
    };

    const updateHorizontalOffset = () => {
        for (const position of [StickyPosition.Left, StickyPosition.Right]) {
            for (const id of blocks.getStack()[position]) {
                const block = blocks.get(id);
                if (block.props.position) {
                    dataContext[id].offset = {
                        ...dataContext[id].offset,
                        ...getHorizontalOffsets(blocks, block, block.props.position),
                    };
                    blocks.get(id).offset = { ...dataContext[id].offset };
                }
            }
        }
    };

    const updateOffset = () => {
        version.current++;
        for (const id in blocks.getBlocks()) {
            if (blocks.getBlocks().hasOwnProperty(id)) {
                dataContext[id].offset = {
                    top: undefined,
                    bottom: undefined,
                    left: undefined,
                    right: undefined,
                };
            }
        }
        resetSticky(blocks.getBlocks());
        updateVerticalOffset();
        updateHorizontalOffset();
        restoreSticky(blocks.getBlocks());
    };

    const updateShadows = () => {
        version.current++;
        for (const id in blocks.getBlocks()) {
            if (blocks.getBlocks().hasOwnProperty(id)) {
                dataContext[id].shadow = {
                    top: undefined,
                    bottom: undefined,
                    left: undefined,
                    right: undefined,
                };
                if (blocks.getBlocks()[id].props.shadowVisibility !== 'hidden') {
                    if (props.position && props.stickyModel) {
                        const decomposedPositions = getDecomposedPositionFromString(props.position);
                        for (const position of decomposedPositions) {
                            if (position === StickyPosition.Top) {
                                dataContext[id].shadow.bottom = props.stickyModel.shadow.bottom;
                            }
                            if (position === StickyPosition.Bottom) {
                                dataContext[id].shadow.top = props.stickyModel.shadow.top;
                            }
                        }
                    }
                    if (blocks.get(id).props.position) {
                        const decomposedPositions = getDecomposedPositionFromString(
                            blocks.get(id).props.position
                        );
                        for (const position of decomposedPositions) {
                            if (position === StickyPosition.Left) {
                                dataContext[id].shadow.right =
                                    props.scrollState.horizontalPosition &&
                                    props.scrollState.horizontalPosition !== ScrollPosition.Start;
                            }
                            if (position === StickyPosition.Right) {
                                dataContext[id].shadow.left =
                                    props.scrollState.horizontalPosition &&
                                    props.scrollState.horizontalPosition !== ScrollPosition.End;
                            }
                        }
                    }
                }
            }
        }
    };

    const sizeChanged = (updatedBlocks: object, sizeChangedBlocks: object) => {
        let countAdded = 0;
        let countRemoved = 0;
        for (const id in updatedBlocks) {
            if (updatedBlocks.hasOwnProperty(id)) {
                if (updatedBlocks[id].operation === StackOperation.Add) {
                    if (blocks.get(id).props.position) {
                        resetSticky(blocks.getBlocks());
                        blocks.addToStack(id, scrollContainer);
                        restoreSticky(blocks.getBlocks());
                    }
                    countAdded++;
                } else {
                    if (blocks.get(id).props.position) {
                        blocks.removeFromStack(id);
                    }
                    countRemoved++;
                }
            }
        }

        let needUpdateOffsets = false;
        // updatedBlocks пустой, когда изменились размеры StickyGroupedBlock и видимость их не поменялась (не было
        // установки/снятия ws-hidden).
        if (Object.keys(updatedBlocks).length === 0) {
            const stickyKeys = Object.keys(blocks.getBlocks());
            // Если хоть 1 стики блок изменил свои размеры, то их позицию нужно пересчитать
            needUpdateOffsets = true;
            const newHeight =
                sizeChangedBlocks[stickyKeys[0]]?.height || height.current;
            if (newHeight !== height.current) {
                height.current = newHeight;
            }
        }

        let operation = '';
        const countAllBlocks = Object.keys(blocks.getBlocks()).length;
        if (countAllBlocks === countAdded) {
            operation = StackOperation.Add;
        } else if (countAllBlocks === countRemoved) {
            operation = StackOperation.Remove;
        }

        const hasHorizontalBlocks = blocks.getStack().left.length || blocks.getStack().right.length;
        if (operation === StackOperation.None && (hasHorizontalBlocks || needUpdateOffsets)) {
            updateOffset();
            version.current++;
            setGroupVersion((version) => {
                return version + 1;
            });
        }
        props.groupSizeChangedCallback(getGroupId(), operation, getWidth());
    };

    const fixedPositionChange = (
        updatedBlocks: IFixedPositionUpdatedBlock[],
        scrollState: ScrollState
    ) => {
        updatedBlocks.forEach((updatedBlock) => {
            dataContext[updatedBlock.id].fixedPosition = updatedBlock.fixedPosition;
        });

        const isFixed = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };
        let groupId;
        for (const id in blocks.getBlocks()) {
            if (blocks.getBlocks().hasOwnProperty(id)) {
                groupId = blocks.get(id).groupData.id;
                const decomposedPositions = getDecomposedPositionFromString(
                    blocks.get(id).fixedPosition
                );
                for (const decomposedPosition of decomposedPositions) {
                    if (decomposedPosition === StickyPosition.Top) {
                        isFixed.top = true;
                    }
                    if (decomposedPosition === StickyPosition.Bottom) {
                        isFixed.bottom = true;
                    }
                    if (decomposedPosition === StickyPosition.Left) {
                        isFixed.left = true;
                    }
                    if (decomposedPosition === StickyPosition.Right) {
                        isFixed.right = true;
                    }
                }
            }
        }

        if (Object.keys(blocks.getBlocks()).length === 0) {
            return;
        }

        let groupFixedPosition = '';
        if (isFixed.top) {
            groupFixedPosition += FixedPosition.Top;
        } else if (isFixed.bottom) {
            groupFixedPosition += FixedPosition.Bottom;
        }
        if (isFixed.left) {
            groupFixedPosition += groupFixedPosition === '' ? 'left' : 'Left';
        } else if (isFixed.right) {
            groupFixedPosition += groupFixedPosition === '' ? 'right' : 'Right';
        }

        props.groupChangeFixedPositionCallback(groupId, groupFixedPosition, scrollState);
        if (!registeredInController) {
            updateFixed(groupFixedPosition, {
                fixedPosition: groupFixedPosition,
                prevPosition: groupFixedPosition ? FixedPosition.None : FixedPosition.Left,
            });
            updateShadows();
            version.current++;
        }
    };

    const updateFixed = (groupFixed, syntheticFixedPosition) => {
        version.current++;
        for (const id in blocks.getBlocks()) {
            if (blocks.getBlocks().hasOwnProperty(id)) {
                dataContext[id].fixedPosition = groupFixed;
                dataContext[id].syntheticFixedPosition = {
                    ...syntheticFixedPosition,
                };
            }
        }
    };

    const [intersectionObserver] = React.useState(() => {
        return new StickyIntersectionController(blocks, props.scrollState, fixedPositionChange);
    });
    const [sizeController] = React.useState(() => {
        return new StickySizeController(blocks, sizeChanged);
    });

    sizeController.updateCallback(sizeChanged);
    intersectionObserver.updateCallback(fixedPositionChange);
    intersectionObserver.updateScrollState(props.scrollState);

    const propsAreEqualUpdate = (prevProps, curProps) => {
        if (!prevProps) {
            return false;
        }
        const isPrevIds = prevProps.blocksId.some((id) => {
            return !!dataContext[id];
        });
        if (!isPrevIds) {
            return false;
        }
        const prevPropsStickyModel = prevProps.stickyModel || EMPTY_STICKY_MODEL;
        const curPropsStickyModel = curProps.stickyModel || EMPTY_STICKY_MODEL;
        return (
            JSON.stringify(prevPropsStickyModel.offset) ===
            JSON.stringify(curPropsStickyModel.offset)
        );
    };
    const prevProps = usePreviousProps({ blocksId: Object.keys(dataContext), ...props }, undefined);
    if (Object.keys(dataContext).length) {
        if (!propsAreEqualUpdate(prevProps, props)) {
            updateOffset();
        } else {
            // При первом построении горизонтальные стики блоки сразу проставляют оффсеты у себя,
            // а не на уровне StickyController'а
            if (!props.stickyModel) {
                updateHorizontalOffset();
            }
        }
        updateShadows();
        if (props.position) {
            const fixedPosition =
                props.stickyModel?.fixedPosition || EMPTY_STICKY_MODEL.fixedPosition;
            const syntheticFixedPosition =
                props.stickyModel?.syntheticFixedPosition ||
                EMPTY_STICKY_MODEL.syntheticFixedPosition;
            updateFixed(fixedPosition, syntheticFixedPosition);
        }
    }

    const stickyContextProviderValue = React.useMemo(() => {
        return {
            models: { ...props.stickyModel, ...object.clone(dataContext) },
            ...{
                registerCallback: register.bind(this),
                unregisterCallback: unregister.bind(this),
                offsetChangedCallback: offsetChanged.bind(this),
                modeChangedCallback: modeChanged.bind(this),
            },
            horizontalScrollMode: props.scrollState?.horizontalScrollMode,
        };
    }, [version.current]);

    return (
        <Ctx.StickyContext.Provider value={stickyContextProviderValue}>
            {props.children ||
                (props.content.isWasabyTemplate ? (
                    <props.content
                        forwardedRef={ref}
                        {...clearProps}
                        className={userAttrs?.className}
                    />
                ) : (
                    React.cloneElement(props.content, {
                        forwardedRef: ref,
                        ...clearProps,
                        className: userAttrs?.className,
                    })
                ))}
        </Ctx.StickyContext.Provider>
    );
}

const propsAreEqual = (prevProps, curProps) => {
    if (curProps.children) {
        return false;
    }
    if (prevProps.shadowVisibility !== curProps.shadowVisibility) {
        return false;
    }
    if (prevProps.offsetTop !== curProps.offsetTop) {
        return false;
    }
    if (prevProps.mode !== curProps.mode) {
        return false;
    }
    if (prevProps.position !== curProps.position) {
        return false;
    }
    if (prevProps.content !== curProps.content) {
        return false;
    }
    if (prevProps.scrollState?.horizontalPosition !== curProps.scrollState?.horizontalPosition) {
        return false;
    }
    if (
        curProps.position &&
        prevProps.scrollState?.scrollTop > 0 &&
        curProps.scrollState?.scrollTop <= 0
    ) {
        return false;
    }
    return JSON.stringify(prevProps.stickyModel) === JSON.stringify(curProps.stickyModel);
};

export default React.memo(React.forwardRef(StickyGroup), propsAreEqual);
