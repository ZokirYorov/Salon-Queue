<template>
  <div ref="mapEl" class="h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:h-44" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Leaflet default marker iconlarini production build uchun aniq ko'rsatamiz
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps<{
  latitude: number
  longitude: number
  title?: string
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

function point(): L.LatLngExpression {
  return [props.latitude, props.longitude]
}

function updateMarker() {
  if (!map) return

  if (!marker) {
    marker = L.marker(point()).addTo(map)
  } else {
    marker.setLatLng(point())
  }

  if (props.title) {
    marker.bindPopup(props.title)
  }

  map.setView(point(), 15)
}

onMounted(() => {
  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    center: point(),
    zoom: 15,
    dragging: true,
    scrollWheelZoom: false,
  })

  L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
      }
  ).addTo(map)

  updateMarker()

  setTimeout(() => {
    map?.invalidateSize()
  }, 0)
})

watch(
    () => [props.latitude, props.longitude, props.title],
    updateMarker
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
})
</script>
