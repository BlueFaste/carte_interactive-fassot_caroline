<template>
	<div id="container">
		<myMap/>
	</div>
</template>

<script>
import myMap from "./view/Map";

export default {
	name: "app",
	components: {
		myMap,
	},
};
</script>

<style>
html,
body,
#container {
	margin: 0;
	padding: 0;
	height: 100%;
	width: 100%;
}
</style>
