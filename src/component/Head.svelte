<script>
	// import date from '@data/latest-fetch-time.txt?raw';
	import { i18n } from '@lib/i18n.svelte.js';
	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { config, session } from '@lib/config.svelte.js';
	import { filter_manager } from '@lib/filter.svelte.js';

	// Dashboard status cards follow tag filters, but remain independent from the
	// visibility switches so they still describe the selected collection.
	let filtered_status_counts = $derived.by(() => {
		const hidden_pids = filter_manager.get_hidden_pids(pokemonStore.pid_with_tags);
		const counts = [0, 0, 0, 0, 0];

		pokemonStore.sorted_pms.forEach(pm => {
			if (!hidden_pids.has(pm.pid)) counts[Number(pm.status || 0)]++;
		});

		return counts;
	});

	let filtered_status_summary = $derived.by(() => {
		const counts = filtered_status_counts;
		return [
			{ label: 'none',  count: counts[0], },
			{ label: 'met',   count: counts[1] + counts[2] + counts[3], },
			{ label: 'own',   count: counts[2] + counts[3], },
			{ label: 'extra', count: counts[3], },
			{ label: 'trade', count: counts[4], },
		];
	});

	let filtered_status_percent = $derived.by(() => {
		const counts = filtered_status_counts;
		const total = counts.reduce((sum, count) => sum + count, 0);
		return {
			seen: total ? 100 * (counts[1] + counts[2] + counts[3]) / total : 0,
			captured: total ? 100 * (counts[2] + counts[3]) / total : 0,
		};
	});

	let custom_style = $derived(`
		--seen-percent:${filtered_status_percent.seen}%;
		--captured-percent:${filtered_status_percent.captured}%;
	`);
	// Release is the selected collection after disabled statuses are removed,
	// exactly like the cards currently visible in the grid.
	let released_count = $derived.by(() => {
		return filtered_status_counts.reduce((sum, count, status) =>
			sum + (config.status_visibility[status] ? count : 0), 0);
	});

</script>


<header style={custom_style}>

	<h1 class="font-size:1.3rem font-size:1.75rem@sm text-align:center margin:.5em|0|1em">
		✨
		<span class="mix-blend-mode:difference">
			Shiny Checklist
		</span>
	</h1>

	<div class="name-input">
		@
		<span contenteditable bind:textContent={session.name}></span>
	</div>


	<div class="dashboard">
		{#each filtered_status_summary as st, index}

			{#if index}
			/
			{/if}

			<label class="pm status-{index}" title={i18n.t(`status.${st.label}`)}>
				<div class="number">
					{st.count}
				</div>
				<div class="label">
					{i18n.t(`status.${st.label}`)}
				</div>
				<input
					type="checkbox"
					id="status_vis_{index}"
					name="status_visibility"
					value={index}
					bind:checked={config.status_visibility[index]}
					class="status_vis_checkbox sr-only-u"
				>
			</label>
		{/each}

		/

		<div class="pm summary-card" title={i18n.t('status.released')}>
			<input
				type="checkbox"
				class="status_vis_checkbox sr-only-u"
				checked
				disabled
			>
			<div class="number">
				{released_count}
			</div>
			<div class="label">
				{i18n.t('status.released')}
			</div>
		</div>
	</div>
</header>



<style>
	header {
		position: relative;
		padding: 1em 1em 3.5em;
		color: #fff;
		background-color: #330;
		background-image: linear-gradient(-230deg, var(--header-gc1, #000000), var(--header-gc2, #63452c));
	}

	header::after {
		content: '';
		position: absolute;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 0;
		height: .5rem;
		color: #fff3;
		background-image:
			linear-gradient(currentcolor, currentcolor),
			linear-gradient(currentcolor, currentcolor);
		background-size: var(--seen-percent) 100%, var(--captured-percent) 100%;
		background-repeat: no-repeat;
	}

	header::before {
		content: attr(data-update);
		position: absolute;
		top: 100%;
		right: .5em;
		font-size: small;
		font-family: monospace;
		padding: 0.25em;
		opacity: 0.5;
		mix-blend-mode:difference;
		transition: opacity 1.5s;
	}

	header:not(:hover)::before {
		opacity: 0.2;
	}

	h1 {
		font-size: 1.3rem;
		text-align: center;
		margin: .5em 0 1em;

		@media (min-width: 768px) {
			font-size: 1.75rem;
		}
	}

	.name-input {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 2;
		padding: .25em .25em;
		max-width: 80%;
		word-wrap: break-word;
		word-break: break-all;
		cursor: text;
		mix-blend-mode: difference;

		span[contenteditable] {
			padding-right: .5em;
			&:empty {
				padding-right: .8em;
			}
		}

		&:hover {
			background-color: #fff3;
		}
	}

	.pm {
		background-color: #fff3;
		--pm-border-width: 1.5px;
		--pm-marker-size: 25%;

		position: relative;
		width: 88px;
		height: 88px;
		display: block;
		aspect-ratio: 1;
		place-content: center;
		place-items: center;
		text-align: center;
		cursor: pointer;

		&::before,
		&::after {
		}
	}
	@media (max-width: 650px) {
		.dashboard {
			gap: min(1.25vw, .75em);
		}
		.pm {
			width: 70px;
			height: 70px;
		}
	}
	.pm:not(:has(input:checked)) {
		background-color: #fff0;

		& .number {
			filter: blur(3px);
		}
	}

	.dashboard {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: min(2vw, 1em);
		user-select: none;
		font-size: smaller;
	}

	.number {
		font-size: 1.2em;
	}

	.label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		padding: 0 2px;
		margin-top: .25em;
		font-size: smaller;
		text-transform: capitalize;
		opacity: 0.5;
	}

	.summary-card {
		cursor: default;
	}
</style>
