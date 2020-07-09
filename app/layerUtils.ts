import FeatureLayer = require("esri/layers/FeatureLayer");
import GroupLayer = require("esri/layers/GroupLayer");
import ImageryLayer = require("esri/layers/ImageryLayer");

import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol } from "esri/symbols";

// Data from Johns Hopkins University
// "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";

const polygonFillPortalItemId = "45389b90ed234ab4be65820e081254c4";
const polygonFillLayerId = 2;  // polygons

export const separator = "_";
export const prefix = "DAYSTRING_";

export const infectionsPopulationLayer = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
  layerId: polygonFillLayerId,
  outFields: ["*"],
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 1,
      color: null,
      outline: null
    })
  }),
  blendMode: "source-in"
});

export const blendedLayer = new GroupLayer({
  layers: [
    new ImageryLayer({
      portalItem: {
        id: "0f83177f15d640ed911bdcf6614810a5"
      },
      legendEnabled: false
    }),
    infectionsPopulationLayer
  ],
  blendMode: "darken"
})
