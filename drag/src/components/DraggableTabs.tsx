import { Link } from "react-router-dom";
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
import { useLayoutEffect, useRef, useState } from "react";

import s from './draggableTabs.module.css';

export const DraggableTabs = () => {

    type RoutesList = {
        route: string,
        svg: JSX.Element;
    }

    const [windowSize, setWindowSize] = useState<number>(window.innerWidth - 62 - 57 - 36);
    const [count, setCount] = useState<number>(13);    

    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const routesList: RoutesList[] = [
        { route: 'Dashboard', svg: <DashboardSVG /> },
        { route: 'Banking', svg: <BankingSVG /> },
        { route: 'Telefonie', svg: <PhoneSVG /> },
        { route: 'Accounting', svg: <AccountingSVG /> },
        { route: 'Verkauf', svg: <VerkaufSVG /> },
        { route: 'Statistik', svg: <StatistikSVG /> },
        { route: 'Post Office', svg: <PostOfficeSVG /> },
        { route: 'Administration', svg: <AdministrationSVG /> },
        { route: 'Help', svg: <HelpSVG /> },
        { route: 'Warenbestand', svg: <WarenbestandSVG /> },
        { route: 'Auswahllisten', svg: <AuswahllistenSVG /> },
        { route: 'Einkauf', svg: <EinkaufSVG /> },
        { route: 'Rechn', svg: <RechnSVG /> },
    ];

    useLayoutEffect(() => {
        const handleWindowWidthChange = () => {
            setWindowSize(window.innerWidth - 62 - 57 - 36)
        }

        window.addEventListener('resize', handleWindowWidthChange);

        () => {
            window.removeEventListener('resize', handleWindowWidthChange);
        }
    }, [])

    useLayoutEffect(() => {

        if(linkRefs.current.length === 1) return;

        const linksWidthList = linkRefs.current.map((link) => {
            if (link) {
                return link.getBoundingClientRect().width;
            }
            return 0;
        }).filter(el => el !== 0);

        let totalWidth = 0;
        let count = 0;

        for (let width of linksWidthList) {
            if (totalWidth + width >= windowSize) break;
            totalWidth += width;
            count++;
        }
        
        setCount(count || 1);
    }, [windowSize]);

    return (
        <div className={s.draggableTabsWrap}>
            <div className={s.chestWrap}>
                <ChestSVG />
            </div>
            {routesList.map((routeInfo, index) => {
                return (
                    <Link ref={(e) => linkRefs.current[index] = e} className={`${s.routeTab} ${(index >= count) && s.hide}`} to={`/${routeInfo.route}`} key={routeInfo.route}>
                        {routeInfo.svg}
                        {routeInfo.route}
                    </Link>
                )

            })}
            <div className={s.dropdownWrap}>

            </div>
        </div>
    )
}