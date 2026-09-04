<script>
	import { pokemonStore, get_name, } from '@lib/pm.svelte.js';
	import { i18n } from '@lib/i18n.svelte.js';
	import { config } from '@lib/config.svelte.js';
	import { get_pm_img_src, STATUS_COUNT, } from '@lib/u.svelte.js';

	let { pm, } = $props();

	let pm_name = $derived(get_name(pm.name, i18n.lang));
	let title = $derived(`#${pm.dex} ${pm_name} \n@${pm.debut}`);

	let tags_class = pm.tag.map(tag => ` tag-${tag}`).join('');
	let src = get_pm_img_src(pm.pid, true, pm.src);
	let src0 = get_pm_img_src(pm.pid, false, pm.src /* TODO */ );

	function handle_click_pm() {
		pm.status = (pm.status + 1) % STATUS_COUNT;
	}

</script>



<button class="pm status-{pm.status}"
	class:img_diff={config.img_diff}
	class:show_name={config.show_name}
	type="button"
	data-pid={pm.pid}
	aria-label="Pokemon {pm_name}, status {pm.status}"
	style="--group-order:{pm.order || 0}; --dex-order:{pm.dex};"
	title={title}
	onclick={handle_click_pm}
>
	<div class="img-box" style="--w: 140%; --t:-30%; --l: -5%; {pm.style}">

		{#if config.img_diff}
			<img
				width="96"
				height="96"
				src={src0}
				alt={title}
				loading="lazy"
			/>
		{/if}
		<img
			width="96"
			height="96"
			src={src}
			alt={title}
			loading="lazy"
		/>
	</div>

	<div class="caption">
		<div class="name" hidden={!config.show_name}>
			{pm_name}

			{#if config.show_suffix}
				<div class="suffix">{pm.suffix}</div>
			{/if}
		</div>

		<div class="dex">
			#{pm.dex}
		</div>
	</div>

</button>



<style>
@layer component {
	img {
		font-family: inherit;
		position: relative;
		position: absolute;

		top: var(--t, -30%);
		left: var(--l, -5%);
		width: var(--w, 140%);

		height: auto;
		aspect-ratio: 1;
		max-width: unset;
		object-fit: fill;

		&::before {
			content: '';
			position: absolute;
			background-color: #ccc;
			inset: 0;
			box-shadow: inset 0 0 2px;
		}

		&::after {
			content: '\2639' '\A' attr(alt);
			position: absolute;
			inset: 0;
			z-index: 2;
			white-space: pre-wrap;
			place-content: center;
			text-align: center;
		}
	}

	.img-box {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;

		img {
			display: block;
		}

		img + img {
			transition: opacity 0.3s;
		}

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			pointer-events: none;
			box-shadow: inset 0 0 0 1px #ddd;
			border-radius: inherit;
			background-size: 100% 75%;
			background-repeat: no-repeat;
			opacity: 0;
			color: var(--main-bgc);
			transition: opacity 1s;
			background-image: linear-gradient(currentcolor, #0000);
		}
		.pm.show_name:not(.img_diff):hover &::after {
			opacity: .8;
		}
	}

	.pm {
		break-inside: avoid;
		background-color: var(--main-bgc);
		width: var(--pm-grid-size, 96px);
		height: var(--pm-grid-size, 96px);
		order: var(--group-order);

		@media (max-width: 768px) {
			width: calc(var(--pm-grid-size) * .75);
			height: calc(var(--pm-grid-size) * .75);
		}
	}

	.pm:hover .name {
		opacity: 1;
	}
	.pm:hover .dex {
		opacity: 0.5;
	}

	.caption {
		position: absolute;
		z-index: 15;
		left: 2.5%;
		top: 1%;
		padding: .3em .25em;
		transition: opacity 0.3s;
		pointer-events: none;
	}

	.name {
		font-size: 10px;
		padding-left: 1px;
		text-align: left;
		opacity: 0.4;
		transition: opacity 0.3s;

		@media (max-width: 768px) {
			font-size: 12px;
		}

		.suffix {
			white-space: pre-wrap;
		}
	}

	.dex {
		text-align: start;
		font-size: 10px;
		opacity: 0;
		transition: opacity .3s;
	}

	.img_diff:hover {
		& .caption {
			opacity: 0;
		}

		& img + img {
			opacity: 0;
		}
	}
}

</style>
