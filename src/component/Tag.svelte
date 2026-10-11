<script>
	// import { ordered_style, get_item, set_item, } from '@lib/u.svelte.js';
	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { i18n } from '@lib/i18n.svelte.js';
	import { config } from '@lib/config.svelte.js';
	import { filter_manager } from '@lib/filter.svelte.js';

	let tags = $derived(
		Object.keys(pokemonStore.tags)
			.toSorted()
			.reduce((all, tag) => {
				const target = filter_manager.get_cate(tag);

				if (!all[target]) {
					all[target] = [];
				}

				all[target].push({
					label: tag,
					count: pokemonStore.tags[tag].length,
				});

				return all;
			}, {})
	);

</script>


<details class="tag-details" bind:open={config.open_tags}>
	<summary accesskey="t" class="hide-for-print">
		🏷️ {i18n.t('tag')}
	</summary>

	<form class="filter-box" hidden={!Object.keys(tags).length}>
		<div class="tag-cloud">
			{#each filter_manager.filter_cates as cate}
				<section class="tag-cate flex gap2">
					<h3 class="category-title">{cate}</h3>

					<div class="hr"></div>

					<div class="tag-list flex gap1">
						{#each tags[cate] as tag}
							<div style="position: relative">
								<button
									type="button"
									class="tag"
									aria-label="filter label {tag.label}, status: {filter_manager.filter_state[tag.label]}"
									data-state={filter_manager.filter_state[tag.label]}
									onclick={() => filter_manager.toggle_tag(tag.label, 1)}
								>
									<span aria-hidden="true">{tag.label}</span>
								</button>

								<button
									type="button"
									class="tag-minus"
									onclick={() => filter_manager.toggle_tag(tag.label, -1)}
								>
									⛔
								</button>
							</div>

						{/each}
					</div>
				</section>
			{/each}
		</div>

		<div class="tag-cloud-actions">
			<input type="reset" onclick={() => filter_manager.reset_filter()}>
		</div>
	</form>
</details>



<style>
.tag-cate {
	margin-bottom: 1rem;
}
.tag-list {
	flex-wrap: wrap;
}
.category-title {
	margin: 0;
}

.hr {
	border-right: 2px dashed color-mix(in srgb, var(--main-color), #0000 90%);
}

.tag {
	position: relative;
	display: inline-flex;
	place-items: center;
	border-radius: 1em;
	padding: .5em 1em;
	line-height: 1;
	border: 0;
	border-bottom: 3px solid #0000;
	cursor: pointer;
	text-transform: uppercase;
	color: #fff;
	background-color: #9999;
	text-shadow: 1px 1px 1px #0009;
	font-size: smaller;
	font-weight: 900;
	user-select: none;

	&::before {
		content: var(--symbol, '');
		position: absolute;
		top: 0;
		left: -.25em;
		z-index: 1;
	}

	&[data-state="1"] {
		--symbol: '➕';
		background-color: var(--pm-grid-color1, #990a);
		border-bottom-color: var(--pm-grid-color2, var(--main-color));
	}
	&[data-state="-1"] {
		--symbol: '➖';
		background-color: #6006;
		border-bottom-color: #9003;

		& span {
			filter: blur(1px);
		}
	}
}

.tag-minus {
	position: absolute;
	top: -.5em;
	right: -.5em;
	border: 0;
	opacity: 0;
  appearance: none;
  background: none;
	text-shadow: 1px 1px 1px #0009;
	/* cursor: not-allowed; */
	cursor: pointer;

	.tag-list > div:hover & {
		opacity: .5;
	}

	&.tag-minus.tag-minus:hover {
		opacity: 1;
	}

	&:active {
		margin-top: 2px;
	}
}

.tag-details {
	position: sticky;
	top: 0;
	top: -.25em;
	z-index: 100;
	margin: auto;
	background-color: color-mix(in srgb, var(--main-bgc), var(--panal-bgc, #6663) 50%);
	padding: 0 3vw;
	font-size: smaller;

	&[open] {
		--panal-bgc: #9996;
		padding-bottom: 1em;
		backdrop-filter: blur(5px);
	}

	summary {
		text-align: center;
		opacity: 0;
		transition: opacity .3s;
		padding: 0.5em 0;
		font-size: smaller;
	}

	&[open] summary,
	&:hover summary {
		opacity: 1;
	}
}

.tag-cloud {
	width: fit-content;
	margin: 0 auto;
}

.tag-cloud-actions {
	max-width: 70%;
	border-top: 1px dashed #0003;
	margin: .5em auto 0;
	padding-top: .5em;
	text-align: center;
}

.filter-box {
	margin: 0 auto;
	max-width: var(--max-width, 1200px);
}
</style>
