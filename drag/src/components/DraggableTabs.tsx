import { Link, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { ChestSVG } from "../SVGComponents/ChestSVG";
import { DashboardSVG } from "../SVGComponents/DashboardSVG";
import { BankingSVG } from "../SVGComponents/BankingSVG";
import { PhoneSVG } from "../SVGComponents/PhoneSVG";
import { AccountingSVG } from "../SVGComponents/AccountingSVG";
import { VerkaufSVG } from "../SVGComponents/VerkaufSVG";
import { StatistikSVG } from "../SVGComponents/StatistikSVG";
import { PostOfficeSVG } from "../SVGComponents/PostOfficeSVG";
import { AdministrationSVG } from "../SVGComponents/AdministrationSVG";
import { HelpSVG } from "../SVGComponents/HelpSVG";
import { WarenbestandSVG } from "../SVGComponents/WarenbestandSVG";
import { AuswahllistenSVG } from "../SVGComponents/AuswahllistenSVG";
import { EinkaufSVG } from "../SVGComponents/EinkaufSVG";
import { RechnSVG } from "../SVGComponents/RechnSVG";
import { DropdownArrowSVG } from "../SVGComponents/DropdownArrowSVG";

import { createPortal } from "react-dom";
import { DeleteSVG } from "../SVGComponents/DeleteSVG";
import { DeleteRedSVG } from "../SVGComponents/DeleteRedSVG";
import { PinSVG } from "../SVGComponents/PinSVG";
import { PinnedSVG } from "../SVGComponents/PinnedSVG";

import s from "./draggableTabs.module.css";

type RoutesList = {
    route: string;
    svg: JSX.Element;
};

const routesList: RoutesList[] = [
    { route: "Dashboard", svg: <DashboardSVG /> },
    { route: "Banking", svg: <BankingSVG /> },
    { route: "Telefonie", svg: <PhoneSVG /> },
    { route: "Accounting", svg: <AccountingSVG /> },
    { route: "Verkauf", svg: <VerkaufSVG /> },
    { route: "Statistik", svg: <StatistikSVG /> },
    { route: "Post Office", svg: <PostOfficeSVG /> },
    { route: "Administration", svg: <AdministrationSVG /> },
    { route: "Help", svg: <HelpSVG /> },
    { route: "Warenbestand", svg: <WarenbestandSVG /> },
    { route: "Auswahllisten", svg: <AuswahllistenSVG /> },
    { route: "Einkauf", svg: <EinkaufSVG /> },
    { route: "Rechn", svg: <RechnSVG /> },
];

export const DraggableTabs = () => {

    const { pathname } = useLocation();

    const [isDropdownShow, setIsDropdownShow] = useState<boolean>(false);
    const [routesListState, setRoutesListState] = useState<RoutesList[]>(routesList)
    const [count, setCount] = useState<number>(routesList.length);
    const [pinnedTabs, setPinnedTabs] = useState<string[]>([]);
    const [isContextMenuShowByNum, setIsContextMenuShowByNum] = useState<number | null>(null);

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
        } else {
            const newPinnedTabs = [...pinnedTabs, tabName];

            const newChangedTabList = [...routesListState];

            const element = newChangedTabList.splice(index, 1)[0];
            newChangedTabList.splice(newPinnedTabs.length - 1, 0, element);

            setRoutesListState(newChangedTabList);
            setPinnedTabs(newPinnedTabs);
        }
    }

    useLayoutEffect(() => {
        const linksWidthList = linkRefs.current
            .map((link) => {
                if (link) {
                    return link.getBoundingClientRect().width;
                }
                return 0;
            })
            .filter((el) => el !== 0);

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
        }

        handleWindowWidthChange();

        window.addEventListener("resize", handleWindowWidthChange);
        window.addEventListener("click", handleCloseContextMenu);

        return () => {
            window.removeEventListener("resize", handleWindowWidthChange);
            window.addEventListener("click", handleCloseContextMenu);
        };
    }, []);

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;
        console.log(result);


        if (!destination) {
            return;
        }

        const newRoutesListState = Array.from(routesListState);
        const [movedItem] = newRoutesListState.splice(source.index, 1);
        newRoutesListState.splice(destination.index <= count ? destination.index : count - 1, 0, movedItem);

        setRoutesListState(newRoutesListState);
    };

    return (
        <div className={s.draggableTabsWrap}>
            <div id="chest" className={s.chestWrap}>
                <ChestSVG />
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="routesTabs" direction="horizontal">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={s.routesTabsWrap} style={{ display: "flex", width: '100%' }}>
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
                                                    <div onClick={() => {
                                                        const newRoutesList = routesListState.filter((e) => e.route !== routeInfo.route);
                                                        setRoutesListState(newRoutesList);
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
                                        )}
                                    </Draggable>
                                        :
                                        <div
                                            style={{ flexGrow: 1 }}

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
                                                <div onClick={() => {
                                                    const newRoutesList = routesListState.filter((e) => e.route !== routeInfo.route);
                                                    setRoutesListState(newRoutesList);
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
                                    <button className={s.dropdownRouteBtn} key={el.route}>
                                        {el.svg}
                                        {el.route}
                                        <div onClick={() => {
                                            const newRoutesList = routesListState.filter((e) => e.route !== el.route);
                                            setRoutesListState(newRoutesList)
                                        }} className={s.deleteDropdownRouteBtn}>
                                            <DeleteSVG />
                                        </div>
                                    </button>
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
