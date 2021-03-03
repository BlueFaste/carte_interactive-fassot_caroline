<template>
	<div class="h-100">
		<l-map id="map" ref="myMap" :zoom="zoom" :center="center" @click="addMarker">
			<l-tile-layer :url="url"></l-tile-layer>
			<l-marker v-for="(el, id) in markerList" :lat-lng="el" :key="id" :icon="setIcon(el.options)"
								@click="showOptionsMarker(id)"></l-marker>
			<l-control>
				<b-button variant="primary" @click="getUserLocation">Localisez-moi</b-button>
			</l-control>

			<b-modal ref="modal-update-options-marker" id="modal-update-options-marker" title="Que voulez-vous faire avec ce marker" centered size="lg">
				<p>Choisissez la nouvelle icône :</p>
				<div class="d-flex flex-wrap justify-content-between">
					<b-img id="img1" fluid thumbnail :src="iconFirefox" width="200" size="sm" @click="newIcon=iconFirefox"></b-img>
					<b-img id="img2" fluid thumbnail :src="iconGoogle" width="200" size="sm" @click="newIcon=iconGoogle"></b-img>
					<b-img id="img3" fluid thumbnail :src="iconGenerale" width="200" size="sm" @click="newIcon=iconGenerale"></b-img>
				</div>

				<template #modal-footer>
					<b-button variant="danger" @click="removeMarker(idMarkerModified)">Supprimer le marker
					</b-button>
					<b-button variant="primary" @click="updateMarker(newIcon, idMarkerModified)">Modifier le marker
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

			//On met en place les 3 icones utilisables
			iconFirefox: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/714px-Google_Maps_icon_%282020%29.svg.png',
			iconGoogle: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
			iconGenerale: 'https://static.thenounproject.com/png/6399-200.png',

			// On préparpe la partie option de l'objet à envoyer en bdd
			options: {
				iconUrl: this.iconGenerale,
				iconSize: [32, 37],
				iconAnchor: [16, 37]
			},

			//On met de côté l'id du marker a modifier et le nouvel icon
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

			//On vérifie avec quel navigateur l'utilisateur est connecté et on change l'icône à envoyer en bdd selon le cas
			if (navigator.userAgent.includes('Firefox/')) {
				this.options.iconUrl = this.iconFirefox;
			} else if (navigator.userAgent.includes('Chrome/')) {
				this.options.iconUrl = this.iconGoogle;
			} else {
				this.options.iconUrl = this.iconGenerale;
			}

			//On met les options de l'icône dans l'objet que l'on envoi en bdd
			position.latlng.options = this.options;

			//On envoi en vdd
			this.$firebaseRefs.markerList.push(position.latlng);
		},

		removeMarker(idMarker) {

			//On récupère le marker d'après son id
			const marker = this.markerList[idMarker]
			const markerKey = marker['.key']

			//On demande une confirmation à l'utilisateur
			this.$bvModal.msgBoxConfirm("Voulez-vous supprimer le point?").then((confirmation) => {
				if (confirmation) {

					//On supprime le marker en bdd
					this.$firebaseRefs.markerList.child(markerKey).remove();

					//On ferme la modal qu'on a ouvert
					this.hideOptionsMarker();
				}
			});
		},
		updateMarker(icon, id) {

			//On récupère le marker d'après son id
			let marker = this.markerList[id];

			//On change l'icône du marker avec celle choisi dans l'objet qu'on va renvoyer
			marker.options.iconUrl = icon

			//On update le marker dans la bdd
			this.$firebaseRefs.markerList.child(marker['.key']).update(marker).then(() => {
				console.log("Marker updated!");

				//On ferme la modal qu'on a ouvert
				this.hideOptionsMarker()
			});
		},

		showOptionsMarker(id) {

			//On stocke pour plus tard l'id du marker sur lequel on a cliqué
			this.idMarkerModified = id;

			//On ouvre la modal d'action
			this.$bvModal.show('modal-update-options-marker');
		},

		hideOptionsMarker() {
			//On ferme la modal d'action
			this.$bvModal.hide('modal-update-options-marker');
		},

		getUserLocation() {
			//On verifie la présence de la géolocalisation dans le navigateur
			if ("geolocation" in navigator) {
				//On récupère la localisation de l'utilisateur
				navigator.geolocation.getCurrentPosition(
						position => {
							// On position la carte sur la localisation de l'utilisateur
							this.$refs.myMap.mapObject.setView([position.coords.latitude, position.coords.longitude], 22);
							this.center = [position.coords.latitude, position.coords.longitude];

							//On prépare les données de localisation pour placer un nouveau marker
							let GeolocaPosition = {
								latlng: {
									lat: position.coords.latitude,
									lng: position.coords.longitude,
								}
							};

							//On ajout un marker sur la zone de géolocalisation
							this.addMarker(GeolocaPosition)
						},
						error => {
							console.error(error);
						}
				);
			}
		},

		setIcon(marker) {
			//Permet de personnaliser le marker return la fonction icon de leaflet
			return icon(marker)
		}

	},
};
</script>

<style scoped>
#map {
	height: 100%;
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
