# Browser data migration

These scripts transfer the Pokémon Shiny application's settings and saved lists
between different site origins. They do not add controls to the application UI.

Only paste scripts that you trust into Developer Tools. Chrome may show its
standard self-XSS warning and ask you to confirm that console pasting is allowed.

## Export from the original site

1. Open <https://rplus.github.io/pokemongo-shiny/> in the browser where the
   lists are saved.
2. Open Developer Tools and select the Console tab.
3. Copy the complete contents of `export-browser-data.js` into the console and
   run it.
4. Keep the downloaded `pokemongo-shiny-backup-*.json` file.

## Import into the new site

1. Open the new GitHub Pages site and wait until the application has loaded.
2. Open Developer Tools and select the Console tab.
3. Copy the complete contents of `import-browser-data.js` into the console and
   run it.
4. Select the exported JSON file and confirm the replacement.
5. Allow the page to reload.

The backup contains the application value stored under `pm-shiny-26` and the
saved-list value stored under `pm-shiny-26-records` in localForage/IndexedDB.
No data belonging to other applications is read or changed.
