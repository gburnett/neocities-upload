neocities-upload
================

Upload local files to a [neocities](http://neocities.org) site.

Install
-------
```bash
npm install -g neocities-upload
```

Usage
-----
To upload local files to your neocities site:
```bash
neocities-upload
```
Input your neocities login credentials at the prompt.
This will upload any visible files in the current working directory to your neocities site.
Uploaded files will retain the names used locally and overwrite any existing file of the same name.
Success or failure is indicated in a string of json.
