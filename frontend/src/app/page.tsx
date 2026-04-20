import HeaderWrapper from "@/widgets/header/HeaderWrapper";
import HomeGrid from "./home/HomeGrid";
import { AboutCosplay } from "./home/AboutCosplay";
import { CosplayTypes } from "./home/CosplayTypes";

export default function Home() {
  return (
    <div className="app">
      <HeaderWrapper />
      <div className="ui-slider">
            <div className="ui-track">
              <div className="ui-slide slide1" />
              <div className="ui-slide slide2" />
              <div className="ui-slide slide3" />
              <div className="ui-slide slide4" />
              <div className="ui-slide slide1" />
              <div className="ui-slide slide2" />
              <div className="ui-slide slide3" />
              <div className="ui-slide slide4" />
            </div>
          </div>
      <div className="container">
        <AboutCosplay />
        <CosplayTypes />
        <HomeGrid />
      </div>
    </div>
  );
}
