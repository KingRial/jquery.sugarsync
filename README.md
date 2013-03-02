jQuery SugarSync v0.0.1
=================
"jQuery SugarSync" is a jQuery Plugin to add SugarSync functionality (https://www.sugarsync.com/) to the jQuery Library (http://jquery.com/).

License
-------
Copyright 2012, Riccardo Re

Dual licensed under the MIT or GPL Version 2 licenses.

<http://jquery.org/license>

Usage
-----
```javascript
$(selector).sugarsync([options]);
```

+ `selector`
    The jQuery selector, targeting an element you'd like to use as a sugarsync plugin reference
+ `options`
    An optional JavaScript object that you may pass if you would like to customize the experience with the plugin. Below is a list of properties that you may set on the options object and their respective effect.
    * `options.username`
        - The username to use for the sugarsync service
    * `options.password`
        - The password to use for the sugarsync service
	* `options.applicationID` `{String: "using jQuery SugarSync's plugin"}`
        - A sugarsync's application ID ot use a custom application
    * `options.accessKeyID` `{String: "using jQuery SugarSync's plugin"}`
        - A sugarsync's Access Key ID to use a custom application
    * `options.privateAccessKey` `{String: "using jQuery SugarSync's plugin"}`
        - A sugarsync's private access key to use a custom application

```javascript
$(selector).sugarsync('getUserInfo',fCallback);
```

+ `selector`
    The jQuery selector, targeting an element you are using as sugarsync plugin reference
+ `fCallback`
    The callback function receiving a JavaScript object describing the user info as first parameter. Below is a list of properties which describe the user info.
	* `username`
        - The username
	* `nickname`
        - The nickname
	* `quota.limit`
        - The limit quota
	* `quota.usage`
        - The usage quota
	* `workspaces`
        - The workspace resource
	* `syncfolders`
        - The syncfolders resource
	* `deleted`
		- The deleted resource
	* `magicBriefcase`
		- The magicBriefcase resource
	* `webArchive`
		- The webArchive resource
	* `mobilePhotos`
		- The mobilePhotos resource
	* `recentActivities`
		- The recentActivities resource
	* `receivedShares`
		- The receivedShares resource
	* `publicLinks`
		- The publicLinks resource
	* `maximumPublicLinkSize`
		- The maximumPublicLinkSize number

```javascript
$(selector).sugarsync('getFolderInfo', sFolderResource, fCallback);
```

+ `selector`
    The jQuery selector, targeting an element you are using as sugarsync plugin reference
+ `sFolderResource`
    The string describing a folder resource
+ `fCallback`
    The callback function receiving a JavaScript object describing the folder info as first parameter. Below is a list of properties which describe the folder info.
	* `displayName`
		- The folder label
	* `dsid`
		- The folder dsid
	* `timeCreated`
		- The folder creation time
	* `collections`
		- The collections resource
	* `files`
		- The files resource
	* `contents`
		- The contents resource

```javascript
$(selector).sugarsync('getFolderList', sFolderResource, fCallback);
```

+ `selector`
    The jQuery selector, targeting an element you are using as sugarsync plugin reference
+ `sFolderResource`
    The string describing a folder resource
+ `fCallback`
    The callback function receiving a JavaScript object describing the folder contents as first parameter. Below is a list of properties which describe the folder contents.
	* `dirList`
		- An array of directories inside the resource; each element of the array is a JavaScript object with the following parameters:
			- `displayName` the label
			- `ref` the folder resource
		
	* `fileList`
		- An array of files inside the resource; each element of the array is a JavaScript object with the following parameters:
			- `displayName` the label
			- `ref` the file resource
			- `size` the file size
			- `lastModified` the last time the file was modified
			- `mediaType` the file media type
			- `presentOnServer` a flag which shows if the file is present on the server
			- `fileData` the file data resource

Notes
-----

Improvements
-----
A lot of enhancement can be done on this library.
Right now I am planning to add as soon as possible:
- Adding new options to getListContents function
- File Creation
- Upload Data operation to created file
- Download file operation

Change Log
----------
 * __0.0.1__
  - Commited on Git Hub first release