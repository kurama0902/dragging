import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { ChestSVG } from "../../SVGComponents/ChestSVG";
import { DropdownArrowSVG } from "../../SVGComponents/DropdownArrowSVG";

import { createPortal } from "react-dom";
import { DeleteSVG } from "../../SVGComponents/DeleteSVG";
import { DeleteRedSVG } from "../../SVGComponents/DeleteRedSVG";
import { PinSVG } from "../../SVGComponents/PinSVG";
import { PinnedSVG } from "../../SVGComponents/PinnedSVG";

import s from "./draggableTabs.module.css";

type RoutesList = {
    route: string;
    svg: JSX.Element;
};

export const DraggableTabs = ({ routesList }: { routesList: RoutesList[] }) => {

    const { pathname } = useLocation();

    const storedRoutesList: RoutesList[] = JSON.parse(localStorage.getItem('routesList') || '[]')
        .map(({ route }: { route: string }) => {
            return routesList.find((el) => el.route === route);
        });

    const [isDropdownShow, setIsDropdownShow] = useState<boolean>(false);
    const [routesListState, setRoutesListState] = useState<RoutesList[]>(storedRoutesList.length ? storedRoutesList : routesList)
    const [count, setCount] = useState<number>(storedRoutesList.length ? storedRoutesList.length - 1 : routesList.length - 1);
    const [pinnedTabs, setPinnedTabs] = useState<string[]>(JSON.parse(localStorage.getItem('pinnedTabs') || '[]'));
    const [isContextMenuShowByNum, setIsContextMenuShowByNum] = useState<number | null>(null);
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
    const [flag, setFlag] = useState<boolean>(true);

    const linkRefs = useRef<(HTMLDivElement | null)[]>([]);


    const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        e.preventDefault();
        setIsContextMenuShowByNum(index);
    }

    const handleSetPinnedTabs = (tabName: string, index: number) => {
        if (pinnedTabs.includes(tabName)) {
            const newPinnedTabs = pinnedTabs.filter((tab) => tab !== tabName);
            const newChangedTabList = [...routesListState];

            const element = newChangedTabList.splice(index, 1)[0];
            newChangedTabList.splice(newPinnedTabs.length, 0, element);

            setRoutesListState(newChangedTabList);
            setPinnedTabs(newPinnedTabs);

            updateStorage(newChangedTabList, 'routesList');
            updateStorage(newPinnedTabs, 'pinnedTabs');
        } else {
            const newPinnedTabs = [...pinnedTabs, tabName];

            const newChangedTabList = [...routesListState];

            const element = newChangedTabList.splice(index, 1)[0];
            newChangedTabList.splice(newPinnedTabs.length - 1, 0, element);

            setRoutesListState(newChangedTabList);
            setPinnedTabs(newPinnedTabs);

            updateStorage(newChangedTabList, 'routesList');
            updateStorage(newPinnedTabs, 'pinnedTabs');
        }
    }

    useEffect(() => {
        const linksWidthList = linkRefs.current
            .map((link) => {
                if (link) {
                    console.log(link, 'link');
                    console.log(link.getBoundingClientRect().width, 'link width');
                    
                    return link.getBoundingClientRect().width;
                }
                return 0;
            })
            .filter((el) => el !== 0);
            console.log(linksWidthList, 'list');
            
        console.log(linkRefs.current, 'refs links');


        const handleWindowWidthChange = () => {

            const chestSize = document.getElementById('chest')?.getBoundingClientRect().width;
            const dropdownBtnSize = document.getElementById('dropdownBtn')?.getBoundingClientRect().width;


            let windowSize = 0;

            if (chestSize && dropdownBtnSize) {
                windowSize = window.innerWidth - 62 - chestSize - dropdownBtnSize;
            }

            if (linkRefs.current.length === 1) return;

            let totalWidth = 0;
            let count = 0;


            for (const width of linksWidthList) {

                if (totalWidth + width >= windowSize) break;
                totalWidth += width;
                count++;                
            }

            setCount(count || 1);
        };

        const handleCloseContextMenu = () => {
            setIsContextMenuShowByNum(null);
            setIsTouchDevice(false);
        }
        const handleTouch = () => {
            setIsTouchDevice(true);
        }

        handleWindowWidthChange();
        if(flag) {
            setFlag(false);
        }
        
        
        window.addEventListener("resize", handleWindowWidthChange);
        window.addEventListener("click", handleCloseContextMenu);
        window.addEventListener("touchstart", handleTouch);

        () => {
            window.removeEventListener("resize", handleWindowWidthChange);
            window.addEventListener("click", handleCloseContextMenu);
            window.addEventListener("touchstart", handleTouch);
        };
    }, [flag]);

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const newRoutesListState = Array.from(routesListState);
        const [movedItem] = newRoutesListState.splice(source.index, 1);
        newRoutesListState.splice(destination.index <= count ? destination.index : count - 1, 0, movedItem);

        setRoutesListState(newRoutesListState);

        updateStorage(newRoutesListState, 'routesList')

        if (isTouchDevice) {
            setIsContextMenuShowByNum(destination.index);
        }
    };

    const updateStorage = (arr: RoutesList[] | string[], storageName: string) => {
        if (storageName === 'routesList') {
            const routes = arr as RoutesList[];
            localStorage.setItem(storageName, JSON.stringify(routes.map((({ route }) => {
                return {
                    route: route
                }
            }))));
        }

        if (storageName === 'pinnedTabs') {
            const pinnedTabs = arr as string[];
            localStorage.setItem(storageName, JSON.stringify(pinnedTabs));
        }
    }

    return (
        <div className={s.draggableTabsWrap}>
            <div id="chest" className={s.chestWrap}>
                <ChestSVG />
            </div>
            <DragDropContext onDragStart={() => setIsContextMenuShowByNum(null)} onDragEnd={handleDragEnd}>
                <Droppable droppableId="routesTabs" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} id="routesTabWrap" className={s.routesTabsWrap} style={{ display: "flex", width: '100%' }}>
                            {routesListState.slice(0, count).map((routeInfo, index) => {

                                return (
                                    !pinnedTabs.includes(routeInfo.route) ? <Draggable key={routeInfo.route} draggableId={routeInfo.route} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                style={{ ...provided.draggableProps.style, flexGrow: 1 }}

                                            >
                                                <div
                                                    onContextMenu={(e) => handleRightClick(e, index)}
                                                    ref={(e) => linkRefs.current[index] = e}
                                                    className={`${s.routeTab} `}
                                                >
                                                    <Link
                                                        className={`${s.routeLink} ${(pathname === `/${routeInfo.route.toLocaleLowerCase().replace(/\s+/g, '')}`) && s.setBorderTop}`}
                                                        to={`/${routeInfo.route.toLocaleLowerCase().replace(/\s+/g, '')}`}
                                                    >
                                                        {routeInfo.svg}
                                                        <p className={s.routeTabText}>{routeInfo.route}</p>
                                                        {
                                                            pinnedTabs.includes(routeInfo.route) &&
                                                            <div className={s.pinnedWrap}>
                                                                <PinnedSVG />
                                                            </div>
                                                        }
                                                    </Link>
                                                    {routesListState.length !== 1 && <div onClick={() => {
                                                        const newRoutesList = routesListState.filter((e) => e.route !== routeInfo.route);
                                                        setRoutesListState(newRoutesList);

                                                        updateStorage(newRoutesList, 'routesList');

                                                    }} className={s.deleteTab}>
                                                        <DeleteRedSVG />
                                                    </div>}
                                                    {
                                                        isContextMenuShowByNum !== null && createPortal(
                                                            <div className={`${s.contextMenu} ${index >= count && s.hide}`}>
                                                                <p className={s.hiddenContent}>{routeInfo.svg}{routeInfo.route}</p>
                                                                {
                                                                    (index === isContextMenuShowByNum)
                                                                    &&
                                                                    <button onClick={() => handleSetPinnedTabs(routeInfo.route, index)} className={`${s.rightClickWrap} ${index === count - 1 && s.lastClickWrap}`}>
                                                                        <PinSVG />
                                                                        {!pinnedTabs.includes(routeInfo.route) ? <p>Tab anpinnen</p> : <p>Tab pinned</p>}
                                                                    </button>
                                                                }
                                                            </div>,
                                                            document.getElementById('contextMenuWrap') || document.createElement('div')
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                        :
                                        <div
                                            key={routeInfo.route}
                                            style={{ flexGrow: 1 }}

                                        >
                                            <div onContextMenu={(e) => handleRightClick(e, index)}
                                                ref={(e) => linkRefs.current[index] = e}
                                                className={`${s.routeTab} `}
                                            >
                                                <Link
                                                    className={`${s.routeLink} ${(pathname === `/${routeInfo.route.toLocaleLowerCase().replace(/\s+/g, '')}`) && s.setBorderTop}`}
                                                    to={`/${routeInfo.route.toLocaleLowerCase().replace(/\s+/g, '')}`}
                                                >
                                                    {routeInfo.svg}
                                                    <p className={s.routeTabText}>{routeInfo.route}</p>
                                                    {
                                                        pinnedTabs.includes(routeInfo.route) &&
                                                        <div className={s.pinnedWrap}>
                                                            <PinnedSVG />
                                                        </div>
                                                    }
                                                </Link>
                                                <div onClick={() => {
                                                    const newRoutesList = routesListState.filter((e) => e.route !== routeInfo.route);
                                                    handleSetPinnedTabs(routeInfo.route, index);
                                                    setRoutesListState(newRoutesList);

                                                    updateStorage(newRoutesList, 'routesList');

                                                }} className={s.deleteTab}>
                                                    <DeleteRedSVG />
                                                </div>
                                                {
                                                    isContextMenuShowByNum !== null && createPortal(
                                                        <div className={`${s.contextMenu} ${index >= count && s.hide}`}>
                                                            <p className={s.hiddenContent}>{routeInfo.svg}{routeInfo.route}</p>
                                                            {
                                                                (index === isContextMenuShowByNum)
                                                                &&
                                                                <button onClick={() => handleSetPinnedTabs(routeInfo.route, index)} className={`${s.rightClickWrap} ${index === count - 1 && s.lastClickWrap}`}>
                                                                    <PinSVG />
                                                                    {!pinnedTabs.includes(routeInfo.route) ? <p>Tab anpinnen</p> : <p>Tab pinned</p>}
                                                                </button>
                                                            }
                                                        </div>,
                                                        document.getElementById('contextMenuWrap') || document.createElement('div')
                                                    )
                                                }
                                            </div>
                                        </div>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div id="dropdownBtn" className={s.dropdownWrap}>
                <button
                    onClick={() => {
                        setIsDropdownShow(!isDropdownShow);
                    }}
                    className={s.dropdownBtn}
                >
                    <DropdownArrowSVG deg={isDropdownShow ? 0 : 180} />
                </button>
                {isDropdownShow && (
                    createPortal(
                        <div className={s.dropdown}>
                            {routesListState.slice(count, routesListState.length).length ? routesListState.slice(count, routesListState.length).map((el) => {
                                return (
                                    <div key={el.route} className={s.dropdownLinkWrap}>
                                        <Link to={`/${el.route.toLocaleLowerCase().replace(/\s+/g, '')}`} className={s.dropdownRouteLink} key={el.route}>
                                            {el.svg}
                                            {el.route}
                                        </Link>
                                        <div onClick={() => {
                                            const newRoutesList = routesListState.filter((e) => e.route !== el.route);
                                            setRoutesListState(newRoutesList)
                                            updateStorage(newRoutesList, 'routesList');
                                        }} className={s.deleteDropdownRouteBtn}>
                                            <DeleteSVG />
                                        </div>
                                    </div>
                                );
                            })
                                :
                                <p className={s.emptyText}>Empty list..</p>
                            }
                        </div>,
                        document.getElementById('tabsContainer') || document.createElement('div')
                    )
                )}
            </div>
        </div>
    );
};
