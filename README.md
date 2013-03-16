jQuery SugarSync v0.0.2
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
$(selector).sugarsync([oOptions]);
```

+ `selector`
    The jQuery selector, targeting an element you'd like to use as a sugarsync plugin reference
+ `oOptions`
    An optional JavaScript object that you may pass if you would like to customize the experience with the plugin. Below is a list of properties that you may set on the options object and their respective effect.
    * `oOptions.username`
        - The username to use for the sugarsync service
    * `oOptions.password`
        - The password to use for the sugarsync service
	* `oOptions.applicationID` `{String: "using jQuery SugarSync's plugin"}`
        - A sugarsync's application ID ot use a custom application
    * `oOptions.accessKeyID` `{String: "using jQuery SugarSync's plugin"}`
        - A sugarsync's Access Key ID to use a custom application
    * `oOptions.privateAccessKey` `{String: "using jQuery SugarSync's plugin"}`
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
$(selector).sugarsync('getFolderContents', sFolderResource, fCallback, oOptions);
```

+ `selector`
    The jQuery selector, targeting an element you are using as sugarsync plugin reference
+ `sFolderResource`
    The string describing a folder resource
+ `fCallback`
    The callback function receiving a JavaScript object describing the folder contents as first parameter described by an array. Each element of the array is an object. The type property will determine if it's a directory or a file.
	* element `directory`
		- An array of directories inside the resource; each element of the array is a JavaScript object with the following parameters:
			- `type` constant string 'folder'
			- `displayName` the label
			- `ref` the folder resource
		
	* element `file`
		- An array of files inside the resource; each element of the array is a JavaScript object with the following parameters:
			- `type` constant string 'file'
			- `displayName` the label
			- `ref` the file resource
			- `size` the file size
			- `lastModified` the last time the file was modified
			- `mediaType` the file media type
			- `presentOnServer` a flag which shows if the file is present on the server
			- `fileData` the file data resource
+ `oOptions`
    An optional JavaScript object that you may pass if you would like to customize the behaviour of the current method. Below is a list of properties that you may set on the options object and their respective effect.
    * `oOptions.type` `{String: null}`
        - Set the filter you would like to use on the results; by default no filter is used; you can choose between:
			- `null` value to evade using filters
			- `folder` string; to receive only folders
			- `file` string; to receive only files
	* `oOptions.start` `{Integer: 0}`
		- Set the index within the indexed sequence of objects in the folder to start listing folder contents. The default value is 0, meaning that objects in the folder are listed starting with the first object in the sequence. However, you can specify any positive integer value for the starting index.
	* `oOptions.max` `{Integer: 500}`
        - The maximum number of results you'll receive. By default it's set on 500.
	* `oOptions.order` `{String: "name"}`
        - How to order the results; by default it's set on 'name'; the value can be choose between:
			- `name` sort by the display name of the items
			- `last_modified` sort by the last-modified date (if available) of the items
			- `size` sort by the size (in bytes) of the items
			- `extension` sort by the filename extension (if available) of the items
		
Notes
-----

Improvements
-----
A lot of enhancement can be done on this library.
Right now I am planning to add as soon as possible:
- File Creation
- Upload Data operation to create a file or a folder
- Download file operation

Change Log
----------
 * __0.0.2__
  - Updated "getFolderContents" method to return an array of objects where the type property determine if it's a folder or a file
  - Added options to "getFolderContents" method
  - Improved the test page
 
 * __0.0.1__
  - Commited on Git Hub first release