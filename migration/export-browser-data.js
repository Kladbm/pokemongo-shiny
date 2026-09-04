(() => {
	'use strict';

	const BACKUP_VERSION = 1;
	const APP_ID = 'pokemongo-shiny';
	const LOCAL_STORAGE_KEY = 'pm-shiny-26';
	const DATABASE_NAME = 'localforage';
	const STORE_NAME = 'keyvaluepairs';
	const RECORDS_KEY = 'pm-shiny-26-records';

	async function readRecords() {
		if (typeof indexedDB.databases === 'function') {
			const databases = await indexedDB.databases();
			if (!databases.some(database => database.name === DATABASE_NAME)) {
				return [];
			}
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DATABASE_NAME);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const database = request.result;

				if (!database.objectStoreNames.contains(STORE_NAME)) {
					database.close();
					resolve([]);
					return;
				}

				let records = [];
				let settled = false;
				const fail = error => {
					if (settled) return;
					settled = true;
					database.close();
					reject(error || new Error('Could not read the saved lists.'));
				};

				try {
					const transaction = database.transaction(STORE_NAME, 'readonly');
					const recordsRequest = transaction.objectStore(STORE_NAME).get(RECORDS_KEY);

					recordsRequest.onsuccess = () => {
						records = recordsRequest.result || [];
					};
					recordsRequest.onerror = () => fail(recordsRequest.error);
					transaction.onerror = () => fail(transaction.error);
					transaction.onabort = () => fail(transaction.error);
					transaction.oncomplete = () => {
						if (settled) return;
						settled = true;
						database.close();
						resolve(records);
					};
				} catch (error) {
					fail(error);
				}
			};
		});
	}

	async function exportBackup() {
		const backup = {
			app: APP_ID,
			version: BACKUP_VERSION,
			exportedAt: new Date().toISOString(),
			sourceOrigin: location.origin,
			localStorage: localStorage.getItem(LOCAL_STORAGE_KEY),
			records: await readRecords(),
		};

		const contents = JSON.stringify(backup, null, 2);
		const blobUrl = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
		const link = document.createElement('a');
		const timestamp = backup.exportedAt.replace(/[:.]/g, '-');

		link.href = blobUrl;
		link.download = `${APP_ID}-backup-${timestamp}.json`;
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

		console.info(`Exported ${backup.records.length} saved list(s) from ${backup.sourceOrigin}.`);
		return backup;
	}

	exportBackup().catch(error => {
		console.error('Could not export Pokémon Shiny data.', error);
		alert(`Export failed: ${error.message}`);
	});
})();
