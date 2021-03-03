<template>
	<div>
		<l-map id="map" :zoom="zoom" :center="center" @click="addMarker">
			<l-tile-layer :url="url"></l-tile-layer>
			<l-marker v-for="(el, id) in markerList" :lat-lng="el" :key="id" :icon="setIcon(el.options)"
								@click="showOptionsMarker(id)"></l-marker>
			<l-control>
				<b-button variant="primary" @click="getUserLocation">Localisez-moi</b-button>
			</l-control>

			<b-modal ref="modal-update-options-marker" id="modal-update-options-marker" title="Que voulez vous faire avec ce marker" centered size="lg">
				<p>Choisissez la nouvelle icon </p>
				<div class="d-flex flex-wrap justify-content-between">
					<b-img id="img1" fluid thumbnail :src="iconFirefox" width="200" size="sm" @click="newIcon=iconFirefox"></b-img>
					<b-img id="img2" fluid thumbnail :src="iconGoogle" width="200" size="sm" @click="newIcon=iconGoogle"></b-img>
					<b-img id="img3" fluid thumbnail :src="iconGenerale" width="200" size="sm" @click="newIcon=iconGenerale"></b-img>
				</div>

				<template #modal-footer>
					<b-button variant="danger" class="float-left" @click="removeMarker(idMarkerModified)">Supprimer le marker
					</b-button>
					<b-button variant="primary" class="float-right" @click="updateMarker(newIcon, idMarkerModified)">Modifier le
						marker
					</b-button>
				</template>

			</b-modal>
		</l-map>

	</div>
</template>

<script>
import {LControl, LMap, LMarker, LTileLayer} from "vue2-leaflet";
import {icon} from "leaflet";

export default {
	name: "myMap",
	firebase() {
		return {
			markerList: this.$db.ref("/markerList/")
		};
	},
	data() {
		return {
			url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
			zoom: 13,
			center: [47.472092, -0.550589],
			markerList: [],
			iconFirefox: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/714px-Google_Maps_icon_%282020%29.svg.png',
			iconGoogle: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
			iconGenerale: 'https://static.thenounproject.com/png/6399-200.png',
			options: {
				iconUrl: this.iconFirefox,
				iconSize: [32, 37],
				iconAnchor: [16, 37]
			},
			icon: icon(this.options),

			idMarkerModified: '',
			newIcon: '',
		};
	},
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LControl,
	},
	methods: {
		addMarker(position) {
			if (navigator.userAgent.includes('Firefox/')) {
				this.options.iconUrl = this.iconFirefox;
			} else if (navigator.userAgent.includes('Chrome/')) {
				this.options.iconUrl = this.iconGoogle;
			} else {
				this.options.iconUrl = this.iconGenerale;
			}
			position.latlng.options = this.options;
			console.log(position)
			this.$firebaseRefs.markerList.push(position.latlng);
			console.log('true')

		},
		removeMarker(idMarker) {
			const marker = this.markerList[idMarker]
			const markerKey = marker['.key']
			console.log(markerKey)
			this.$bvModal.msgBoxConfirm("Voulez-vous supprimer le point?").then((confirmation) => {
				if (confirmation) {
					this.$firebaseRefs.markerList.child(markerKey).remove();
					this.hideOptionsMarker();
				}
			});
		},
		updateMarker(icon, id) {
			console.log(id)
			console.log(this.markerList[id])
			let marker = this.markerList[id];
			console.log(marker['.key'])
			marker.options.iconUrl = icon
			this.$firebaseRefs.markerList.child(marker['.key']).update(marker).then(() => {
				console.log("Marker updated!");
				this.hideOptionsMarker()
			});
		},

		showOptionsMarker(id) {
			console.log(id)
			this.idMarkerModified = id;
			this.$bvModal.show('modal-update-options-marker');
		},

		hideOptionsMarker() {
			this.$bvModal.hide('modal-update-options-marker');

		},

		getUserLocation() {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
						position => {
							this.center = [position.coords.latitude, position.coords.longitude];
							let GeolocaPosition = {
								latlng: {
									lat: position.coords.latitude,
									lng: position.coords.longitude,
								}
							};
							this.addMarker(GeolocaPosition)
						},
						error => {
							console.error(error);
						}
				);
			}
		},

		setIcon(marker) {
			return icon(marker)
		}

	},
};
</script>

<style scoped>
#map {
	height: 100vh;
	width: 100%;
}


#img1:active, #img2:active, #img3:active {
	border: solid red 2px !important;
}

#img1:hover, #img2:hover, #img3:hover {
	border: solid blue 2px;
}

#img1, #img2, #img3 {
	cursor: pointer;
}
</style>
