<template>
  <div id="map">
    <!-- 初始化地圖設定 -->
    <l-map ref="myMap" :zoom="zoom" :center="center" :options="options" style="height: 100vh;">
      <!-- 載入圖資 -->
      <l-tile-layer :url="url" :attribution="attribution" />
      <!-- 加入組件 tag -->
      <l-control-zoom position="topright"></l-control-zoom>
      <l-control position="topright">
        <button class="locate" @click="clickHandler()">
          <img src="https://jeffdemoweb.com/maskIMG/btn_locate.svg" alt />
        </button>
      </l-control>
    </l-map>
  </div>
</template>

<script>
// 載入 vue2-leaflet，依照自己需要載入組件
import {
  LMap,
  LTileLayer,
  LGeoJson,
  LControl,
  LControlZoom,
} from "vue2-leaflet";
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

export default {
  props: ["tmpdata"],
  name: "App",
  components: {
    LMap,
    LTileLayer,
    LControl,
    LControlZoom,
    "l-geo-json": LGeoJson,
  },
  data() {
    return {
      zoom: 13,
      center: [	25.105497, 121.597366],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        zoomControl: false,
      },
      point_list: [], // 紀錄篩選後的資料(點)
      openLayerPoint: [], // 紀錄在地圖畫上的點
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
      });
    });
  },
  methods: {
    addMarkers() {
      const map = this.$refs.myMap.mapObject;
      const vm = this;
      let adult_cs = "";
      let child_cs = "";
      let msk_type = null;
      this.$bus.$emit("carddetail:message", null);
      vm.clearAllMarker();
      vm.point_list = vm.$store.getters.pointList;

      L.geoJson(vm.point_list, {
        pointToLayer: function (geoJsonPoint, latLng) {
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
          <div class="op-popUp">
            <div class="adult adult-${adult_cs}">${geoJsonPoint.properties.mask_adult}</div>
            <div class="child child-${child_cs}">${geoJsonPoint.properties.mask_child}</div>
          </div>
          `;

          if (
            geoJsonPoint.properties.mask_adult === 0 &&
            geoJsonPoint.properties.mask_child === 0
          ) {
            msk_type = "msk-zero";
          } else if (
            geoJsonPoint.properties.mask_adult +
              geoJsonPoint.properties.mask_child <
            500
          ) {
            msk_type = "msk-less";
          } else {
            msk_type = "msk-many";
          }
          let myIcon = L.icon({
            iconUrl: `https://jeffdemoweb.com/maskIMG/${msk_type}.svg`,
            className: "my_points",
            iconSize: L.point(78, 36),
            iconAnchor: L.point(39, 46),
            popupAnchor: [0, -50],
          });
          let latlng = {
            lat: geoJsonPoint.geometry.coordinates[1],
            lng: geoJsonPoint.geometry.coordinates[0],
          };

          let marker = L.marker(latlng, { icon: myIcon })
            .on("click", vm.markerCilckHandler)
            .bindPopup(`${html}`);
          vm.openLayerPoint.push(marker);
          return marker;
        },
      }).addTo(map);
      // Add time capability to the geojson layer

      //如果POINT不為空先飛過去
      if (vm.point_list.length > 0) {
        map.flyTo(
          [
            vm.point_list[0].geometry.coordinates[1],
            vm.point_list[0].geometry.coordinates[0],
          ],
          12
        );
      }
    },
    clearAllMarker(data) {
      const map = this.$refs.myMap.mapObject;
      const vm = this;
      if (vm.openLayerPoint.length > 0) {
        vm.openLayerPoint.forEach((e, id) => {
          map.removeLayer(e);
        });
        vm.point_list.length = 0;
        vm.openLayerPoint.length = 0;
      }
    },
    markerCilckHandler(e) {
      this.$bus.$emit("carddetail:message", e.target.feature);
    },
    clickHandler() {
      const map = this.$refs.myMap.mapObject;
      const vm = this;
      // 獲得目前位置
      map.flyTo([vm.center[0], vm.center[1]], 12);
    },
  },
  watch: {
    tmpdata(item) {
      const map = this.$refs.myMap.mapObject;

      // map.openPopup(item.geometry.coordinates[1], item.geometry.coordinates[0]);
      map.flyTo(
        [item.geometry.coordinates[1], item.geometry.coordinates[0]],
        18
      );
    },
  },
};
</script>

<style lang="scss">
#map {
  width: 100%;
  height: calc(100% - 50px);
  .vue2leaflet-map {
    height: 100% !important;
  }
  @media (max-width: 768px) {
    height: calc(100% - 67px);
  }
  .op-popUp {
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
  .locate {
    background: transparent;
    border: 0;
    img {
      cursor: pointer;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>