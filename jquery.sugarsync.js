/*!
 * jQuery SugarSync 0.0.1
 * http://
 * https://www.sugarsync.com/
 * https://www.sugarsync.com/developer
 *
 * Copyright 2012 Riccardo Re
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api
 *
 * Depends:
 *	jquery.js
 */
 
(function( $ ){
	var _XMLparser=function(xml){
		var tmp=xml;
		return new function(tmp){
			try{
				this._oXml=$((typeof xml=='string' && $.isXMLDoc(xml)?$.parseXML(xml):xml));
			}catch(e){
				this._oXml=null;
			}
			this.get=function(value,bUseLeafs){
				var result=null;
				if( this._oXml ){
					var _aItem=this._oXml.find(value);
					var _aItemChildren=_aItem.children();
					result=[];
					if( _aItem.length > 1 ){
						for( var i=0;i<_aItem.length;i++){
							result.push( this.get(value + ':eq(' + i + ') ',true) );
						}
					} else if( _aItemChildren.length > 0 ) {
						var _oElement={};
						for( var i=0;i<_aItemChildren.length;i++){
							var _sTagName=_aItemChildren.eq(i).prop('tagName');
							_oElement[_sTagName]=this.get(value + ' ' + _sTagName);
						}
						if( bUseLeafs ){
							result=_oElement;
						} else {
							result.push( _oElement );
						}
					} else {
						result = _aItem.text();
					}
				}
				return ((isNaN(result)||result=='')?result:parseFloat(result));
			}
		}
	}
	
	var _oMethods = {
	//Init
		init : function( options ) {
			//Saving Options
			var _oSettings = $.extend( {
				username: null,
				password: null,
				accessKeyID: 'NTY2NDA4NDEzNTUzMDQxODU3MDY',
				applicationID: '/sc/5664084/491_43083142',
				privateAccessKey: 'MjE5OGMyMmVlNjAxNDZmNmJkZTM1MTY2OTE2N2UyZWI',
				refreshToken: null,
				accessToken: null,
				accessTokenExpiration: null,
				userResource: null
			}, options );

			return this.each(function(){
				var $this = $(this),
					data = $this.data('_sugarsync');
				if ( !data ){
					$(this).data('_sugarsync', _oSettings);
				}
			});
		},
	//Request Refresh Token
		requestRefreshToken : function(fCallback){
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			var _sXml = '<?xml version="1.0" encoding="UTF-8"?><appAuthorization><username>'+_oSettings.username+'</username><password>'+_oSettings.password+'</password><application>'+_oSettings.applicationID+'</application><accessKeyId>'+_oSettings.accessKeyID+'</accessKeyId><privateAccessKey>'+_oSettings.privateAccessKey+'</privateAccessKey></appAuthorization>';
			if( !_oSettings.refreshToken ){
				$.ajax({
					url: 'https://api.sugarsync.com/app-authorization',
					type: 'POST',
					processData: false,
					data: $.parseXML(_sXml), 
					contentType: 'application/xml; charset=UTF-8',
					success:$.proxy($this.sugarsync,$this,'_requestRefreshTokenSuccess',fCallback),
					error:$.proxy($this.sugarsync,$this,'_requestRefreshTokenError',fCallback)
				});
			} else if( fCallback ){
				fCallback();
			}
		},
		_requestRefreshTokenSuccess : function(fCallback, data, textStatus, jqXHR){
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			_oSettings.refreshToken=jqXHR.getResponseHeader('Location');
			$this.data('_sugarsync',_oSettings);
			if( fCallback ){
				fCallback();
			}
		},
		_requestRefreshTokenError : function(fCallback, jqXHR, textStatus, errorThrown){
			$.error( 'Unable to get REFRESH token: '+textStatus+' - '+errorThrown);
			if( fCallback ){
				fCallback();
			}
		},
	//Request Access Token
		requestAccessToken : function(fCallback){
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			if( !_oSettings.accessToken || ( (new Date().getTime()/1000) >= _oSettings.accessTokenExpiration ) ){
				var _sXml = '<?xml version="1.0" encoding="UTF-8"?><tokenAuthRequest><accessKeyId>'+_oSettings.accessKeyID+'</accessKeyId><privateAccessKey>'+_oSettings.privateAccessKey+'</privateAccessKey><refreshToken>'+_oSettings.refreshToken+'</refreshToken></tokenAuthRequest>';
				$.ajax({
					url: 'https://api.sugarsync.com/authorization',
					type: 'POST',
					processData: false,
					data: $.parseXML(_sXml), 
					contentType: 'application/xml; charset=UTF-8',
					success:$.proxy($this.sugarsync,$this,'_requestAccessTokenSuccess',fCallback),
					error:$.proxy($this.sugarsync,$this,'_requestAccessTokenError',fCallback)
				});
			} else if( fCallback ){
				fCallback();
			}
		},
		_requestAccessTokenSuccess : function(fCallback, data, textStatus, jqXHR){
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			_oSettings.accessToken=jqXHR.getResponseHeader('Location');
			var _oXMLresponse=_XMLparser(data);
			_oSettings.accessTokenExpiration=Date.parse(_oXMLresponse.get('expiration'))/1000;
			_oSettings.userResource=_oXMLresponse.get('user');
			$this.data('_sugarsync',_oSettings);
			if( fCallback ){
				fCallback();
			}
		},
		_requestAccessTokenError : function(fCallback, jqXHR, textStatus, errorThrown){
			$.error( 'Unable to get ACCESS token: '+textStatus+' - '+errorThrown);
			if( fCallback ){
				fCallback();
			}
		},
	//Get User Info
		getUserInfo : function(fCallback){
			return this.each(function(){
				var $this = $(this);
				$this.sugarsync('requestRefreshToken',
					$.proxy($this.sugarsync,$this,'requestAccessToken',
						$.proxy($this.sugarsync,$this,'_getUserInfoRequest',
							fCallback
						)
					)
				);
			})
		},
		_getUserInfoRequest : function(fCallback){
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			if( _oSettings.userResource ){
				var _sXml = '<?xml version="1.0" encoding="UTF-8"?>';
				$.ajax({
					url: _oSettings.userResource,
					type: 'GET',
					headers:{
						Authorization:_oSettings.accessToken
					},
					processData: false,
					contentType: 'application/xml; charset=UTF-8',
					success:$.proxy($this.sugarsync,$this,'_getUserInfoRequestSuccess',fCallback),
					error:$.proxy($this.sugarsync,$this,'_getUserInfoRequestError',fCallback)
				});
			} else if( fCallback ){
				$.error( 'Cannot find a user resource; something went wrong.' );
				fCallback();
			}
		},
		_getUserInfoRequestSuccess : function(fCallback, data, textStatus, jqXHR){
			var _oXMLresponse=_XMLparser(data);
			var _oResponse={
				username:_oXMLresponse.get('username'),
				nickname:_oXMLresponse.get('nickname'),
				quota:{
					limit:_oXMLresponse.get('quota limit'),
					usage:_oXMLresponse.get('quota usage'),
				},
				workspaces:_oXMLresponse.get('workspaces'),
				syncfolders:_oXMLresponse.get('syncfolders'),
				deleted:_oXMLresponse.get('deleted'),
				magicBriefcase:_oXMLresponse.get('magicBriefcase'),
				webArchive:_oXMLresponse.get('webArchive'),
				mobilePhotos:_oXMLresponse.get('mobilePhotos'),
				albums:_oXMLresponse.get('albums'),
				recentActivities:_oXMLresponse.get('recentActivities'),
				receivedShares:_oXMLresponse.get('receivedShares'),
				publicLinks:_oXMLresponse.get('publicLinks'),
				maximumPublicLinkSize:_oXMLresponse.get('maximumPublicLinkSize')
			};
			if( fCallback ){
				fCallback(_oResponse);
			}
		},
		_getUserInfoRequestError : function(fCallback, jqXHR, textStatus, errorThrown){
			$.error( 'Unable to get USER INFOs: '+textStatus+' - '+errorThrown);
			if( fCallback ){
				fCallback();
			}
		},
	//Get Folder Info
		getFolderInfo : function(sFolderResource,fCallback,oOptions){
			var _oSettings = $.extend({
				_sMethodType:'info'
			}, oOptions);
			return this.each(function(){
				var $this = $(this);
				$this.sugarsync('requestRefreshToken',
					$.proxy($this.sugarsync,$this,'requestAccessToken',
						$.proxy($this.sugarsync,$this,'_getFolder',
							sFolderResource,
							fCallback,
							_oSettings
						)
					)
				);
			})
		},
	//Get Folder Contents
		getFolderContents : function(sFolderResource,fCallback,oOptions){
			var _oSettings = $.extend({
				_sMethodType:'contents',
				type: null,
				start: 0,
				max: 500,
				order: 'name'
			}, oOptions);
			return this.each(function(){
				var $this = $(this);
				$this.sugarsync('requestRefreshToken',
					$.proxy($this.sugarsync,$this,'requestAccessToken',
						$.proxy($this.sugarsync,$this,'_getFolder',
							sFolderResource,
							fCallback,
							_oSettings
						)
					)
				);
			})
		},
	//Get Folder
		_getFolder : function(sFolderResource,fCallback,oOptions){
			return this.each(function(){
				var $this = $(this);
				$this.sugarsync('requestRefreshToken',
					$.proxy($this.sugarsync,$this,'requestAccessToken',
						$.proxy($this.sugarsync,$this,'_getFolderRequest',
							sFolderResource,
							fCallback,
							oOptions
						)
					)
				);
			})
		},
		_getFolderRequest : function(sFolderResource,fCallback,oOptions){
			if(!oOptions)oOptions={};
			if(!oOptions._sMethodType)oOptions._sMethodType='info';//info or content
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			if( _oSettings.userResource ){
				var _sXml = '<?xml version="1.0" encoding="UTF-8"?>';
				var _sUrl=sFolderResource;
				var _oData=null;
				switch(oOptions._sMethodType){
					case 'contents':
						_sUrl += '/contents';
						_oData={};
						if( typeof oOptions.type != 'undefined' && oOptions.type != null ){
							_oData.type = oOptions.type;
						}
						if( typeof oOptions.start != 'undefined' && oOptions.start != null ){
							_oData.start = oOptions.start;
						}
						if( typeof oOptions.max != 'undefined' && oOptions.max != null ){
							_oData.max = oOptions.max;
						}
						if( typeof oOptions.order != 'undefined' && oOptions.order != null ){
							_oData.order = oOptions.order;
						}
					break;
					case 'info':
					default:
					break;
				}
				$.ajax({
					url: _sUrl,
					type: 'GET',
					data: _oData,
					headers:{
						Authorization:_oSettings.accessToken
					},
					contentType: 'application/xml; charset=UTF-8',
					success:$.proxy($this.sugarsync,$this,'_getFolderRequestSuccess',oOptions,fCallback),
					error:$.proxy($this.sugarsync,$this,'_getFolderRequestError',oOptions,fCallback)
				});
			} else if( fCallback ){
				$.error( 'Cannot find a user resource; something went wrong.' );
				fCallback();
			}
		},
		_getFolderRequestSuccess : function(oOptions,fCallback, data, textStatus, jqXHR){
			var _oXMLresponse=_XMLparser(data);
			var _oResponse={};
			//Type: info
			switch(oOptions._sMethodType){
				case 'info':
					_oResponse={
						displayName:_oXMLresponse.get('displayName'),
						dsid:_oXMLresponse.get('dsid'),
						timeCreated:_oXMLresponse.get('timeCreated'),
						collections:_oXMLresponse.get('collections'),
						files:_oXMLresponse.get('files'),
						contents:_oXMLresponse.get('contents')
					};
				break;
				case 'contents':
				default:
					var _aDirList = _oXMLresponse.get('collection');
					if( !_aDirList ){
						_aDirList=[];
					}
					//Adding type directory
					for( var _iIndex in _aDirList){
						var _oElement=_aDirList[_iIndex];
						_oElement.type='folder';
					}
					var _aFileList = _oXMLresponse.get('file');
					if( !_aFileList ){
						_aFileList=[];
					}
					//Adding type file
					for( var _iIndex in _aFileList){
						var _oElement=_aFileList[_iIndex];
						_oElement.type='file';
					}
					_oResponse=_aDirList.concat(_aFileList);
				break;
			}
			if( fCallback ){
				fCallback(_oResponse);
			}
		},
		_getFolderRequestError : function(oOptions,fCallback, jqXHR, textStatus, errorThrown){
			$.error( 'Unable to get FOLDER INFOs: '+textStatus+' - '+errorThrown);
			if( fCallback ){
				fCallback();
			}
		},
	//download (Needs server side help to download a file)
/*
		download : function(sFileResource,fCallback,oOptions){
			return this.each(function(){
				var $this = $(this);
				$this.sugarsync('requestRefreshToken',
					$.proxy($this.sugarsync,$this,'requestAccessToken',
						$.proxy($this.sugarsync,$this,'_downloadRequest',
							sFileResource,
							fCallback
						)
					)
				);
			})
		},
		_downloadRequest : function(sFileResource,fCallback,oOptions){
			if(!oOptions)oOptions={};
			if(!oOptions.type)oOptions.type='info';//info or content
			var $this = $(this),
				_oSettings = $this.data('_sugarsync');
			if( _oSettings.userResource ){
				var _sXml = '<?xml version="1.0" encoding="UTF-8"?>';
				var _sUrl=sFileResource;
				$.ajax({
					url: _sUrl,
					type: 'GET',
					headers:{
						Authorization:_oSettings.accessToken
					},
					processData: false,
					contentType: 'application/xml; charset=UTF-8',
					success:$.proxy($this.sugarsync,$this,'_downloadRequestSuccess',oOptions,fCallback),
					error:$.proxy($this.sugarsync,$this,'_downloadRequestError',oOptions,fCallback)
				});
			} else if( fCallback ){
				$.error( 'Cannot find a user resource; something went wrong.' );
				fCallback();
			}
		},
		_downloadRequestSuccess : function(oOptions,fCallback, data, textStatus, jqXHR){
			if( fCallback ){
				fCallback();
			}
		},
		_downloadRequestError : function(oOptions,fCallback, jqXHR, textStatus, errorThrown){
			$.error( 'Unable to DOWNLOAD file: '+textStatus+' - '+errorThrown);
			if( fCallback ){
				fCallback();
			}
		},
*/
	//Destroy
		destroy : function( ){
			return this.each(function(){
				var $this = $(this),
					data = $this.data('_sugarsync');
				data.sugarsync.remove();
				$this.removeData('_sugarsync');
			})
		}
	};
	$.fn.sugarsync = function( method ) {
		if ( _oMethods[method] ) {
			return _oMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return _oMethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.sugarsync' );
		}
	};
})( jQuery );
