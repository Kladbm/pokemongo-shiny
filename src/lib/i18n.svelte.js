import { set_item, get_item, } from '@lib/u.svelte.js';

const dictionaries = {
	'nickname': {
		'en': 'Nickname',
		'zh': '暱稱',
		'de': 'Nickname',
		'it': 'Nickname',
	},
	'status.none': {
		'en': 'Unregistered',
		'zh': '無緣',
	},
	'status.met': {
		'en': 'Registered',
		'zh': '見過',
	},
	'status.own': {
		'en': 'Owned',
		'zh': '持有',
	},
	'status.extra': {
		'en': 'Extra',
		'zh': '有餘',
	},
	'status.trade': {
		'en': 'Pending Trade',
		'zh': '待交換',
	},
	'status.released': {
		'en': 'Released',
		'zh': '已亮相',
	},
	'order': {
		'en': 'Order',
		'zh': '排序',
	},
	'order.by.group': {
		'en': 'Order by group',
		'zh': '以家族排序',
	},
	'order.by.dex': {
		'en': 'Order by pokedex',
		'zh': '以圖鑑序排序',
	},
	'order.by.time': {
		'en': 'Order by time',
		'zh': '以時間排序',
	},
	'order.dex.range': {
		'en': 'Pokedex range',
		'zh': '圖鑑範圍',
	},
	'tag': {
		'en': 'Tag',
		'zh': '標籤',
	},
	'tag.union_selected': {
		'en': '[Union] - Intersection',
		'zh': '[聯集] 交集',
	},
	'tag.intersection_selected': {
		'en': 'Union - [Intersection]',
		'zh': '聯集 [交集]',
	},
	'tag.invert_selection': {
		'en': 'Invert',
		'zh': '反選',
	},
	'record': {
		'en': 'Record',
		'zh': '紀錄',
	},
	'record.save': {
		'en': 'Save',
		'zh': '儲存',
	},
	'record.remove': {
		'en': 'Remove',
		'zh': '刪除',
	},
	'record.remove.confirm': {
		'en': '【{name}】 will be deleted. \nAre you sure want to *DELETE* this record?',
		'zh': '【{name}】 將被刪除. \n你是否確認要刪除該筆紀錄？',
	},
	'record.reset': {
		'en': 'Reset',
		'zh': '重置',
	},
	'record.reset.accidentally.confirm': {
		'en': 'You accidentally clicked to delete all records, right?',
		'zh': '你是不小心按到[刪除所有紀錄的，對吧？',
	},
	'record.reset.confirm': {
		'en': 'This will actually delete *all* records, are you sure?',
		'zh': '接下來會刪除*所有*紀錄，你確定嗎？',
	},
	'share': {
		'en': 'Share',
		'zh': '分享',
	},
	'share.intro': {
		'en': 'Share or bookmarklet with url.',
		'zh': '藉由網址分享或加入書籤',
	},
	'share.full.url': {
		'en': 'Full url',
		'zh': '完整網址',
	},
	'share.short.link': {
		'en': 'Short url',
		'zh': '短網址',
	},
	'share.get.short.url': {
		'en': 'Get short url',
		'zh': '取得短網址',
		'de': 'Kurze URL erhalten',
		'it': 'Ottieni URL veloce',
	},
	'remove.record': {
		'en': 'Remove 【 {title} 】?',
		'zh': '刪除 【 {title} 】？',
	},
	'export': {
		'en': 'Export',
		'zh': '匯出',
	},
	'export.print': {
		'en': 'Print',
		'zh': '列印',
	},
	'export.as.csv': {
		'en': 'Export as CSV',
		'zh': '匯出為CSV',
	},
	'custom': {
		'en': 'Custom',
		'zh': '自訂',
	},
	'custom.style': {
		'en': 'Style',
		'zh': '樣式',
	},
	'custom.main_color': {
		'en': 'Front color',
		'zh': '前景色',
	},
	'custom.main_bgc': {
		'en': 'Background color',
		'zh': '背景色',
	},
	'custom.gradient_colors': {
		'en': 'Gradient colors of page header',
		'zh': '頁首漸變顏色',
	},
	'custom.grid_color': {
		'en': 'Grid colors',
		'zh': '格子顏色',
	},
	'custom.grid_color.thin': {
		'en': 'thin',
		'zh': '細框',
	},
	'custom.grid_color.border': {
		'en': 'border',
		'zh': '邊框',
	},
	'custom.grid_color.marker': {
		'en': 'marker',
		'zh': '標記',
	},
	'custom.grid_color.trade': {
		'en': 'pending trade border',
		'zh': '待交換邊框',
	},
	'custom.maxwidth': {
		'en': 'Max width',
		'zh': '最大寬度',
	},
	'custom.grid_size': {
		'en': 'Grid size',
		'zh': '格子尺寸',
	},
	'custom.data_source': {
		'en': 'Custom data source',
		'zh': '自訂資料來源',
	},
	'custom.confirm_for_reloading_to_apply': {
		'en': 'Reload to apply new data source?',
		'zh': '重新載入以套用新資料來源？',
	},
	'custom.default': {
		'en': 'Default',
		'zh': '預設',
	},
	'custom.reset_all_config': {
		'en': 'RESET all config',
		'zh': '重置全部設定',
	},
	'image.diff': {
		'en': 'Compare images when hover',
		'zh': '懸停時比對圖片',
	},
	'show.suffix': {
		'en': 'Show suffix name',
		'zh': '顯示名稱註記',
	},
	'show.name': {
		'en': 'Show name',
		'zh': '顯示名稱',
	},
	'lang': {
		'en': 'Language',
		'zh': '語系',
		'de': 'Sprache',
		'it': 'linguaggio',
		'fr': '',
		'ja': '',
		'ko': '',
	},
};

const available_langs = [...new Set(
	Object.values(dictionaries).flatMap(_i => Object.keys(_i))
)];

let _current_lang = $state(get_initial_lang());

// check missing translations under dev-mode
if (import.meta.env.DEV) {
	const missing = [];

	for (const [key, translations] of Object.entries(dictionaries)) {
		available_langs.forEach(lang => {
			if (!translations[lang]) {
				missing.push(`${lang}: ${key}`);
			}
		});
	}

	if (missing.length > 0) {
		console.warn('i18n: Missing translations detected:', missing);
	}
}

export const i18n = {
	get langs() {
		return available_langs;
	},
	get lang() {
		return _current_lang;
	},
	set lang(val) {
		if (available_langs.includes(val)) {
			_current_lang = val;
			set_item('lang', val); // Save to storage whenever lang changes
			console.log('Language changed to:', val);
		}
	},

	get t() {
		return (key) => {
			const _entry = dictionaries[key];
			// Priority: Current -> English -> Key itself
			return _entry?.[_current_lang] || _entry?.['en'] || key;
		};
	}
};

// Determine initial language (Priority: Storage > Browser > Fallback)
function get_initial_lang() {
	const _stored = get_item('lang');
	if (_stored && available_langs.includes(_stored)) return _stored;

	// Detect browser language (e.g., 'zh-TW' -> 'zh')
	const _browser_lang = navigator.language?.split('-').shift();
	return available_langs.includes(_browser_lang) ? _browser_lang : 'en';
};