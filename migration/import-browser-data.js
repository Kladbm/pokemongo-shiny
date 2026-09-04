(() => {
	'use strict';

	const BACKUP_VERSION = 1;
	const APP_ID = 'pokemongo-shiny';
	const LOCAL_STORAGE_KEY = 'pm-shiny-26';
	const DATABASE_NAME = 'localforage';
	const STORE_NAME = 'keyvaluepairs';
	const RECORDS_KEY = 'pm-shiny-26-records';

	function chooseBackupFile() {
		return new Promise(resolve => {
			const input = document.createElement('input');
			let settled = false;
			const finish = file => {
				if (settled) return;
				settled = true;
				input.remove();
				resolve(file);
			};

			input.type = 'file';
			input.accept = 'application/json,.json';
			input.style.display = 'none';
			document.body.appendChild(input);
			input.addEventListener('change', () => finish(input.files?.[0] || null), { once: true });
			input.addEventListener('cancel', () => finish(null), { once: true });
			input.click();
		});
	}

	function validateBackup(backup) {
		if (!backup || backup.app !== APP_ID || backup.version !== BACKUP_VERSION) {
			throw new Error('This is not a compatible Pokémon Shiny backup.');
		}
		if (backup.localStorage !== null && typeof backup.localStorage !== 'string') {
			throw new Error('The settings section of the backup is invalid.');
		}
		if (backup.localStorage !== null) {
			let settings;
			try {
				settings = JSON.parse(backup.localStorage);
			} catch {
				throw new Error('The settings section does not contain valid JSON.');
			}
			if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
				throw new Error('The settings section does not contain an object.');
			}
		}
		if (!Array.isArray(backup.records)) {
			throw new Error('The saved lists section of the backup is invalid.');
		}
		const recordsAreValid = backup.records.every(record =>
			record &&
			typeof record.name === 'string' &&
			typeof record.status === 'string' &&
			Number.isFinite(record.time)
		);
		if (!recordsAreValid) {
			throw new Error('One or more saved lists are invalid.');
		}
	}

	function readRecords() {
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
					reject(error || new Error('Could not read the current saved lists.'));
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

	function writeRecords(records) {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DATABASE_NAME);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const database = request.result;
				let settled = false;
				const fail = error => {
					if (settled) return;
					settled = true;
					database.close();
					reject(error || new Error('Could not write the saved lists.'));
				};

				try {
					if (!database.objectStoreNames.contains(STORE_NAME)) {
						throw new Error('The application storage is not ready. Reload the site and try again.');
					}

					const transaction = database.transaction(STORE_NAME, 'readwrite');
					transaction.objectStore(STORE_NAME).put(records, RECORDS_KEY);
					transaction.onerror = () => fail(transaction.error);
					transaction.onabort = () => fail(transaction.error);
					transaction.oncomplete = () => {
						if (settled) return;
						settled = true;
						database.close();
						resolve();
					};
				} catch (error) {
					fail(error);
				}
			};
		});
	}

	function restoreLocalStorage(value) {
		if (value === null) {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
		} else {
			localStorage.setItem(LOCAL_STORAGE_KEY, value);
		}
	}

	async function importBackup() {
		const file = await chooseBackupFile();
		if (!file) {
			console.info('Import cancelled.');
			return;
		}

		const backup = JSON.parse(await file.text());
		validateBackup(backup);

		const confirmed = confirm(
			`Import ${backup.records.length} saved list(s) and replace this site's Pokémon Shiny settings?`
		);
		if (!confirmed) {
			console.info('Import cancelled.');
			return;
		}

		const previousLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
		const previousRecords = await readRecords();

		try {
			await writeRecords(backup.records);
			restoreLocalStorage(backup.localStorage);
		} catch (error) {
			try {
				await writeRecords(previousRecords);
				restoreLocalStorage(previousLocalStorage);
			} catch (rollbackError) {
				throw new Error(`${error.message} Rollback also failed: ${rollbackError.message}`);
			}
			throw error;
		}

		alert(`Imported ${backup.records.length} saved list(s). The page will now reload.`);
		location.reload();
	}

	importBackup().catch(error => {
		console.error('Could not import Pokémon Shiny data.', error);
		alert(`Import failed: ${error.message}`);
	});
})();
