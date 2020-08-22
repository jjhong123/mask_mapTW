<template>
  <div id="map">
    <!-- 初始化地圖設定 -->
    <l-map ref="myMap" :zoom="zoom" :center="center" :options="options" style="height: 100vh;">
      <!-- 載入圖資 -->
      <l-tile-layer :url="url" :attribution="attribution" />
      <!-- 加入組件 tag -->
      <l-control-zoom position="topright"></l-control-zoom>
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
// import { Icon } from "leaflet";

// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

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
      center: [22.612961, 120.304167],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        zoomControl: false,
      },
      point_list: [],// 紀錄篩選後的資料(點)
      openLayerPoint: [],// 紀錄在地圖畫上的點
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
      vm.clearAllMarker();
      vm.point_list = vm.$store.getters.pointList.data;
      vm.point_list.forEach((e) => {
        if (e.properties.mask_adult === 0) {
          adult_cs = "zero";
        } else if (e.properties.mask_adult < 100) {
          adult_cs = "less";
        } else {
          adult_cs = "many";
        }
        if (e.properties.mask_child === 0) {
          child_cs = "zero";
        } else if (e.properties.mask_child < 100) {
          child_cs = "less";
        } else {
          child_cs = "many";
        }
        const html = `
          <div class="op-popUp">
            <div class="adult adult-${adult_cs}">${e.properties.mask_adult}</div>
            <div class="child child-${child_cs}">${e.properties.mask_child}</div>
          </div>
          `;

        if (e.properties.mask_adult === 0 && e.properties.mask_child === 0) {
          msk_type = "msk-zero";
        } else if (e.properties.mask_adult + e.properties.mask_child < 500) {
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
          lat: e.geometry.coordinates[1],
          lng: e.geometry.coordinates[0],
        };
        vm.openLayerPoint.push(
          L.marker(latlng, { icon: myIcon }).addTo(map).bindPopup(`${html}`)
        );
      });
    },
    clearAllMarker(data) {
      const map = this.$refs.myMap.mapObject;
      const vm = this;
      console.log(vm.point_list);
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
  height: 100vh;
  @media (max-width: 768px) {
  }
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
</style>