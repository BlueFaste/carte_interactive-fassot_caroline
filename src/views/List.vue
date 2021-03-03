<template>
	<div>
		<b-list-group>
			<b-list-group-item v-for="(marker, id) in markerList" :key="id">{{ id }} - clé: {{ marker['.key'] }}, latitude :
				{{ marker.lat }}, longitude: {{ marker.lng }}, icon :
				<img :src="marker.options.iconUrl" alt="" style="width: 1rem;"></b-list-group-item>
		</b-list-group>

	</div>
</template>

<script>
export default {
	name: "List",
	firebase() {
		return {
			markerList: this.$db.ref("/markerList/")
		};
	},
	data() {
		return {
			markerList: [],
		}
	}
}
</script>

<style scoped>

</style>
