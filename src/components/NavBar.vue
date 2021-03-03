<template>
	<b-navbar toggleable="lg" type="dark" variant="dark">
		<b-navbar-brand href="https://carolinefassot.myportfolio.com/" target="_blank">
			<b-img center style="width: 4rem" src="https://pro2-bar-s3-cdn-cf6.myportfolio.com/d243d812-1677-464e-999c-1697d600dbf4/75463ccd-76f6-4725-a27c-36983a409b4e_rwc_0x0x716x676x4096.png?h=7c266ba5281753c6cd1a396d965071f9"></b-img>
		</b-navbar-brand>

		<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

		<b-collapse id="nav-collapse" is-nav>
			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<b-nav-item>
					<router-link to="/list">
						<b-button>Liste</b-button>
					</router-link>
				</b-nav-item>
				<b-nav-item>
					<router-link to="/">
						<b-button>Carte</b-button>
					</router-link>
				</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
export default {
	name: "NavBar"
}
</script>

<style scoped>

</style>
