import { DraggableTabs } from './components/DraggableTabs/DraggableTabs'

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import s from './App.module.css'
import { DashboardSVG } from './SVGComponents/DashboardSVG';
import { BankingSVG } from './SVGComponents/BankingSVG';
import { PhoneSVG } from './SVGComponents/PhoneSVG';
import { AccountingSVG } from './SVGComponents/AccountingSVG';
import { VerkaufSVG } from './SVGComponents/VerkaufSVG';
import { StatistikSVG } from './SVGComponents/StatistikSVG';
import { PostOfficeSVG } from './SVGComponents/PostOfficeSVG';
import { AdministrationSVG } from './SVGComponents/AdministrationSVG';
import { HelpSVG } from './SVGComponents/HelpSVG';
import { WarenbestandSVG } from './SVGComponents/WarenbestandSVG';
import { AuswahllistenSVG } from './SVGComponents/AuswahllistenSVG';
import { EinkaufSVG } from './SVGComponents/EinkaufSVG';
import { RechnSVG } from './SVGComponents/RechnSVG';

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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className={s.app}>
        <div className={s.topPaddingBlock}></div>
        <div id='tabsContainer' className={s.dragableTabsContainer}>
          <DraggableTabs routesList={routesList} />
          <div id='contextMenuWrap' className={s.contextMenuWrap}>

          </div>
        </div>
        <div className={s.mainContent}>
          <Outlet />
        </div>
      </div>
    ),
    children: routesList.map(({route}) => {
      return {
        path: route.toLocaleLowerCase().replace(/\s+/g, ''),
        element: <p>{route}</p>
      }
    }),
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
