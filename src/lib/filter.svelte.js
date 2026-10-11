import { pokemonStore, } from '@lib/pm.svelte.js';
import { get_item, set_item, } from '@lib/u.svelte.js';

const custom_style_when_filtered = `
.pm-list {
	gap: 1em;
}
.pm-group.pm-group {
	display: contents;
}
.pm-group .pm {
	order: var(--dex-order);
}`;

const LEGACY_TAG_NAMES = {
	baby: '🏷️baby',
	costume: '🏷️costume',
};

function migrate_filter_state(filter_state = {}) {
	return Object.fromEntries(
		Object.entries(filter_state).map(([tag, state]) => [LEGACY_TAG_NAMES[tag] || tag, state])
	);
}

class FilterManager {
	filter_cates = ['🧬', '📍', '🐣', '🏷️', '🧩'];
	filter_state = $state(migrate_filter_state(get_item('filter_state') || {}));

	reset_filter() {
		console.log(111, 'reset');
		this.filter_state = {};
	}

	toggle_tag(label = '', toggle_value = 1) {
		this.filter_state[label] = this.filter_state[label] === toggle_value ? 0 : toggle_value;
	}

	get_cate(tag = '') {
		const cate = tag.startsWith('🏷️') ? '🏷️' : [...tag][0];
		return this.filter_cates.includes(cate) ? cate : '🧩';
	}

	/**
	 * generate css rules based on filter state
	 * @param {Map<string, string[]>} pid_with_tags - Map of pid to tag array
	 * @returns {string} - css string to be injected into <style>
	 */
	get_filter_css() {
		// console.log('get_filter_css', pokemonStore.pid_with_tags);

		if (!pokemonStore.pid_with_tags) {
			return;
		}

		Object.keys(this.filter_state);
		const _current_state = $state.snapshot(this.filter_state);


		// 1. prepare local rules for performance
		const _excludes = new Set();
		const _cates_map = new Map();

		// console.log(111, this.filter_state);

		for (const [_tag, _status] of Object.entries(this.filter_state)) {
			if (_status === -1) {
				_excludes.add(_tag);
			} else if (_status === 1) {
				const _cate = this.get_cate([..._tag][0]);
				if (!_cates_map.has(_cate)) _cates_map.set(_cate, new Set());
				_cates_map.get(_cate).add(_tag);
			}
		}

		const _active_cate_sets = Array.from(_cates_map.values());
		const _hide_list = [];


		// 2. hot loop using for...of for Map performance
		// _pid: string, _my_tags: string[]

		for (const [_pid, _my_tags] of pokemonStore.pid_with_tags) {
			let _is_match = true;

			// priority 1: global exclusion (AND logic)
			// check if any tag of this pokemon is in the exclude list
			if (_my_tags.some(_t => _excludes.has(_t))) {
				_is_match = false;
			}
			// priority 2: category filters (AND between cates, OR within cate)
			else if (_active_cate_sets.length > 0) {
				_is_match = _active_cate_sets.every(_target_set => {
					// OR logic: at least one tag must match this category's requirement
					return _my_tags.some(_t => _target_set.has(_t));
				});
			}

			if (!_is_match) _hide_list.push(_pid);
		}

		if (_hide_list.length === 0) return '';

		// 3. build efficient css selectors using attribute selectors
		// [data-pid="xxx"] handles pids with dots perfectly
		return _hide_list
			.map(_id => `.pm[data-pid="${_id}"]`)
			.join(',\n') + '{display:none !important;}' + custom_style_when_filtered;
	}
}

export const filter_manager = new FilterManager();

$effect.root(() => {
	$effect(() => {
		set_item('filter_state', $state.snapshot(filter_manager.filter_state));
	});
});
