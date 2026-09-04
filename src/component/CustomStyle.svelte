<script>
	import { i18n } from '@lib/i18n.svelte.js';
	import { config, DEFAULT_CONFIG, reset_all_config } from '@lib/config.svelte.js';

	function reset_main_colors() {
		config.main_color = DEFAULT_CONFIG.main_color;
		config.main_bgc = DEFAULT_CONFIG.main_bgc;
	}
	function reset_grid_colors() {
		config.grid_colors = [...DEFAULT_CONFIG.grid_colors];
	}
	function reset_gradient_colors() {
		console.log('reset_gradient_colors');
		config.gradient_colors = [...DEFAULT_CONFIG.gradient_colors];
	}
	function reset_data_source() {
		config.source_url = {...DEFAULT_CONFIG.source_url};
	}

</script>

<div>
	<ul>

		<li data-marker="🎨" class="">
			<div class="flex jc-c ai-e">
				<label>
					{i18n.t('custom.main_color')}
					<br>
					<input type="color" bind:value={config.main_color}>
				</label>
				<label>
					{i18n.t('custom.main_bgc')}
					<br>
					<input type="color" bind:value={config.main_bgc}>
				</label>
				<input type="reset" onclick={reset_main_colors} style="margin-left:auto">
			</div>

		</li>

		<hr>

		<li data-marker="↔" class="">
			{i18n.t('custom.maxwidth')} /px
			<div class="flex ai-c">
				<input type="range" min="300" max="2000" bind:value={config.maxwidth} style="width: 10em">
				<input type="number" min="300" max="2000" bind:value={config.maxwidth} style="width: 5em">
			</div>
		</li>

		<hr>

		<li data-marker="🧱" class="">
			<label class="flex">
				{i18n.t('custom.grid_size')}：
				<input type="number" min="48" max="256" bind:value={config.grid_size}>/px
			</label>
		</li>

		<hr>

		<li data-marker="🎨" class="">
			{i18n.t('custom.grid_color')}

			<div class="flex ai-e">
				<label>
					{i18n.t('custom.grid_color.thin')}
					<br>
					<input type="color" bind:value={config.grid_colors[0]}>
				</label>

				<label>
					{i18n.t('custom.grid_color.border')}
					<br>
					<input type="color" bind:value={config.grid_colors[1]}>
				</label>

				<label>
					{i18n.t('custom.grid_color.marker')}
					<br>
					<input type="color" bind:value={config.grid_colors[2]}>
				</label>

				<label>
					{i18n.t('custom.grid_color.trade')}
					<br>
					<input type="color" bind:value={config.grid_colors[3]}>
				</label>

				<input type="reset" onclick={reset_grid_colors} style="margin-left:auto">
			</div>
		</li>

		<hr>

		<li data-marker="🌌">
			{i18n.t('custom.gradient_colors')}
			<div class="flex jc-c ai-c">
				<input type="color" bind:value={config.gradient_colors[0]}>
				<input type="color" bind:value={config.gradient_colors[1]}>
				<input type="reset" onclick={reset_gradient_colors} style="margin-left:auto">
			</div>
		</li>

		<hr>

		<hr>

		<div class="flex">
			<button onclick={reset_all_config} style="margin: auto;">
				{i18n.t('custom.reset_all_config')}
			</button>
		</div>
	</ul>
</div>


<style>
	li {
		margin-bottom: 1em;

		&::marker {
			content: attr(data-marker) ' ';
		}
	}

	input[type="color"] {
		width: 4em;
	}
	.flex.jc-c,
	.flex.ai-e,
	.flex.ai-c {
		gap: .5em;
	}
</style>