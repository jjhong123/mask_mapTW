<template>
  <div id="map">
    <!-- 初始化地圖設定 -->
    <l-map ref="myMap" :zoom="zoom" :center="center" :options="options" style="height: 100vh;">
      <!-- 載入圖資 -->
      <l-tile-layer :url="url" :attribution="attribution" />
      <!-- 加入組件 tag -->
      <v-marker-cluster>
        <l-geo-json :geojson="msk_data" :options="geoJsonOption"></l-geo-json>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import CardDetail from './CardDetail';
// 載入 vue2-leaflet，依照自己需要載入組件
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
// 載入 css
import "leaflet/dist/leaflet.css";

// 設定預設 icon
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// 載入 css
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// 載入 markercluster 並啟用
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

export default {
  props: ["msk_data"],
  name: "App",
  components: {
    LMap,
    LTileLayer,
    "l-geo-json": LGeoJson,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    CardDetail
  },
  data() {
    return {
      zoom: 13,
      center: [22.612961, 120.304167],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        zoomControl: false,
      },
      geoJsonOption: {
        pointToLayer: (geoJsonPoint, latlng) => {
          let adult_cs = "";
          let child_cs = "";

          if (geoJsonPoint.properties.mask_adult === 0) {
            adult_cs = "zero";
          } else if (geoJsonPoint.properties.mask_adult < 100) {
            adult_cs = "less";
          } else {
            adult_cs = "many";
          }

          if (geoJsonPoint.properties.mask_child === 0) {
            child_cs = "zero";
          } else if (geoJsonPoint.properties.mask_child < 100) {
            child_cs = "less";
          } else {
            child_cs = "many";
          }

          const html = `
            <div class="adult adult-${adult_cs}">${geoJsonPoint.properties.mask_adult}</div>
            <div class="child child-${child_cs}">${geoJsonPoint.properties.mask_child}</div>
          `;
          // console.log(html)
          // Add points icon
          const options = {
            icon: L.divIcon({
              html: html,
              className: "my_points",
              iconSize: L.point(78, 36),
              iconAnchor: L.point(39, 46),
            }),
          };

          return L.marker(latlng, options).on("click", this.markerCilckHandler);
        },
      }
    };
  },
  mounted() {
    // 等地圖創建後執行
    this.$nextTick(() => {
      // 獲得目前位置
      navigator.geolocation.getCurrentPosition((position) => {
        const p = position.coords;
        // 將中心點設為目前的位置
        this.center = [p.latitude, p.longitude];
        // 將目前的位置的標記點彈跳視窗打開
        // this.$refs.location.mapObject.openPopup();
      });
    });
  },
  methods: {
    markerCilckHandler(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss">
#map {
  width: calc(100% - 400px);
  height: 100vh;
  float: left;
}

.my_points {
  border-radius: 5px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  > div {
    width: 32px;
    height: 28px;
    border-radius: 4px;
    text-align: center;
    line-height: 28px;
  }

  .adult {
    margin-right: 4px;
    &-less {
      background: #db8688;
    }
    &-many {
      background: #88b5dd;
    }
    &-zero {
      background: #b3b3b3;
    }
  }

  .child {
    &-less {
      background: #db8688;
    }
    &-many {
      background: #88b5dd;
    }
    &-zero {
      background: #b3b3b3;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border: 10px solid transparent;
    border-top: 10px solid #ffffff;
  }
}
</style>