//Supported values are: iOS, iPad, iPhone, iPod, Android, WebOS, BlackBerry, Bada, MacOS, Windows, Linux and Other

if (Ext.os.is('MacOS') || Ext.os.is('Windows')) {
//if (Ext.os.is('iPad')) {
//if (Ext.os.is('iPhone')) {

	new Ext.application({		
		name: 'Speechify',

		requires: [ 
			'Ext.MessageBox',
			'Ext.TabPanel',
			'Ext.dataview.List',
			'Ext.field.*',
			'Ext.Img',
			'Ext.carousel.Carousel',
			'Ext.form.Panel',
			'Ext.data.TreeStore',
			'Ext.data.Model',
			'Ext.data.Store',
			'Ext.NestedList',
			'Ext.TitleBar',
			'Ext.Map',
			'Ext.Label',
			'Ext.Audio',
			'Ext.data.identifier.Uuid',
			'Ext.grid.*',
			'Ext.Ajax'
		],
		
		
		// Upon startup - launch() method

		launch: function() {

		
	//--------------------------------------
	//-------- GLOBAL VARIABLES ------------
	//--------------------------------------

	var displayLanguage = 'english';
	var outputLanguage = 'english';
	var userName = '';



	//---------------------------------------
	//-------------- MODEL ------------------
	//---------------------------------------


			Ext.define('UserDB', {
			    extend: 'Ext.data.Model',
			
				config: {
					fields: [
							{name: 'id', type: 'string'},
					       {name: 'userName', type: 'string'},
					       {name: 'emailAddress', type: 'string'},	
					       {name: 'fullName', type: 'string'}
					     ]
				} // end of config			
			});

			Ext.define('BookmarkDB', {
				extend: 'Ext.data.Model',

				config: {
					fields: [
						{name: 'timeImgPath', type: 'string'},
						{name: 'timeAudioPath', type: 'string'},
						{name: 'placeImgPath', type: 'string'},
						{name: 'placeAudioPath', type: 'string'},
						{name: 'taskImgPath', type: 'string'},
						{name: 'taskAudioPath', type: 'string'}
					]
				}
			});

	//---------------------------------------
	//------- DataStore with Model ----------
	//---------------------------------------

			var userStore = Ext.create('Ext.data.Store', {
				    model: 'UserDB',
				    storeId: 'userStore',
				    proxy: {
				        type: 'ajax',
				        url: 'http://codextreme-terabytes.rhcloud.com/database/query-all-user.php',
						reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});


				var bookmarkStore = new Ext.create('Ext.data.Store', {
				    model: 'BookmarkDB',
				    storeId: 'bookmarkStore',
				    proxy: {
				        type: 'ajax',
				        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
				        actionMethods: {
				            read: 'POST'
				        },
				        extraParams: {
				        	userName: userName
				        },
				        
				        reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});



	//---------------------------------------------
	//------- XTemplate for Bookmark Page ---------
	//---------------------------------------------å


			var itemTpl = new Ext.XTemplate(
				'<tpl for=".">',
					//'<div class="{[xindex % 2 === 0 ? "tempEven" : "tempOdd"]}">',
					'<div class="',
						'<tpl if="xindex % 2 === 0">lightTemplate"></tpl>',
						'<tpl if="xindex % 2 === 1">darkTemplate"></tpl>',
						//'<div class="bookmarkTask"><img src="resources/images/main/task/thumbnail/thumb-{taskImgPath}" width="1201" height="120" /></div>',
						'<div class="bookmarkTask"><img src="resources/images/web/main/task/thumbnail/thumb-{taskImgPath}" /></div>',
						'<div class="bookmarkPlace"><img src="resources/images/web/main/place/thumbnail/thumb-{placeImgPath}" /></div>',
						'<div class="bookmarkTime"><img src="resources/images/web/main/time/thumbnail/thumb-{timeImgPath}" /></div>',
						'<div class="bookmarkPlay"><img src="resources/images/web/bookmark/' + displayLanguage + '/playbutton.png" /></div>',
						'<div class="clearBoth"></div>',
					'</div>',
				'</tpl>'
	    	);




	//---------------------------------------
	//------- Creation of 3 Panels ----------
	//---------------------------------------

	//-------------------------------------------------------
	//------- Creation of 3 Hidden Audio xtype --------------
	//-------------------------------------------------------


		var listOfAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getPlaceAudio = Ext.getCmp('placeAudio');
							getPlaceAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'placeAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeAudio = Ext.getCmp('timeAudio');
							getTimeAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeAudio',
				hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	







		var listOfExpansionAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskExpansionAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
							getTimeExpansionAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeExpansionAudio',
				hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	


	//-----------------------------------------------------------------
	//------- Creation of TaskPanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		

		var listOfTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/web/main/sidebar/task-bg.png)'
			},
			id: 'listOfTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					id: 'portraitTaskMop',
					width: 254,
					height: 300,
					src: 'resources/images/web/main/task/' + displayLanguage + '/mop.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '1';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-mop.png');

										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/mop.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskCook',
					src: 'resources/images/web/main/task/' + displayLanguage + '/cook.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '2';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-cook.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');

										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/cook.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskScrub',
					src: 'resources/images/web/main/task/' + displayLanguage + '/scrub.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '3';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-scrub.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/scrub.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskSweep',
					src: 'resources/images/web/main/task/' + displayLanguage + '/sweep.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '4';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-sweep.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/sweep.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskVacuum',
					src: 'resources/images/web/main/task/' + displayLanguage + '/vacuum.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '5';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-vacuum.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/vacuum.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskWashToilet',
					src: 'resources/images/web/main/task/' + displayLanguage + '/washtoilet.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '6';
										getTaskThumb.setSrc('resources/images/web/main/task/thumbnail/thumb-task-washtoilet.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/washtoilet.wav');
									}
								}
							}
				
				}]	
			}]

		});















		var listOfExpansionTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/web/expansion/sidebar/task-bg.png)'
			},
			id: 'listOfExpansionTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					id: 'portraitExpansionTaskChangeClothing',
					width: 254,
					height: 300,
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/changeclothing.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '7';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-changeclothing.png');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/changeclothing.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskDrinkWater',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/drinkwater.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '8';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-drinkwater.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');

										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/drinkwater.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskEatFruits',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/eatfruits.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '9';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-eatfruits.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatfruits.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskEatNoodle',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/eatnoodle.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '10';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-eatnoodle.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatnoodle.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskGoForExercise',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/goforexercise.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '11';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-goforexercise.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/goforexercise.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskTakeMedicine',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/takemedicine.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '12';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-takemedicine.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takemedicine.wav');
									}
								}
							}
				
				}]	
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskTakeShower',
					src: 'resources/images/web/expansion/task/' + displayLanguage + '/takeshower.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '13';
										getTaskExpansionThumb.setSrc('resources/images/web/expansion/task/thumbnail/thumb-task-takeshower.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takeshower.wav');
									}
								}
							}
				}]	
			}]

		});








	//-----------------------------------------------------------------
	//------- Creation of PlacePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------


		var listOfPlacePanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/web/main/sidebar/place-bg.png)'
			},
					
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceBedroom',
					src: 'resources/images/web/main/place/' + displayLanguage + '/bedroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '1';
										getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-bedroom.png');
									
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/bedroom.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceKitchen',
					src: 'resources/images/web/main/place/' + displayLanguage + '/kitchen.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '2';
										getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-kitchen.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/kitchen.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceLivingrm',
					src: 'resources/images/web/main/place/' + displayLanguage + '/livingrm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '3';
										getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-livingrm.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/livingrm.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlacePlayroom',
					src: 'resources/images/web/main/place/' + displayLanguage + '/playroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '4';
										getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-playroom.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/playroom.wav');
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceStudy',
					src: 'resources/images/web/main/place/' + displayLanguage + '/study.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '5';
										getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-study.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/study.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceToilet',
					src: 'resources/images/web/main/place/' + displayLanguage + '/toilet.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getPlaceThumb = Ext.getCmp('placeThumb');
								getPlaceThumb.placeThumbId = '6';
								getPlaceThumb.setSrc('resources/images/web/main/place/thumbnail/thumb-place-toilet.png');
								
								var getPlaceAudio = Ext.getCmp('placeAudio');
								getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/toilet.wav');
							}
						}
					}
				}]
			}]

		});
		

	//-----------------------------------------------------------------
	//------- Creation of TimePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		var listOfTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/web/main/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},
			//cls: 'timePanelCss',
			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime2pm',
					src: 'resources/images/web/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '1';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime4pm',
					src: 'resources/images/web/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '2';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime6am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '3';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime7am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '4';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime8am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '5';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime9am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/9am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '6';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-9am.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTimeNow',
					src: 'resources/images/web/main/time/' + displayLanguage + '/now.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '7';
										getTimeThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-now.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
									}
								}
							}
				}]
			}]

		});












			var listOfExpansionTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/web/expansion/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},
			//cls: 'timePanelCss',
			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime2pm',
					src: 'resources/images/web/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '1';
										getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime4pm',
					src: 'resources/images/web/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '2';
										getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime6am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '3';
										getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime7am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '4';
										getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime8am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '5';
										getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime9am',
					src: 'resources/images/web/main/time/' + displayLanguage + '/9am.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
								getTimeExpansionThumb.timeThumbId = '6';
								getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-9am.png');

								var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
								getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
							}
						}
					}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTimeNow',
					src: 'resources/images/web/main/time/' + displayLanguage + '/now.png',
					listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
									getTimeExpansionThumb.timeThumbId = '7';
									getTimeExpansionThumb.setSrc('resources/images/web/main/time/thumbnail/thumb-time-now.png');
								
									var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
									getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
								}
							}
						}
				}]
			}]

		});
	//-----------------------------------------------------------------
	//------- Creation of MAINVIEW that holds: ----------------------------

	// Has a mainStepsPanel (card layout) that holds:
	// 1. listOfAudioPanel ------------------------------------------
	// 2. listOfTaskPanel ------------------------------------------
	// 3. listOfPlacePanel ------------------------------------------
	// 4. listOfTimePanel ------------------------------------------
	// Added to Viewport
	//-----------------------------------------------------------------



		var mainView = new Ext.create('Ext.TabPanel', {
			width: 1024,
			height: 680,
			//height: 768,
			centered: true,
			fullscreen: true,
			scrollable: true,
			
			tabBarPosition: 'bottom',

			items: [{
				title: 'Speechify',
				id: 'speechifyTabPanel',
				iconCls: 'iconSpeechify',
				items: [{
					xtype: 'titlebar',
					id: 'speechifyTitlebar',
					title: 'Speechify',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/web/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 1024,
					height: 680,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						flex: 1,
						id: 'sidebarexpansionpanel',
						cls: 'sidebarexpansionpanel',
						height: 699,
						width: 250,
						style: {
							backgroundImage: 'url(resources/images/web/expansion/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'taskExpansionThumb',
							taskThumbId: '0',
							margin: '10 0 0 80',
							src: 'resources/images/web/main/webthumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 20
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'timeExpansionThumb',
							margin: '0 0 0 80',
							timeThumbId: '0',
							src: 'resources/images/web/main/webthumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(1);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 150
						},
						{
							xtype: 'panel',
							id: 'pan_expansion_fav_weekly',
							layout : {
							    type  : 'hbox',
							    pack  : 'center',
							    align : 'middle'
							},
							items: [{
								xtype: 'image',
								width: 40,
								height: 40,
								margin: '0 0 10 0',
								id: 'btnExpansionFavourite',
								src: 'resources/images/web/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										}
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 40,
								height: 40,
								margin: '0 0 10 20',
								id: 'btnExpansionWeekly',
								src: 'resources/images/web/main/buttons/button-addweekly-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											

											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 231,
							height: 54,
							margin: '0 0 0 18',
							src: 'resources/images/web/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.play();

										//Start of hoiio incorporation
										
										var getTaskExpansionThumbId = Ext.getCmp('taskExpansionThumb').taskThumbId;
										
										var getTimeExpansionThumbId = Ext.getCmp('timeExpansionThumb').timeThumbId;

										if(getTimeExpansionThumbId === '0' || getTaskExpansionThumbId === '0') {
											// ignore sms sending
										} else {
											Ext.Ajax.request({
												url: 'http://codextreme-terabytes.rhcloud.com/database/hoiio.php',
												method: 'POST',

												params: {
													taskId: getTaskExpansionThumbId,
													timeId: getTimeExpansionThumbId,
													userName: userName
												},

												success: function(response) {
													//Ext.Msg.alert('Message Sent', response.responseText);
												}
											});
										}
										// end of hoiio

									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						flex: 3,
						items: [{
							xtype: 'panel',
							id: 'mainStepsExpansionPanel',
							layout: 'card',
							activeItem: 0,
							flex: 1,
							width: 780,
							height: 579,
							items: [listOfExpansionTaskPanel, listOfExpansionTimesPanel, listOfExpansionAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Chores',
				iconCls: 'home',
				id: 'choresTabPanel',
				items: [{
					xtype: 'titlebar',
					id: 'choresTitlebar',
					title: 'Chores',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/web/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 1024,
					height: 680,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						flex: 1,
						id: 'sidebarpanel',
						cls: 'sidebarpanel',
						height: 699,
						width: 250,
						style: {
							backgroundImage: 'url(resources/images/web/main/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'taskThumb',
							taskThumbId: '0',
							margin: '10 0 0 80',
							src: 'resources/images/web/main/webthumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 20
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'placeThumb',
							margin: '0 0 0 80',
							placeThumbId: '0',
							src: 'resources/images/web/main/webthumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/place-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(1);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 20
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'timeThumb',
							margin: '0 0 0 80',
							timeThumbId: '0',
							src: 'resources/images/web/main/webthumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(2);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 15
						},
						{
							xtype: 'panel',
							id: 'pan_fav_weekly',
							layout : {
							    type  : 'hbox',
							    pack  : 'center',
							    align : 'middle'
							},
							items: [{
								xtype: 'image',
								width: 40,
								height: 40,
								margin: '0 0 10 0',
								id: 'btnFavourite',
								src: 'resources/images/web/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use bookmark');
											} else {
												var getTaskThumb = Ext.getCmp('taskThumb');
												var getPlaceThumb = Ext.getCmp('placeThumb');
												var getTimeThumb = Ext.getCmp('timeThumb');

												var getTaskThumbId = getTaskThumb.taskThumbId;
												var getPlaceThumbId = getPlaceThumb.placeThumbId;
												var getTimeThumbId = getTimeThumb.timeThumbId;

												if((getTaskThumbId == '0') || (getPlaceThumbId == '0') || (getTimeThumbId == '0')) {
													Ext.Msg.alert('Error','Please fill in all fields');
												} else {
													// Perform a Ajax request to Insert Bookmarks
													Ext.Ajax.request({   
												        waitMsg: 'Please wait...',
												        //url: 'http://www.jeremyzhong.com/terabytes/http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        url: 'http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        params: {
												          task: "INSERTBOOKMARK",
												          userName: userName,
												          taskId: getTaskThumbId,
												          placeId: getPlaceThumbId,
												          timeId: getTimeThumbId
												        }      
												      });

													bookmarkStore.load();          // reload our datastore.

													var getBookmarkStoreList = Ext.getCmp('bookmarkView');
													getBookmarkStoreList.refresh();

													Ext.Msg.alert('Bookmark', 'Bookmark Added!');
												}
											}
											
										}
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 40,
								height: 40,
								margin: '0 0 10 20',
								id: 'btnWeekly',
								src: 'resources/images/web/main/buttons/button-addweekly-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											

											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 231,
							height: 54,
							margin: '0 0 0 18',
							src: 'resources/images/web/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.play();
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						flex: 3,
						items: [{
							xtype: 'panel',
							id: 'mainStepsPanel',
							layout: 'card',
							activeItem: 0,
							flex: 1,
							width: 780,
							height: 579,
							items: [listOfTaskPanel, listOfPlacePanel, listOfTimesPanel, listOfAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Favourites',
				id: 'favouriteTabPanel',
				iconCls: 'favorites_circle',
				style: {
					background: '#754d37'
				},
				items: [{
					xtype: 'titlebar',
					title: 'Favourites',
					id: 'favouriteTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/web/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
						
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}]
				},
				{
					xtype: 'image',
					width: 1024,
					height: 123,
					id: 'bookmarkBanner',
					src: 'resources/images/web/bookmark/' + displayLanguage + '/banner.png',
				},
				{
					xtype: 'panel',
					layout: 'fit',
					height: 460,
					width: 1030,
					scrollable: true,
					items: [{
						xtype: 'list',
						id: 'bookmarkView',
						store: bookmarkStore,
						baseCls: 'x-plain',
						itemTpl: itemTpl, // setting the XTemplate here
						listeners: {
		                        itemsingletap: function(bookmarkView, index, item, e){

		                            var bookmarkStore = bookmarkView.getStore();
		                            var rec = bookmarkStore.getAt(index);

		                            var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
		                            var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
		                            var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

		                          //  getBookmarkTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/' + rec.get('taskAudioPath'));
		                           // getBookmarkPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/' + rec.get('placeAudioPath'));
		                           // getBookmarkTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/' + rec.get('timeAudioPath'));

		                           

		                            getBookmarkTaskAudio.media.dom.src = 'resources/audio/task/' + outputLanguage + '/' + rec.get('taskAudioPath');
									getBookmarkTaskAudio.media.dom.load();

		                            getBookmarkPlaceAudio.media.dom.src = 'resources/audio/place/' + outputLanguage + '/' + rec.get('placeAudioPath');
									getBookmarkPlaceAudio.media.dom.load();

		                            getBookmarkTimeAudio.media.dom.src = 'resources/audio/time/' + outputLanguage + '/' + rec.get('timeAudioPath');
									getBookmarkTimeAudio.media.dom.load();


var task = Ext.create('Ext.util.DelayedTask', function() {
									         console.log('callback!');
									     });
									
									     task.delay(500); //the callback function will now be called after 1500ms



		                            getBookmarkTaskAudio.play();
		                        }
						    } // end of listneer
					}]
					
	            }, 
	            {
	            	xtype: 'audio',
					id: 'bookmarkTaskAudio',
					hidden: true,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
								getBookmarkPlaceAudio.play();
							}
						}
					}

	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkPlaceAudio',
					hidden: true,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getPlaceAudio = Ext.getCmp('bookmarkTimeAudio');
								getPlaceAudio.play();
							}
						}
					}
	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkTimeAudio',
					hidden: true,
					url: 'resources/audio/blank.wav'
	            }] // end of items
			},
			{
				title: 'Suggest',
				iconCls: 'mail',
				id: 'suggestTabPanel',
				items: [{
					xtype: 'titlebar',
					title: 'Suggest',
					id: 'suggestTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/web/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}] // end of item in toolbar		
				}, 
				{
					xtype: 'image',
					height: 582,
					width: 1024,
					id: 'suggestBanner',
					src: 'resources/images/web/suggest/' + displayLanguage + '/SuggestUI.png'
				}] // end of items
			},
			{
				title: 'Settings',
				id: 'settingTabPanel',
				iconCls: 'settings7',
				style: {
					//background: '#442a1a'
					background: '#764e36'
				},
				items: [{
					xtype: 'titlebar',
					title: 'Settings',
					id: 'settingTitlebar',
					style: {
						backgroundImage: 'url(resources/images/web/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
						
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/web/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/web/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}]
				},
				{
					xtype: 'image',
					width: 1024,
					height: 80,
					id: 'settingsBanner',
					src: 'resources/images/web/settings/' + displayLanguage + '/banner.png'
				},
				{
					xtype: 'panel',
					width: 1024,
					height: 570,
					layout: 'vbox',
					style: {
						backgroundImage: 'url(resources/images/web/settings/background.png)'
					},
					items: [{
						xtype: 'panel',
						height: 240,
						width: 1013,
						margin: '0 0 0 5',
						layout: 'hbox',
						id: 'translateFromPanel',
						style: {
							backgroundImage: 'url(resources/images/web/settings/' + displayLanguage + '/translate-from.png)'
						},
						items: [{
							xtype: 'image',
							height: 199,
							width: 155,
							margin: '65 0 0 40',
							src: 'resources/images/web/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "english";


										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Speechify');
										getSpeechifyTitlebar.setTitle('Speechify');

										getChoresTabPanel.tab.setTitle('Chores');
										getChoresTitlebar.setTitle('Chores');

										getFavouriteTabPanel.tab.setTitle('Favourites');
										getFavouriteTitlebar.setTitle('Favourites');

										getSuggestTabPanel.tab.setTitle('Suggest');
										getSuggestTitlebar.setTitle('Suggest');

										getSettingTabPanel.tab.setTitle('Settings');
										getSettingTitlebar.setTitle('Settings');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');

										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');

										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getPortraitTaskMop.setSrc('resources/images/web/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/web/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/web/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/web/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/web/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/web/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/web/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/web/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/web/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/web/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getSettingsBanner.setSrc('resources/images/web/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/web/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/web/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/web/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/web/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);


										var newTranslateFromPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);

										Ext.Msg.alert('Language Changed', 'Display Language: ENGLISH');

									}
								}
							}
						},
						{
							xtype: 'image',
							height: 199,
							width: 155,
							margin: '65 0 0 40',
							src: 'resources/images/web/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "chinese";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('翻譯');
										getSpeechifyTitlebar.setTitle('翻譯');

										getChoresTabPanel.tab.setTitle('家务');
										getChoresTitlebar.setTitle('家务');

										getFavouriteTabPanel.tab.setTitle('收藏');
										getFavouriteTitlebar.setTitle('收藏');

										getSuggestTabPanel.tab.setTitle('建议');
										getSuggestTitlebar.setTitle('建议');

										getSettingTabPanel.tab.setTitle('设置');
										getSettingTitlebar.setTitle('设置');

										


										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');

										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');

										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getPortraitTaskMop.setSrc('resources/images/web/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/web/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/web/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/web/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/web/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/web/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/web/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/web/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/web/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/web/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getSettingsBanner.setSrc('resources/images/web/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/web/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/web/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/web/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/web/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);


										var newTranslateFromPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);

										Ext.Msg.alert('Language Changed', 'Display Language: CHINESE');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 199,
							width: 155,
							margin: '65 0 0 40',
							src: 'resources/images/web/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "malay";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Menterjemahkan');
										getSpeechifyTitlebar.setTitle('Menterjemahkan');

										getChoresTabPanel.tab.setTitle('Kerja-kerja');
										getChoresTitlebar.setTitle('Kerja-kerja');

										getFavouriteTabPanel.tab.setTitle('Kegemaran');
										getFavouriteTitlebar.setTitle('Kegemaran');

										getSuggestTabPanel.tab.setTitle('Mencadangkan');
										getSuggestTitlebar.setTitle('Mencadangkan');

										getSettingTabPanel.tab.setTitle('Tetapan');
										getSettingTitlebar.setTitle('Tetapan');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');

										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');

										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/web/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getPortraitTaskMop.setSrc('resources/images/web/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/web/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/web/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/web/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/web/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/web/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/web/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/web/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/web/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/web/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/web/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/web/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/web/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/web/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/web/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/web/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/web/main/time/' + displayLanguage + '/now.png');

										getSettingsBanner.setSrc('resources/images/web/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/web/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/web/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/web/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/web/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);


										var newTranslateFromPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/web/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);


										Ext.Msg.alert('Language Changed', 'Display Language: MALAY');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 199,
							width: 155,
							margin: '65 0 0 40',
							src: 'resources/images/web/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 199,
							width: 155,
							margin: '65 0 0 40',
							src: 'resources/images/web/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						height: 240,
						width: 1013,
						layout: 'hbox',
						margin: '10 0 0 5',
						id: 'translateToPanel',
						style: {
							backgroundImage: 'url(resources/images/web/settings/' + displayLanguage + '/translate-to.png)'
						},
						items: [{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 25',
							src: 'resources/images/web/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getPlaceThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');

										outputLanguage = 'english';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getPlaceThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');

										outputLanguage = 'chinese';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getPlaceThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');

										outputLanguage = 'malay';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/cantonese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getPlaceThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');

										outputLanguage = 'cantonese';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());

									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '65 0 0 15',
							src: 'resources/images/web/settings/hokkien.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getPlaceThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/web/main/webthumb-default.png');

										outputLanguage = 'hokkien';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						}]

					}]
				}]
			}] // end of all items in mainView
		}); // end mainView Panel
			
		Ext.Viewport.add(mainView);
















		} // end of launch function
	});

}  // end of iPad/Webapp Deployment


















































































































/***********************************
********* IPAD DEPLOYMENT **********
************************************/









//else if (Ext.os.is('MacOS') || Ext.os.is('Windows')) {

else if(Ext.os.is('iPad')) {
//else if(Ext.os.is('iPhone')) {

	new Ext.application({		
		name: 'Speechify',

		requires: [
			'Ext.MessageBox',
			'Ext.TabPanel',
			'Ext.dataview.List',
			'Ext.field.*',
			'Ext.Img',
			'Ext.carousel.Carousel',
			'Ext.form.Panel',
			'Ext.data.TreeStore',
			'Ext.data.Model',
			'Ext.data.Store',
			'Ext.NestedList',
			'Ext.TitleBar',
			'Ext.Map',
			'Ext.Label',
			'Ext.Audio',
			'Ext.data.identifier.Uuid',
			'Ext.grid.*',
			'Ext.Ajax'

		],
		
		
		// Upon startup - launch() method

		launch: function() {

		
	//--------------------------------------
	//-------- GLOBAL VARIABLES ------------
	//--------------------------------------

	var displayLanguage = 'english';
	var outputLanguage = 'english';
	var userName = '';


	//---------------------------------------
	//-------------- MODEL ------------------
	//---------------------------------------


			Ext.define('UserDB', {
			    extend: 'Ext.data.Model',
			
				config: {
					fields: [
							{name: 'id', type: 'string'},
					       {name: 'userName', type: 'string'},
					       {name: 'emailAddress', type: 'string'},	
					       {name: 'fullName', type: 'string'}
					     ]
				} // end of config			
			});

			Ext.define('BookmarkDB', {
				extend: 'Ext.data.Model',

				config: {
					fields: [
						{name: 'timeImgPath', type: 'string'},
						{name: 'timeAudioPath', type: 'string'},
						{name: 'placeImgPath', type: 'string'},
						{name: 'placeAudioPath', type: 'string'},
						{name: 'taskImgPath', type: 'string'},
						{name: 'taskAudioPath', type: 'string'}
					]
				}
			});

	//---------------------------------------
	//------- DataStore with Model ----------
	//---------------------------------------

			var userStore = Ext.create('Ext.data.Store', {
				    model: 'UserDB',
				    storeId: 'userStore',
				    proxy: {
				        type: 'ajax',
				        url: 'http://codextreme-terabytes.rhcloud.com/database/query-all-user.php',
						reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});


				var bookmarkStore = new Ext.create('Ext.data.Store', {
				    model: 'BookmarkDB',
				    storeId: 'bookmarkStore',
				    proxy: {
				        type: 'ajax',
				        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
				        actionMethods: {
				            read: 'POST'
				        },
				        extraParams: {
				        	userName: userName
				        },
				        
				        reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});




	//---------------------------------------------
	//------- XTemplate for Bookmark Page ---------
	//---------------------------------------------å


			var itemTpl = new Ext.XTemplate(
				'<tpl for=".">',
					//'<div class="{[xindex % 2 === 0 ? "tempEven" : "tempOdd"]}">',
					'<div class="',
						'<tpl if="xindex % 2 === 0">iPadLightTemplate"></tpl>',
						'<tpl if="xindex % 2 === 1">iPadDarkTemplate"></tpl>',
						//'<div class="bookmarkTask"><img src="resources/images/main/task/thumbnail/thumb-{taskImgPath}" width="1201" height="120" /></div>',
						'<div class="iPadBookmarkTask"><img src="resources/images/iPad/main/task/thumbnail/thumb-{taskImgPath}" /></div>',
						'<div class="iPadBookmarkPlace"><img src="resources/images/iPad/main/place/thumbnail/thumb-{placeImgPath}" /></div>',
						'<div class="iPadBookmarkTime"><img src="resources/images/iPad/main/time/thumbnail/thumb-{timeImgPath}" /></div>',
						'<div class="iPadBookmarkPlay"><img src="resources/images/iPad/bookmark/' + displayLanguage + '/playbutton.png" /></div>',
						'<div class="clearBoth"></div>',
					'</div>',
				'</tpl>'
	    	);




	//---------------------------------------
	//------- Creation of 3 Panels ----------
	//---------------------------------------

	//-------------------------------------------------------
	//------- Creation of 3 Hidden Audio xtype --------------
	//-------------------------------------------------------


		var listOfAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskAudio',
				//hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getPlaceAudio = Ext.getCmp('placeAudio');
							getPlaceAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'placeAudio',
				//hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeAudio = Ext.getCmp('timeAudio');
							getTimeAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeAudio',
				//hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	





		var listOfExpansionAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskExpansionAudio',
				//hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
							getTimeExpansionAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeExpansionAudio',
				//hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	

	//-----------------------------------------------------------------
	//------- Creation of TaskPanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		

		var listOfTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/iPad/main/sidebar/task-bg.png)'
			},
			id: 'listOfTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					id: 'portraitTaskMop',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/mop.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '1';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-mop.png');

										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/mop.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskCook',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/cook.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '2';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-cook.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');

										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/cook.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskScrub',
					margin: '0 0 0 45',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/scrub.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '3';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-scrub.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/scrub.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskSweep',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/sweep.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '4';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-sweep.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/sweep.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitTaskVacuum',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/vacuum.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '5';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-vacuum.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/vacuum.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTaskWashToilet',
					src: 'resources/images/iPad/main/task/' + displayLanguage + '/washtoilet.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '6';
										getTaskThumb.setSrc('resources/images/iPad/main/task/thumbnail/thumb-task-washtoilet.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/washtoilet.wav');
									}
								}
							}
				
				}]	
			}]

		});








		var listOfExpansionTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/iPad/expansion/sidebar/task-bg.png)'
			},
			id: 'listOfExpansionTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					id: 'portraitExpansionTaskChangeClothing',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/changeclothing.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '7';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-changeclothing.png');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/changeclothing.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskDrinkWater',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/drinkwater.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '8';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-drinkwater.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');

										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/drinkwater.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskEatFruits',
					margin: '0 0 0 45',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/eatfruits.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '9';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-eatfruits.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatfruits.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskEatNoodle',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/eatnoodle.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '10';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-eatnoodle.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatnoodle.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTaskGoForExercise',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/goforexercise.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '11';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-goforexercise.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/goforexercise.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTaskTakeMedicine',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/takemedicine.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
								getTaskExpansionThumb.taskThumbId = '12';
								getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-takemedicine.png');
								
								var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
								getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takemedicine.wav');
							}
						}
					}
				
				}]	
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTaskTakeShower',
					src: 'resources/images/iPad/expansion/task/' + displayLanguage + '/takeshower.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '13';
										getTaskExpansionThumb.setSrc('resources/images/iPad/expansion/task/thumbnail/thumb-task-takeshower.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takeshower.wav');
									}
								}
							}
				}]	
			}]

		});



	//-----------------------------------------------------------------
	//------- Creation of PlacePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------


		var listOfPlacePanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPad/main/sidebar/place-bg.png)'
			},
					
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},

			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitPlaceBedroom',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/bedroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '1';
										getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-bedroom.png');
									
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/bedroom.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceKitchen',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/kitchen.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '2';
										getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-kitchen.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/kitchen.wav');
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitPlaceLivingrm',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/livingrm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '3';
										getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-livingrm.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/livingrm.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlacePlayroom',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/playroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '4';
										getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-playroom.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/playroom.wav');
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitPlaceStudy',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/study.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '5';
										getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-study.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/study.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitPlaceToilet',
					src: 'resources/images/iPad/main/place/' + displayLanguage + '/toilet.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getPlaceThumb = Ext.getCmp('placeThumb');
								getPlaceThumb.placeThumbId = '6';
								getPlaceThumb.setSrc('resources/images/iPad/main/place/thumbnail/thumb-place-toilet.png');
								
								var getPlaceAudio = Ext.getCmp('placeAudio');
								getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/toilet.wav');
							}
						}
					}
				}]
			}]

		});
		

	//-----------------------------------------------------------------
	//------- Creation of TimePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		var listOfTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPad/main/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},
			//cls: 'timePanelCss',
			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitTime2pm',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '1';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime4pm',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '2';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitTime6am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '3';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime7am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '4';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitTime8am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '5';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitTime9am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/9am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '6';
										getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-9am.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitTimeNow',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/now.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTimeThumb = Ext.getCmp('timeThumb');
								getTimeThumb.timeThumbId = '7';
								getTimeThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-now.png');
							
								var getTimeAudio = Ext.getCmp('timeAudio');
								getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
							}
						}
					}
				}]
			}]

		});





			var listOfExpansionTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPad/expansion/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 pack  : 'center',
				 align : 'middle'
			},
			//cls: 'timePanelCss',
			items: [{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTime2pm',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '1';
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime4pm',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '2';
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTime6am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '3';
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime7am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '4';
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTime8am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '5';
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 254,
					height: 300,
					id: 'portraitExpansionTime9am',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/9am.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
								getTimeExpansionThumb.timeThumbId = '6';
								getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-9am.png');

								var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
								getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
							}
						}
					}
				}]
			},
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 254,
					height: 300,
					margin: '0 0 0 45',
					id: 'portraitExpansionTimeNow',
					src: 'resources/images/iPad/main/time/' + displayLanguage + '/now.png',
					listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
									getTimeExpansionThumb.timeThumbId = '7';
									getTimeExpansionThumb.setSrc('resources/images/iPad/main/time/thumbnail/thumb-time-now.png');
								
									var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
									getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
								}
							}
						}
				}]
			}]

		});




	//-----------------------------------------------------------------
	//------- Creation of MAINVIEW that holds: ----------------------------

	// Has a mainStepsPanel (card layout) that holds:
	// 1. listOfAudioPanel ------------------------------------------
	// 2. listOfTaskPanel ------------------------------------------
	// 3. listOfPlacePanel ------------------------------------------
	// 4. listOfTimePanel ------------------------------------------
	// Added to Viewport
	//-----------------------------------------------------------------



		var mainView = new Ext.create('Ext.TabPanel', {
			width: 768,
			height: 1010,
			//height: 768,
			centered: true,
			fullscreen: true,
			scrollable: true,
			
			tabBarPosition: 'bottom',

			items: [{
				title: 'Speechify',
				id: 'speechifyTabPanel',
				iconCls: 'iconSpeechify',
				items: [{
					xtype: 'titlebar',
					id: 'speechifyTitlebar',
					title: 'Speechify',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPad/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																			
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 760,
					height: 918,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						
						id: 'sidebarexpansionpanel',
						cls: 'sidebarexpansionpanel',
						height: 918,
						width: 192,
						style: {
							backgroundImage: 'url(resources/images/iPad/expansion/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 80
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'taskExpansionThumb',
							taskThumbId: '0',
							margin: '10 0 0 50',
							src: 'resources/images/iPad/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 100
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'timeExpansionThumb',
							margin: '0 0 0 50',
							timeThumbId: '0',
							src: 'resources/images/iPad/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(1);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 250
						},
						{
							xtype: 'panel',
							id: 'pan_expansion_fav_weekly',
							layout : {
							    type  : 'hbox'
							    //pack  : 'center',
							    //align : 'middle'
							},
							items: [{
								xtype: 'image',
								id: 'btnExpansionFavourite',
								width: 65,
								height: 65,
								margin: '0 10 10 40',
								src: 'resources/images/iPad/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}

										} // end function
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 61,
								height: 61,
								margin: '0 0 10 0',
								src: 'resources/images/iPad/main/buttons/button-addweekly-disabled.png',
								id: 'btnExpansionWeekly',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 163,
							height: 38,
							margin: '20 0 0 30',
							src: 'resources/images/iPad/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.play();


										//Start of hoiio incorporation
										
										var getTaskExpansionThumbId = Ext.getCmp('taskExpansionThumb').taskThumbId;
										
										var getTimeExpansionThumbId = Ext.getCmp('timeExpansionThumb').timeThumbId;

										if(getTimeExpansionThumbId === '0' || getTaskExpansionThumbId === '0') {
											// ignore sms sending
										} else {
											Ext.Ajax.request({
												url: 'http://codextreme-terabytes.rhcloud.com/database/hoiio.php',
												method: 'POST',

												params: {
													taskId: getTaskExpansionThumbId,
													timeId: getTimeExpansionThumbId,
													userName: userName
												},

												success: function(response) {
													//Ext.Msg.alert('Message Sent', response.responseText);
												}
											});
										}
										// end of hoiio
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						//flex: 2,
						items: [{
							xtype: 'panel',
							id: 'mainStepsExpansionPanel',
							layout: 'card',
							activeItem: 0,
							//flex: 1,
							width: 576,
							height: 918,
							items: [listOfExpansionTaskPanel, listOfExpansionTimesPanel, listOfExpansionAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Chores',
				iconCls: 'home',
				id: 'choresTabPanel',
				items: [{
					xtype: 'titlebar',
					title: 'Chores',
					docked: 'top',
					id: 'choresTitlebar',
					style: {
						backgroundImage: 'url(resources/images/iPad/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 760,
					height: 918,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						//flex: 1,
						id: 'sidebarpanel',
						cls: 'sidebarpanel',
						height: 918,
						width: 192,
						style: {
							backgroundImage: 'url(resources/images/iPad/main/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 80
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'taskThumb',
							taskThumbId: '0',
							margin: '10 0 0 50',
							src: 'resources/images/iPad/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 100
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'placeThumb',
							margin: '0 0 0 50',
							placeThumbId: '0',
							src: 'resources/images/iPad/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/place-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(1);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 100
						},
						{
							xtype: 'image',
							width: 130,
							height: 130,
							id: 'timeThumb',
							margin: '0 0 0 50',
							timeThumbId: '0',
							src: 'resources/images/iPad/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(2);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 40
						},
						{
							xtype: 'panel',
							id: 'pan_fav_weekly',
							layout : {
							    type  : 'hbox'
							    //pack  : 'center',
							    //align : 'middle'
							},
							items: [{
								xtype: 'image',
								id: 'btnFavourite',
								width: 65,
								height: 65,
								margin: '0 10 10 40',
								src: 'resources/images/iPad/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use bookmark');
											} else {
												var getTaskThumb = Ext.getCmp('taskThumb');
												var getPlaceThumb = Ext.getCmp('placeThumb');
												var getTimeThumb = Ext.getCmp('timeThumb');

												var getTaskThumbId = getTaskThumb.taskThumbId;
												var getPlaceThumbId = getPlaceThumb.placeThumbId;
												var getTimeThumbId = getTimeThumb.timeThumbId;

												if((getTaskThumbId == '0') || (getPlaceThumbId == '0') || (getTimeThumbId == '0')) {
													Ext.Msg.alert('Error','Please fill in all fields');
												} else {
													// Perform a Ajax request to Insert Bookmarks
													Ext.Ajax.request({   
												        waitMsg: 'Please wait...',
												        //url: 'http://www.jeremyzhong.com/terabytes/http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        url: 'http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        params: {
												          task: "INSERTBOOKMARK",
												          userName: userName,
												          taskId: getTaskThumbId,
												          placeId: getPlaceThumbId,
												          timeId: getTimeThumbId
												        }      
												      });

													bookmarkStore.load();          // reload our datastore.

													var getBookmarkStoreList = Ext.getCmp('bookmarkView');
													getBookmarkStoreList.refresh();

													Ext.Msg.alert('Bookmark', 'Bookmark Added!');
												}
											} // end else
										} // end function
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 61,
								height: 61,
								margin: '0 0 10 0',
								src: 'resources/images/iPad/main/buttons/button-addweekly-disabled.png',
								id: 'btnWeekly',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 163,
							height: 38,
							margin: '20 0 0 30',
							src: 'resources/images/iPad/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.play();
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						//flex: 2,
						items: [{
							xtype: 'panel',
							id: 'mainStepsPanel',
							layout: 'card',
							activeItem: 0,
							//flex: 1,
							width: 576,
							height: 918,
							items: [listOfTaskPanel, listOfPlacePanel, listOfTimesPanel, listOfAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Favourites',
				id: 'favouriteTabPanel',
				iconCls: 'favorites_circle',
				style: {
					background: '#754d37'
				},
				items: [{
					xtype: 'titlebar',
					title: 'Favourites',
					id: 'favouriteTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPad/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
						
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}]
				},
				{
					xtype: 'image',
					width: 768,
					height: 130,
					id: 'bookmarkBanner',
					src: 'resources/images/iPad/bookmark/' + displayLanguage + '/banner.png',
				},
				{
					xtype: 'panel',
					layout: 'fit',
					height: 800,
					width: 768,
					scrollable: true,
					items: [{
						xtype: 'list',
						id: 'bookmarkView',
						store: bookmarkStore,
						baseCls: 'x-plain',
						itemTpl: itemTpl, // setting the XTemplate here
						listeners: {
		                        itemsingletap: function(bookmarkView, index, item, e){

		                            var bookmarkStore = bookmarkView.getStore();
		                            var rec = bookmarkStore.getAt(index);

		                            var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
		                            var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
		                            var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

		                            getBookmarkTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/' + rec.get('taskAudioPath'));
		                            getBookmarkPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/' + rec.get('placeAudioPath'));
		                            getBookmarkTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/' + rec.get('timeAudioPath'));

		                            getBookmarkTaskAudio.load();
		                            getBookmarkPlaceAudio.load();
		                            getBookmarkTimeAudio.load();


		                           // Ext.Msg.alert('Status', getBookmarkTaskAudio.getUrl());
		                           // Ext.Msg.alert('Status', getBookmarkPlaceAudio.getUrl());
		                           // Ext.Msg.alert('Status', getBookmarkTimeAudio.getUrl());


		                            getBookmarkTaskAudio.play();
		                        }
						    } // end of listneer
					}]
					
	            }, 
	            {
	            	xtype: 'audio',
					id: 'bookmarkTaskAudio',
					hidden: true,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
								getBookmarkPlaceAudio.play();
							}
						}
					}

	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkPlaceAudio',
					hidden: true,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getPlaceAudio = Ext.getCmp('bookmarkTimeAudio');
								getPlaceAudio.play();
							}
						}
					}
	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkTimeAudio',
					hidden: true,
					url: 'resources/audio/blank.wav'
	            }] // end of items
			},
			{
				title: 'Suggest',
				iconCls: 'mail',
				id: 'suggestTabPanel',
				items: [{
					xtype: 'titlebar',
					title: 'Suggest',
					id: 'suggestTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPad/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 500,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
											form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}] // end of item in toolbar	
				}, 
				{
					xtype: 'image',
					height: 918,
					width: 768,
					id: 'suggestBanner',
					src: 'resources/images/iPad/suggest/' + displayLanguage + '/SuggestUI.png'
				}] // end of items
			},
			{
				title: 'Settings',
				iconCls: 'settings7',
				id: 'settingTabPanel',
				style: {
					//background: '#442a1a'
					background: '#764e36'
				},
				items: [{
					xtype: 'titlebar',
					id: 'settingTitlebar',
					title: 'Settings',
					style: {
						backgroundImage: 'url(resources/images/iPad/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 200,
								width: 500,
								centered: true,
								id: 'speechifyForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
										form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
						
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPad/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPad/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}]
				},
				{
					xtype: 'image',
					width: 768,
					height: 130,
					id: 'settingsBanner',
					src: 'resources/images/iPad/settings/' + displayLanguage + '/banner.png'
				},
				{
					xtype: 'panel',
					width: 768,
					height: 790,
					layout: 'vbox',
					style: {
						backgroundImage: 'url(resources/images/iPad/settings/background.png)'
					},
					items: [{
						xtype: 'panel',
						height: 278,
						width: 748,
						margin: '0 0 0 5',
						layout: 'hbox',
						id: 'translateFromPanel',
						style: {
							backgroundImage: 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-from.png)'
						},
						items: [{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '80 0 0 30',
							src: 'resources/images/iPad/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "english";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Speechify');
										getSpeechifyTitlebar.setTitle('Speechify');

										getChoresTabPanel.tab.setTitle('Chores');
										getChoresTitlebar.setTitle('Chores');

										getFavouriteTabPanel.tab.setTitle('Favourites');
										getFavouriteTitlebar.setTitle('Favourites');

										getSuggestTabPanel.tab.setTitle('Suggest');
										getSuggestTitlebar.setTitle('Suggest');

										getSettingTabPanel.tab.setTitle('Settings');
										getSettingTitlebar.setTitle('Settings');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');

										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');

										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');

										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');




										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');

										getPortraitTaskMop.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');

										getSettingsBanner.setSrc('resources/images/iPad/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPad/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPad/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPad/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPad/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);


										var newTranslateFromPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);

										Ext.Msg.alert('Language Changed', 'Display Language: ENGLISH');

									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '80 0 0 15',
							src: 'resources/images/iPad/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "chinese";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');

										getSpeechifyTabPanel.tab.setTitle('翻譯');
										getSpeechifyTitlebar.setTitle('翻譯');

										getChoresTabPanel.tab.setTitle('家务');
										getChoresTitlebar.setTitle('家务');

										getFavouriteTabPanel.tab.setTitle('收藏');
										getFavouriteTitlebar.setTitle('收藏');

										getSuggestTabPanel.tab.setTitle('建议');
										getSuggestTitlebar.setTitle('建议');

										getSettingTabPanel.tab.setTitle('设置');
										getSettingTitlebar.setTitle('设置');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');

										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');

										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');


										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');




										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');





										getPortraitTaskMop.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');

										getSettingsBanner.setSrc('resources/images/iPad/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPad/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPad/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPad/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPad/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);


										var newTranslateFromPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);

										Ext.Msg.alert('Language Changed', 'Display Language: CHINESE');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '80 0 0 15',
							src: 'resources/images/iPad/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										// Get all components

										displayLanguage = "malay";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Menterjemahkan');
										getSpeechifyTitlebar.setTitle('Menterjemahkan');

										getChoresTabPanel.tab.setTitle('Kerja-kerja');
										getChoresTitlebar.setTitle('Kerja-kerja');

										getFavouriteTabPanel.tab.setTitle('Kegemaran');
										getFavouriteTitlebar.setTitle('Kegemaran');

										getSuggestTabPanel.tab.setTitle('Mencadangkan');
										getSuggestTitlebar.setTitle('Mencadangkan');

										getSettingTabPanel.tab.setTitle('Tetapan');
										getSettingTitlebar.setTitle('Tetapan');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');

										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');
										
										var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
										var getTranslateToPanel = Ext.getCmp('translateToPanel');


										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');




										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPad/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');


										getPortraitTaskMop.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPad/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPad/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPad/main/time/' + displayLanguage + '/9am.png');

										getSettingsBanner.setSrc('resources/images/iPad/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPad/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPad/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPad/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPad/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);

										var newTranslateFromPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-from.png)';
										getTranslateFromPanel.element.setStyle('background-image', newTranslateFromPanelBg);

										var newTranslateToPanelBg = 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-to.png)';
										getTranslateToPanel.element.setStyle('background-image', newTranslateToPanelBg);




										Ext.Msg.alert('Language Changed', 'Display Language: MALAY');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '80 0 0 15',
							src: 'resources/images/iPad/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '80 0 0 15',
							src: 'resources/images/iPad/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						height: 436,
						width: 748,
						layout: 'fit',
						margin: '10 0 0 5',
						id: 'translateToPanel',
						style: {
							backgroundImage: 'url(resources/images/iPad/settings/' + displayLanguage + '/translate-to.png)'
						},
						items: [{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '75 0 0 75',
							src: 'resources/images/iPad/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');

										outputLanguage = 'english';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '75 0 0 235',
							src: 'resources/images/iPad/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');

										outputLanguage = 'chinese';


										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '75 0 0 385',
							src: 'resources/images/iPad/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');

										outputLanguage = 'malay';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '75 0 0 535',
							src: 'resources/images/iPad/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '250 0 0 140',
							src: 'resources/images/iPad/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '250 0 0 300',
							src: 'resources/images/iPad/settings/cantonese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');

										outputLanguage = 'cantonese';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 155,
							width: 124,
							margin: '250 0 0 460',
							src: 'resources/images/iPad/settings/hokkien.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPad/main/thumb-default.png');

										outputLanguage = 'hokkien';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						}]

					}]
				}]
			}] // end of all items in mainView
		}); // end mainView Panel
			
		Ext.Viewport.add(mainView);
















		} // end of launch function
	});
}

























































































































































/** IPHONE 4GS **/

/*************************
** IPHONE DEPLOYMENT *****
**************************/








//else if (Ext.os.is('MacOS') || Ext.os.is('Windows')) {

else if (Ext.os.is('iPhone')) {

	new Ext.application({		
		name: 'Speechify',

		requires: [
			'Ext.MessageBox',
			'Ext.TabPanel',
			'Ext.dataview.List',
			'Ext.field.*',
			'Ext.Img',
			'Ext.carousel.Carousel',
			'Ext.form.Panel',
			'Ext.data.TreeStore',
			'Ext.data.Model',
			'Ext.data.Store',
			'Ext.NestedList',
			'Ext.TitleBar',
			'Ext.Map',
			'Ext.Label',
			'Ext.Audio',
			'Ext.data.identifier.Uuid',
			'Ext.grid.*'
		],
		
		
		// Upon startup - launch() method

		launch: function() {

		
	//--------------------------------------
	//-------- GLOBAL VARIABLES ------------
	//--------------------------------------

	var displayLanguage = 'english';
	var outputLanguage = 'english';
	var userName = '';

	//---------------------------------------
	//-------------- MODEL ------------------
	//---------------------------------------


			Ext.define('UserDB', {
			    extend: 'Ext.data.Model',
			
				config: {
					fields: [
							{name: 'id', type: 'string'},
					       {name: 'userName', type: 'string'},
					       {name: 'emailAddress', type: 'string'},	
					       {name: 'fullName', type: 'string'}
					     ]
				} // end of config			
			});

			Ext.define('BookmarkDB', {
				extend: 'Ext.data.Model',

				config: {
					fields: [
						{name: 'timeImgPath', type: 'string'},
						{name: 'timeAudioPath', type: 'string'},
						{name: 'placeImgPath', type: 'string'},
						{name: 'placeAudioPath', type: 'string'},
						{name: 'taskImgPath', type: 'string'},
						{name: 'taskAudioPath', type: 'string'}
					]
				}
			});

	//---------------------------------------
	//------- DataStore with Model ----------
	//---------------------------------------

			var userStore = Ext.create('Ext.data.Store', {
				    model: 'UserDB',
				    storeId: 'userStore',
				    proxy: {
				        type: 'ajax',
				        url: 'http://codextreme-terabytes.rhcloud.com/database/query-all-user.php',
						reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});


				var bookmarkStore = new Ext.create('Ext.data.Store', {
				    model: 'BookmarkDB',
				    storeId: 'bookmarkStore',
				    proxy: {
				        type: 'ajax',
				        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
				        actionMethods: {
				            read: 'POST'
				        },
				        extraParams: {
				        	userName: userName
				        },
				        
				        reader: {
				            type: 'json',
				            rootProperty: 'results'
				        }
				    },
				    autoLoad: true
				});




	//---------------------------------------------
	//------- XTemplate for Bookmark Page ---------
	//---------------------------------------------å


			var itemTpl = new Ext.XTemplate(
				'<tpl for=".">',
					//'<div class="{[xindex % 2 === 0 ? "tempEven" : "tempOdd"]}">',
					'<div class="',
						'<tpl if="xindex % 2 === 0">iPhoneLightTemplate"></tpl>',
						'<tpl if="xindex % 2 === 1">iPhoneDarkTemplate"></tpl>',
						//'<div class="bookmarkTask"><img src="resources/images/main/task/thumbnail/thumb-{taskImgPath}" width="1201" height="120" /></div>',
						'<div class="iPhoneBookmarkTask"><img src="resources/images/iPhone/main/task/thumbnail/thumb-{taskImgPath}" /></div>',
						'<div class="iPhoneBookmarkPlace"><img src="resources/images/iPhone/main/place/thumbnail/thumb-{placeImgPath}" /></div>',
						'<div class="iPhoneBookmarkTime"><img src="resources/images/iPhone/main/time/thumbnail/thumb-{timeImgPath}" /></div>',
						'<div class="iPhoneBookmarkPlay"><img src="resources/images/iPhone/bookmark/' + displayLanguage + '/playbutton.png" /></div>',
						'<div class="clearBoth"></div>',
					'</div>',
				'</tpl>'
	    	);




	//---------------------------------------
	//------- Creation of 3 Panels ----------
	//---------------------------------------

	//-------------------------------------------------------
	//------- Creation of 3 Hidden Audio xtype --------------
	//-------------------------------------------------------


		var listOfAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getPlaceAudio = Ext.getCmp('placeAudio');
							getPlaceAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'placeAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeAudio = Ext.getCmp('timeAudio');
							getTimeAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeAudio',
				hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	





		var listOfExpansionAudioPanel = Ext.create('Ext.Panel', {
			items: [{
				xtype: 'audio',
				id: 'taskExpansionAudio',
				hidden: true,
				url: 'resources/audio/blank.wav',
				listeners: {
					ended: {
						fn: function(event, time) {
							var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
							getTimeExpansionAudio.play();
						}
					}
				}
			},
			{
				xtype: 'audio',
				id: 'timeExpansionAudio',
				hidden: true,
				url: 'resources/audio/blank.wav'
			}]
		});	

	//-----------------------------------------------------------------
	//------- Creation of TaskPanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		

		var listOfTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/iPhone/main/sidebar/task-bg.png)'
			},
			id: 'listOfTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 //pack  : 'center',
				// align : 'middle'
			},

			items: [{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					id: 'portraitTaskMop',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/mop.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '1';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-mop.png');

										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/mop.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitTaskCook',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/cook.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '2';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-cook.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');

										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/cook.wav');
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitTaskScrub',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/scrub.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '3';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-scrub.png');
									
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/scrub.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitTaskSweep',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/sweep.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '4';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-sweep.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/sweep.wav');
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTaskVacuum',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/vacuum.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '5';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-vacuum.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/vacuum.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitTaskWashToilet',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/task/' + displayLanguage + '/washtoilet.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskThumb = Ext.getCmp('taskThumb');
										getTaskThumb.taskThumbId = '6';
										getTaskThumb.setSrc('resources/images/iPhone/main/task/thumbnail/thumb-task-washtoilet.png');
										
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/washtoilet.wav');
									}
								}
							}
				
				//}]	
			}]

		});








		var listOfExpansionTaskPanel = Ext.create('Ext.Panel', {
			style: {
				backgroundImage: 'url(resources/images/iPhone/expansion/sidebar/task-bg.png)'
			},
			id: 'listOfExpansionTaskPanel',
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 //pack  : 'center',
				// align : 'middle'
			},

			items: [{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					id: 'portraitExpansionTaskChangeClothing',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/changeclothing.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '7';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-changeclothing.png');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/changeclothing.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTaskDrinkWater',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/drinkwater.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '8';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-drinkwater.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');

										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/drinkwater.wav');
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTaskEatFruits',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/eatfruits.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '9';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-eatfruits.png');
									
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatfruits.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTaskEatNoodle',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/eatnoodle.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '10';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-eatnoodle.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/eatnoodle.wav');
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTaskGoForExercise',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/goforexercise.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '11';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-goforexercise.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/goforexercise.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTaskTakeMedicine',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/takemedicine.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
								getTaskExpansionThumb.taskThumbId = '12';
								getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-takemedicine.png');
								
								var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
								getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takemedicine.wav');
							}
						}
					}
				
				//}]	
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTaskTakeShower',
					src: 'resources/images/iPhone/expansion/task/' + displayLanguage + '/takeshower.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										getTaskExpansionThumb.taskThumbId = '13';
										getTaskExpansionThumb.setSrc('resources/images/iPhone/expansion/task/thumbnail/thumb-task-takeshower.png');
										
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.setUrl('resources/audio/task/' + outputLanguage + '/takeshower.wav');
									}
								}
							}
				//}]	
			}]

		});



	//-----------------------------------------------------------------
	//------- Creation of PlacePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------


		var listOfPlacePanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPhone/main/sidebar/place-bg.png)'
			},
					
			scrollable: true,
			layout: {
				 type  : 'vbox',
				// pack  : 'center',
				// align : 'middle'
			},

			items: [{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitPlaceBedroom',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/bedroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '1';
										getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-bedroom.png');
									
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/bedroom.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitPlaceKitchen',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/kitchen.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '2';
										getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-kitchen.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/kitchen.wav');
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitPlaceLivingrm',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/livingrm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '3';
										getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-livingrm.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/livingrm.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitPlacePlayroom',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/playroom.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '4';
										getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-playroom.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/playroom.wav');
									}
								}
							}
				
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitPlaceStudy',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/study.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getPlaceThumb = Ext.getCmp('placeThumb');
										getPlaceThumb.placeThumbId = '5';
										getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-study.png');
										
										var getPlaceAudio = Ext.getCmp('placeAudio');
										getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/study.wav');
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitPlaceToilet',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/place/' + displayLanguage + '/toilet.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getPlaceThumb = Ext.getCmp('placeThumb');
								getPlaceThumb.placeThumbId = '6';
								getPlaceThumb.setSrc('resources/images/iPhone/main/place/thumbnail/thumb-place-toilet.png');
								
								var getPlaceAudio = Ext.getCmp('placeAudio');
								getPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/toilet.wav');
							}
						}
					}
				//}]
			}]

		});
		

	//-----------------------------------------------------------------
	//------- Creation of TimePanel with 6 Sample Images --------------
	//-----------------------------------------------------------------

		var listOfTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPhone/main/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 //pack  : 'center',
				 //align : 'middle'
			},
			//cls: 'timePanelCss',
			//items: [{
			//	xtype: 'panel',
			//	layout: 'hbox',
				items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime2pm',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '1';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime4pm',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '2';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime6am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '3';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime7am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '4';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime8am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '5';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTime9am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/9am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeThumb = Ext.getCmp('timeThumb');
										getTimeThumb.timeThumbId = '6';
										getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-9am.png');

										var getTimeAudio = Ext.getCmp('timeAudio');
										getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
									}
								}
							}
			//	}]
			},
			{
			//	xtype: 'panel',
			//	layout: 'hbox',
			//	items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitTimeNow',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/now.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTimeThumb = Ext.getCmp('timeThumb');
								getTimeThumb.timeThumbId = '7';
								getTimeThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-now.png');
							
								var getTimeAudio = Ext.getCmp('timeAudio');
								getTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
							}
						}
					}
				}]
			//}]

		});





			var listOfExpansionTimesPanel = Ext.create('Ext.Panel', {

			style: {
				backgroundImage: 'url(resources/images/iPhone/expansion/sidebar/time-bg.png)'
			},
			scrollable: true,
			layout: {
				 type  : 'vbox',
				 //pack  : 'center',
				 //align : 'middle'
			},
			//cls: 'timePanelCss',
			items: [{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTime2pm',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '1';
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-2pm.png');

										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/2pm.wav');								
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTime4pm',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '2';
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-4pm.png');
										
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/4pm.wav');		
									}
								}
							}
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTime6am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/6am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '3';
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-6am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/6am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTime7am',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/7am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '4';
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-7am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/7am.wav');		
									}
								}
							}
				
				//}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
				//items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTime8am',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/8am.png',
					listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
										getTimeExpansionThumb.timeThumbId = '5';
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-8am.png');
									
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
										getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/8am.wav');		
									}
								}
							}
				},
				{
					xtype: 'image',
					width: 157,
					height: 185,
					id: 'portraitExpansionTime9am',
					margin: '0 0 0 35',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/9am.png',
					listeners: {
						tap: {
							fn:function(event, div, listener) {
								var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
								getTimeExpansionThumb.timeThumbId = '6';
								getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-9am.png');

								var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
								getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/9am.wav');		
							}
						}
					}
			//	}]
			},
			{
				//xtype: 'panel',
				//layout: 'hbox',
			//	items: [{
					xtype: 'image',
					width: 157,
					height: 185,
					margin: '0 0 0 35',
					id: 'portraitExpansionTimeNow',
					src: 'resources/images/iPhone/main/time/' + displayLanguage + '/now.png',
					listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');
									getTimeExpansionThumb.timeThumbId = '7';
									getTimeExpansionThumb.setSrc('resources/images/iPhone/main/time/thumbnail/thumb-time-now.png');
								
									var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');
									getTimeExpansionAudio.setUrl('resources/audio/time/' + outputLanguage + '/now.wav');		
								}
							}
						}
			//	}]
			}]

		});




	//-----------------------------------------------------------------
	//------- Creation of MAINVIEW that holds: ----------------------------

	// Has a mainStepsPanel (card layout) that holds:
	// 1. listOfAudioPanel ------------------------------------------
	// 2. listOfTaskPanel ------------------------------------------
	// 3. listOfPlacePanel ------------------------------------------
	// 4. listOfTimePanel ------------------------------------------
	// Added to Viewport
	//-----------------------------------------------------------------



		var mainView = new Ext.create('Ext.TabPanel', {
			width: 320,
			height: 465,
			//height: 768,
			centered: true,
			fullscreen: true,
			scrollable: true,
			
			tabBarPosition: 'bottom',

			items: [{
				title: 'Speechify',
				iconCls: 'iconSpeechify',
				id: 'speechifyTabPanel',
				items: [{
					xtype: 'titlebar',
					id: 'speechifyTitlebar',
					title: 'Speechify',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPhone/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 300,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																			
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'speechifyLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 320,
					height: 365,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						
						id: 'sidebarexpansionpanel',
						cls: 'sidebarexpansionpanel',
						height: 365,
						width: 120,
						style: {
							backgroundImage: 'url(resources/images/iPhone/expansion/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 20
						},
						{
							xtype: 'image',
							width: 80,
							height: 80,
							id: 'taskExpansionThumb',
							taskThumbId: '0',
							margin: '0 0 0 38',
							src: 'resources/images/iPhone/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'image',
							width: 80,
							height: 80,
							id: 'timeExpansionThumb',
							margin: '0 0 0 38',
							timeThumbId: '0',
							src: 'resources/images/iPhone/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsExpansionPanel = Ext.getCmp('mainStepsExpansionPanel');
										getMainStepsExpansionPanel.setActiveItem(1);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 60
						},
						{
							xtype: 'panel',
							id: 'pan_expansion_fav_weekly',
							layout : {
							    type  : 'hbox'
							    //pack  : 'center',
							    //align : 'middle'
							},
							items: [{
								xtype: 'image',
								id: 'btnExpansionFavourite',
								width: 39,
								height: 39,
								margin: '0 0 0 30',
								src: 'resources/images/iPhone/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}

										} // end function
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 37,
								height: 37,
								margin: '0 0 0 10',
								src: 'resources/images/iPhone/main/buttons/button-addweekly-disabled.png',
								id: 'btnExpansionWeekly',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 103,
							height: 24,
							margin: '20 0 0 15',
							src: 'resources/images/iPhone/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										getTaskExpansionAudio.play();


										//Start of hoiio incorporation
										
										var getTaskExpansionThumbId = Ext.getCmp('taskExpansionThumb').taskThumbId;
										
										var getTimeExpansionThumbId = Ext.getCmp('timeExpansionThumb').timeThumbId;

										if(getTimeExpansionThumbId === '0' || getTaskExpansionThumbId === '0') {
											// ignore sms sending
										} else {
											Ext.Ajax.request({
												url: 'http://codextreme-terabytes.rhcloud.com/database/hoiio.php',
												method: 'POST',

												params: {
													taskId: getTaskExpansionThumbId,
													timeId: getTimeExpansionThumbId,
													userName: userName
												},

												success: function(response) {
													//Ext.Msg.alert('Message Sent', response.responseText);
												}
											});
										}
										// end of hoiio


										
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						//flex: 2,
						items: [{
							xtype: 'panel',
							id: 'mainStepsExpansionPanel',
							layout: 'card',
							activeItem: 0,
							//flex: 1,
							width: 200,
							height: 365,
							items: [listOfExpansionTaskPanel, listOfExpansionTimesPanel, listOfExpansionAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Chores',
				iconCls: 'home',
				id: 'choresTabPanel',
				items: [{
					xtype: 'titlebar',
					title: 'Chores',
					id: 'choresTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPhone/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 300,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'choresLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
					}] // end of items in toolbar
				},
				{
					xtype: 'panel',
					width: 320,
					height: 365,   // DO SOMETHING HERE <-- DON TTHINK ITS 800
					layout: 'hbox',
					
					items: [{
						xtype: 'panel',
						//flex: 1,
						id: 'sidebarpanel',
						cls: 'sidebarpanel',
						height: 365,
						width: 120,
						style: {
							backgroundImage: 'url(resources/images/iPhone/main/sidebar/' + displayLanguage + '/sidebar.png)'
						},
						items: [{
							xtype: 'spacer',
							height: 20
						},
						{
							xtype: 'image',
							width: 80,
							height: 80,
							id: 'taskThumb',
							taskThumbId: '0',
							margin: '0 0 0 38',
							src: 'resources/images/iPhone/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/task-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
									
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(0);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'image',
							width: 80,
							height: 80,
							id: 'placeThumb',
							margin: '0 0 0 38',
							placeThumbId: '0',
							src: 'resources/images/iPhone/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/place-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(1);
									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'image',
							width: 80,
							height: 80,
							id: 'timeThumb',
							margin: '0 0 0 38',
							timeThumbId: '0',
							src: 'resources/images/iPhone/main/thumb-default.png',
							listeners: {
								tap: {
									fn:function(event, div, listener)
									{
										//var getSidebarPanel = Ext.getCmp('sidebarpanel');
										//var newBackgroundImg = 'url(http://www.jeremyzhong.com/terabytes/images/main/sidebar/time-bg.png)';
										//getSidebarPanel.element.setStyle('background-image', newBackgroundImg);
										
										var getMainStepsPanel = Ext.getCmp('mainStepsPanel');
										getMainStepsPanel.setActiveItem(2);
									


									}
								}
							}

						},
						{
							xtype: 'spacer',
							height: 10
						},
						{
							xtype: 'panel',
							id: 'pan_fav_weekly',
							layout : {
							    type  : 'hbox'
							    //pack  : 'center',
							    //align : 'middle'
							},
							items: [{
								xtype: 'image',
								id: 'btnFavourite',
								width: 39,
								height: 39,
								margin: '0 0 0 30',
								src: 'resources/images/iPhone/main/buttons/button-addfavorite-disabled.png',
								listeners: {
									tap: {
										fn:function(event, div, listener) {

											if(userName === '') {
												Ext.Msg.alert('Bookmark Function', 'Please login to use bookmark');
											} else {
												var getTaskThumb = Ext.getCmp('taskThumb');
												var getPlaceThumb = Ext.getCmp('placeThumb');
												var getTimeThumb = Ext.getCmp('timeThumb');

												var getTaskThumbId = getTaskThumb.taskThumbId;
												var getPlaceThumbId = getPlaceThumb.placeThumbId;
												var getTimeThumbId = getTimeThumb.timeThumbId;

												if((getTaskThumbId == '0') || (getPlaceThumbId == '0') || (getTimeThumbId == '0')) {
													Ext.Msg.alert('Error','Please fill in all fields');
												} else {
													// Perform a Ajax request to Insert Bookmarks
													Ext.Ajax.request({   
												        waitMsg: 'Please wait...',
												        //url: 'http://www.jeremyzhong.com/terabytes/http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        url: 'http://codextreme-terabytes.rhcloud.com/database/insert-bookmarks.php',
												        params: {
												          task: "INSERTBOOKMARK",
												          userName: userName,
												          taskId: getTaskThumbId,
												          placeId: getPlaceThumbId,
												          timeId: getTimeThumbId
												        }      
												      });

													bookmarkStore.load();          // reload our datastore.

													var getBookmarkStoreList = Ext.getCmp('bookmarkView');
													getBookmarkStoreList.refresh();

													Ext.Msg.alert('Bookmark', 'Bookmark Added!');
												}
											} // end else
										} // end function
									} // end of tap
								}
							},
							{
								xtype: 'image',
								width: 37,
								height: 37,
								margin: '0 0 0 10',
								src: 'resources/images/iPhone/main/buttons/button-addweekly-disabled.png',
								id: 'btnWeekly',
								listeners: {
									tap: {
										fn:function(event, div, listener) {
											if(userName === '') {
												Ext.Msg.alert('Weekly Function', 'Please login to use this function.');
											} else {
												Ext.Msg.alert('Under Development', 'Coming Soon!');
											}
											
										} // end of function
									} // end of tap
								}
							}]
						}, 
						{
							xtype: 'image',
							width: 104,
							height: 24,
							margin: '5 0 0 15',
							src: 'resources/images/iPhone/main/buttons/button-speechify.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										getTaskAudio.play();
									}
								}
							}
						}]
					},
					{
						xtype: 'panel',
						//flex: 2,
						items: [{
							xtype: 'panel',
							id: 'mainStepsPanel',
							layout: 'card',
							activeItem: 0,
							//flex: 1,
							width: 200,
							height: 365,
							items: [listOfTaskPanel, listOfPlacePanel, listOfTimesPanel, listOfAudioPanel]
						}]
					}]
				}
				] // end of items in Home tabPanel
			},
			{
				title: 'Favourites',
				id: 'favouriteTabPanel',
				iconCls: 'favorites_circle',
				style: {
					background: '#754d37'
				},
				items: [{
					xtype: 'titlebar',
					title: 'Favourites',
					id: 'favouriteTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPhone/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 300,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
																				form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
						
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'favouriteLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}]
				},
				{
					xtype: 'image',
					width: 320,
					height: 90,
					id: 'bookmarkBanner',
					src: 'resources/images/iPhone/bookmark/' + displayLanguage + '/banner.png',
				},
				{
					xtype: 'panel',
					layout: 'fit',
					height: 275,
					width: 320,
					scrollable: true,
					items: [{
						xtype: 'list',
						id: 'bookmarkView',
						store: bookmarkStore,
						baseCls: 'x-plain',
						itemTpl: itemTpl, // setting the XTemplate here
						listeners: {
								delay: 1000,
		                        itemsingletap: function(bookmarkView, index, item, e){



		                            var bookmarkStore = bookmarkView.getStore();
		                            var rec = bookmarkStore.getAt(index);

		                            var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
		                            var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
		                            var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

		                            getBookmarkTaskAudio.setUrl('resources/audio/task/' + outputLanguage + '/' + rec.get('taskAudioPath'));
		                            getBookmarkPlaceAudio.setUrl('resources/audio/place/' + outputLanguage + '/' + rec.get('placeAudioPath'));
		                            getBookmarkTimeAudio.setUrl('resources/audio/time/' + outputLanguage + '/' + rec.get('timeAudioPath'));
									
									//getBookmarkTaskAudio.media.dom.src = 'resources/audio/task/' + outputLanguage + '/' + rec.get('taskAudioPath');
									//getBookmarkTaskAudio.media.dom.load();

		                           // getBookmarkPlaceAudio.media.dom.src = 'resources/audio/place/' + outputLanguage + '/' + rec.get('placeAudioPath');
									//getBookmarkPlaceAudio.media.dom.load();

		                          //  getBookmarkTimeAudio.media.dom.src = 'resources/audio/time/' + outputLanguage + '/' + rec.get('timeAudioPath');
									//getBookmarkTimeAudio.media.dom.load();

									var task = Ext.create('Ext.util.DelayedTask', function() {
									        // console.log('callback!');
									     });
									
									     task.delay(500); //the callback function will now be called after 1500ms

									 getBookmarkTaskAudio.load();
									// getBookmarkPlaceAudio.load();
									// getBookmarkTimeAudio.load();






		                            getBookmarkTaskAudio.play();
		                        }
						    } // end of listneer
					}]
					
	            }, 
	            {
	            	xtype: 'audio',
					id: 'bookmarkTaskAudio',
					hidden: false,
					//renderTo: document.body,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
								getBookmarkPlaceAudio.play();
							}
						}
					}

	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkPlaceAudio',
					hidden: false,
					//renderTo: document.body,
					url: 'resources/audio/blank.wav',
					listeners: {
						ended: {
							fn: function(event, time) {
								var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');
								getBookmarkTimeAudio.play();
							}
						}
					}
	            },
	            {
	            	xtype: 'audio',
					id: 'bookmarkTimeAudio',
					renderTo: document.body,
					hidden: false,
					url: 'resources/audio/blank.wav'
	            }] // end of items
			},
			{
				title: 'Suggest',
				iconCls: 'mail',
				id: 'suggestTabPanel',
				items: [{
					xtype: 'titlebar',
					title: 'Suggest',
					id: 'suggestTitlebar',
					docked: 'top',
					style: {
						backgroundImage: 'url(resources/images/iPhone/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 300,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
											form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'suggestLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}] // end of item in toolbar	
				}, 
				{
					xtype: 'image',
					height: 427,
					width: 320,
					id: 'suggestBanner',
					src: 'resources/images/iPhone/suggest/' + displayLanguage + '/SuggestUI.png'
				}] // end of items
			},
			{
				title: 'Settings',
				id: 'settingTabPanel',
				iconCls: 'settings7',
				style: {
					//background: '#442a1a'
					background: '#764e36'
				},
				items: [{
					xtype: 'titlebar',
					title: 'Settings',
					id: 'settingTitlebar',
					style: { // height: 48
						backgroundImage: 'url(resources/images/iPhone/main/topbar.png)'
					},
					items: [
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogin',
						text: 'Log in',
						title: 'Log in',
						hidden: false,
						handler: function() {
							var form = Ext.create('Ext.form.Panel', {
								fullscreen: true,
								height: 250,
								width: 300,
								centered: true,
								id: 'loginForm',
								url: 'http://codextreme-terabytes.rhcloud.com/database/login.php',
								method: 'POST',
								items: [{
									xtype: 'textfield',
									label: 'Username',
									name: 'userName',
									id: 'userName'
								},
								{
									xtype: 'passwordfield',
									label: 'Password',
									name: 'password',
									id: 'password'

								},
								{	
									xtype: 'button',
									formBind: true,	 
									text: 'Send',
									ui: 'confirm',
									
									handler:function(){
											form.submit({
											method:'POST',
											
											success:function() {
												Ext.Msg.alert('Status', 'Login Successful!', function(btn, text) {
													if (btn == 'ok') {
														var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
														var getChoresLogin = Ext.getCmp('choresLogin');
														var getFavouriteLogin = Ext.getCmp('favouriteLogin');
														var getSuggestLogin = Ext.getCmp('suggestLogin');
														var getSettingLogin = Ext.getCmp('settingLogin');

														var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
														var getChoresLogout = Ext.getCmp('choresLogout');
														var getFavouriteLogout = Ext.getCmp('favouriteLogout');
														var getSuggestLogout = Ext.getCmp('suggestLogout');
														var getSettingLogout = Ext.getCmp('settingLogout');
														
														var getLoginForm = Ext.getCmp('loginForm');

														var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
														var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

														getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');


														var getBtnFavourite = Ext.getCmp('btnFavourite');
														var getBtnWeekly = Ext.getCmp('btnWeekly');

														getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly.png');
														getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite.png');




														getSpeechifyLogin.setHidden(true);
														getChoresLogin.setHidden(true);
														getFavouriteLogin.setHidden(true);																								
														getSuggestLogin.setHidden(true);				
														getSettingLogin.setHidden(true);	
														
														getSpeechifyLogout.setHidden(false);
														getChoresLogout.setHidden(false);
														getFavouriteLogout.setHidden(false);
														getSuggestLogout.setHidden(false);
														getSettingLogout.setHidden(false);
														
														var values = getLoginForm.getValues();	// returns an array				
														userName = values['userName']; // setting userName

														// recreation of datastore

														bookmarkStore = Ext.create('Ext.data.Store', {
														    model: 'BookmarkDB',
														    storeId: 'bookmarkStore',
														    proxy: {
														        type: 'ajax',
														        url : 'http://codextreme-terabytes.rhcloud.com/database/load-bookmarks.php',
														        actionMethods: {
														            read: 'POST'
														        },
														        extraParams: {
														        	userName: userName
														        },
														        
														        reader: {
														            type: 'json',
														            rootProperty: 'results'
														        }
														    },

														    autoLoad: true

														}); // end of bookmarkstore

														bookmarkStore.sync();	// syncing with proxy
														bookmarkStore.load();   // reload our datastore.
														
														var getBookmarkStoreList = Ext.getCmp('bookmarkView');
														getBookmarkStoreList.setStore(bookmarkStore); // impt line to re-point reference
														getBookmarkStoreList.refresh(); // re-render

														getLoginForm.destroy();
													} // end of button ok
												});
											} // end of success function
										}); // end of form submit
									} // end of handler
								}] // end of items
							}); // end of form creation
							form.show();
						} // end of handler
					
						// have to shift to the RIGHT hand side.
					},
					{ 
						xtype: 'button',
						align: 'right',
						id: 'settingLogout',
						text: 'Log out',
						title: 'Log out',
						hidden: true,
						handler: function() {
						
							var getSpeechifyLogin = Ext.getCmp('speechifyLogin');
							var getChoresLogin = Ext.getCmp('choresLogin');
							var getFavouriteLogin = Ext.getCmp('favouriteLogin');
							var getSuggestLogin = Ext.getCmp('suggestLogin');
							var getSettingLogin = Ext.getCmp('settingLogin');

							var getSpeechifyLogout = Ext.getCmp('speechifyLogout');
							var getChoresLogout = Ext.getCmp('choresLogout');
							var getFavouriteLogout = Ext.getCmp('favouriteLogout');
							var getSuggestLogout = Ext.getCmp('suggestLogout');
							var getSettingLogout = Ext.getCmp('settingLogout');

							var getBtnExpansionFavourite = Ext.getCmp('btnExpansionFavourite');
							var getBtnExpansionWeekly = Ext.getCmp('btnExpansionWeekly');

							getBtnExpansionWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnExpansionFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');

							var getBtnFavourite = Ext.getCmp('btnFavourite');
							var getBtnWeekly = Ext.getCmp('btnWeekly');

							getBtnWeekly.setSrc('resources/images/iPhone/main/buttons/button-addweekly-disabled.png');
							getBtnFavourite.setSrc('resources/images/iPhone/main/buttons/button-addfavorite-disabled.png');


							getSpeechifyLogin.setHidden(false);
							getChoresLogin.setHidden(false);
							getFavouriteLogin.setHidden(false);																								
							getSuggestLogin.setHidden(false);				
							getSettingLogin.setHidden(false);
							
							getSpeechifyLogout.setHidden(true);
							getChoresLogout.setHidden(true);
							getFavouriteLogout.setHidden(true);
							getSuggestLogout.setHidden(true);
							getSettingLogout.setHidden(true);					
						
							userName = '';

							bookmarkStore.removeAll(); // clear records upon logout
						} // end of handler
						
						
						// have to shift to the RIGHT hand side.
					}] // end of item in toolbar	
				},
				{
					xtype: 'image',
					width: 320,
					height: 55,
					id: 'settingsBanner',
					src: 'resources/images/iPhone/settings/' + displayLanguage + '/banner.png'
				},
				{
					xtype: 'panel',
					width: 320,
					height: 310,
					layout: 'fit',
					style: {
						backgroundImage: 'url(resources/images/iPhone/settings/settings-background.png)'
					},
					items: [{
						xtype: 'image',
						height: 31,
						width: 125,
						margin: '20 0 0 5',
						layout: 'fit',
						hidden: false,
						id: 'translateFromFromImage',
						zIndex: 3,
						src: 'resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png',
						listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
									getTranslateFromFromImage.show();
									
									var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
									getTranslateFromToImage.show();

									var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
									getTranslateToFromImage.hide();

									var getTranslateToToImage = Ext.getCmp('translateToToImage');
									getTranslateToToImage.hide();

									var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
									getTranslateFromPanel.show();

									var getTranslateToPanel = Ext.getCmp('translateToPanel');
									getTranslateToPanel.hide();
								}
							}
						}
					},
					{
						xtype: 'image',
						height: 31,
						width: 125,
						margin: '20 0 0 5',
						layout: 'fit',
						hidden: true,
						id: 'translateToFromImage',
						zIndex: 1,
						src: 'resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png',
						listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
									getTranslateFromFromImage.show();
									
									var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
									getTranslateFromToImage.show();

									var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
									getTranslateToFromImage.hide();

									var getTranslateToToImage = Ext.getCmp('translateToToImage');
									getTranslateToToImage.hide();

									var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
									getTranslateFromPanel.show();

									var getTranslateToPanel = Ext.getCmp('translateToPanel');
									getTranslateToPanel.hide();
								}
							}
						}
					},
					{
						xtype: 'image',
						height: 31,
						width: 125,
						layout: 'fit',
						margin: '20 0 0 125',
						id: 'translateFromToImage',
						//cls: 'zIndex1',
						hidden: false,
						zIndex: 1,
						src: 'resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png',
						listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
									getTranslateFromFromImage.hide();
									
									var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
									getTranslateFromToImage.hide();

									var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
									getTranslateToFromImage.show();
									getTranslateToFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');


									var getTranslateToToImage = Ext.getCmp('translateToToImage');
									getTranslateToToImage.show();
									getTranslateToToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');

									var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
									getTranslateFromPanel.hide();

									var getTranslateToPanel = Ext.getCmp('translateToPanel');
									getTranslateToPanel.show();

								}
							}
						} // end of listener
					},
					{
						xtype: 'image',
						height: 31,
						width: 125,
						layout: 'fit',
						margin: '20 0 0 125',
						id: 'translateToToImage',
						//cls: 'zIndex1',
						hidden: true,
						zIndex: 3,
						src: 'resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png',
						listeners: {
							tap: {
								fn:function(event, div, listener) {
									var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
									getTranslateFromFromImage.hide();
									
									var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
									getTranslateFromToImage.hide();

									var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
									getTranslateToFromImage.show();

									var getTranslateToToImage = Ext.getCmp('translateToToImage');
									getTranslateToToImage.show();

									var getTranslateFromPanel = Ext.getCmp('translateFromPanel');
									getTranslateFromPanel.hide();

									var getTranslateToPanel = Ext.getCmp('translateToPanel');
									getTranslateToPanel.show();

								}
							}
						} // end of listener
					},
					{
						xtype: 'panel',
						width: 313,
						height: 249,
						zIndex: 2,
						layout: 'fit',
						hidden: false, // initially display
						//cls: 'zIndex2',
						id: 'translateFromPanel',
						margin: '45 0 0 5',
						style: {
							backgroundImage: 'url(resources/images/iPhone/settings/translatePanelBg.png)'
						},
						items: [{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 20',
							src: 'resources/images/iPhone/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
											// Get all components

										displayLanguage = "english";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Speechify');
										getSpeechifyTitlebar.setTitle('Speechify');

										getChoresTabPanel.tab.setTitle('Chores');
										getChoresTitlebar.setTitle('Chores');

										getFavouriteTabPanel.tab.setTitle('Favourites');
										getFavouriteTitlebar.setTitle('Favourites');

										getSuggestTabPanel.tab.setTitle('Suggest');
										getSuggestTitlebar.setTitle('Suggest');

										getSettingTabPanel.tab.setTitle('Settings');
										getSettingTitlebar.setTitle('Settings');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');
										
										var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
										var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
										var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
										var getTranslateToToImage = Ext.getCmp('translateToToImage');


										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');



										getPortraitTaskMop.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');


										getSettingsBanner.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPhone/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPhone/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPhone/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPhone/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);

										
										getTranslateFromFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateFromToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');
										getTranslateToFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateToToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');




										Ext.Msg.alert('Language Changed', 'Display Language: ENGLISH');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 125',
							src: 'resources/images/iPhone/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
																					// Get all components

										displayLanguage = "chinese";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');

										getSpeechifyTabPanel.tab.setTitle('翻譯');
										getSpeechifyTitlebar.setTitle('翻譯');

										getChoresTabPanel.tab.setTitle('家务');
										getChoresTitlebar.setTitle('家务');

										getFavouriteTabPanel.tab.setTitle('收藏');
										getFavouriteTitlebar.setTitle('收藏');

										getSuggestTabPanel.tab.setTitle('建议');
										getSuggestTitlebar.setTitle('建议');

										getSettingTabPanel.tab.setTitle('设置');
										getSettingTitlebar.setTitle('设置');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');
										
										var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
										var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
										var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
										var getTranslateToToImage = Ext.getCmp('translateToToImage');


										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');



										getPortraitTaskMop.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');


										getSettingsBanner.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPhone/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPhone/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPhone/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPhone/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);

										
										getTranslateFromFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateFromToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');
										getTranslateToFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateToToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');




										Ext.Msg.alert('Language Changed', 'Display Language: CHINESE');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 225',
							src: 'resources/images/iPhone/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
																				// Get all components

										displayLanguage = "malay";

										var getSpeechifyTabPanel = Ext.getCmp('speechifyTabPanel');
										var getSpeechifyTitlebar = Ext.getCmp('speechifyTitlebar');

										var getChoresTabPanel = Ext.getCmp('choresTabPanel');
										var getChoresTitlebar = Ext.getCmp('choresTitlebar');

										var getFavouriteTabPanel = Ext.getCmp('favouriteTabPanel');
										var getFavouriteTitlebar = Ext.getCmp('favouriteTitlebar');

										var getSuggestTabPanel = Ext.getCmp('suggestTabPanel');
										var getSuggestTitlebar = Ext.getCmp('suggestTitlebar');

										var getSettingTabPanel = Ext.getCmp('settingTabPanel');
										var getSettingTitlebar = Ext.getCmp('settingTitlebar');


										getSpeechifyTabPanel.tab.setTitle('Menterjemahkan');
										getSpeechifyTitlebar.setTitle('Menterjemahkan');

										getChoresTabPanel.tab.setTitle('Kerja-kerja');
										getChoresTitlebar.setTitle('Kerja-kerja');

										getFavouriteTabPanel.tab.setTitle('Kegemaran');
										getFavouriteTitlebar.setTitle('Kegemaran');

										getSuggestTabPanel.tab.setTitle('Mencadangkan');
										getSuggestTitlebar.setTitle('Mencadangkan');

										getSettingTabPanel.tab.setTitle('Tetapan');
										getSettingTitlebar.setTitle('Tetapan');

										var getPortraitTaskMop = Ext.getCmp('portraitTaskMop');
										var getPortraitTaskCook = Ext.getCmp('portraitTaskCook');
										var getPortraitTaskScrub = Ext.getCmp('portraitTaskScrub');
										var getPortraitTaskSweep = Ext.getCmp('portraitTaskSweep');
										var getPortraitTaskVacuum = Ext.getCmp('portraitTaskVacuum');
										var getPortraitTaskWashToilet = Ext.getCmp('portraitTaskWashToilet');

										var getPortraitPlaceBedroom = Ext.getCmp('portraitPlaceBedroom');
										var getPortraitPlaceKitchen = Ext.getCmp('portraitPlaceKitchen');
										var getPortraitPlaceLivingrm = Ext.getCmp('portraitPlaceLivingrm');
										var getPortraitPlacePlayroom = Ext.getCmp('portraitPlacePlayroom');
										var getPortraitPlaceStudy = Ext.getCmp('portraitPlaceStudy');
										var getPortraitPlaceToilet = Ext.getCmp('portraitPlaceToilet');

										var getPortraitTime2pm = Ext.getCmp('portraitTime2pm');
										var getPortraitTime4pm = Ext.getCmp('portraitTime4pm');
										var getPortraitTime6am = Ext.getCmp('portraitTime6am');
										var getPortraitTime7am = Ext.getCmp('portraitTime7am');
										var getPortraitTime8am = Ext.getCmp('portraitTime8am');
										var getPortraitTime9am = Ext.getCmp('portraitTime9am');
										var getPortraitTimeNow = Ext.getCmp('portraitTimeNow');


										var getSettingsBanner = Ext.getCmp('settingsBanner');
										var getBookmarkBanner = Ext.getCmp('bookmarkBanner');
										var getSuggestBanner = Ext.getCmp('suggestBanner');
										var getSidebarPanel = Ext.getCmp('sidebarpanel');
										var getSidebarExpansionPanel = Ext.getCmp('sidebarexpansionpanel');
										
										var getTranslateFromFromImage = Ext.getCmp('translateFromFromImage');
										var getTranslateFromToImage = Ext.getCmp('translateFromToImage');
										var getTranslateToFromImage = Ext.getCmp('translateToFromImage');
										var getTranslateToToImage = Ext.getCmp('translateToToImage');


										var getPortraitExpansionTaskChangeClothing = Ext.getCmp('portraitExpansionTaskChangeClothing');
										var getPortraitExpansionTaskDrinkWater = Ext.getCmp('portraitExpansionTaskDrinkWater');
										var getPortraitExpansionTaskEatFruits = Ext.getCmp('portraitExpansionTaskEatFruits');
										var getPortraitExpansionTaskEatNoodle = Ext.getCmp('portraitExpansionTaskEatNoodle');
										var getPortraitExpansionTaskGoForExercise = Ext.getCmp('portraitExpansionTaskGoForExercise');
										var getPortraitExpansionTaskTakeMedicine = Ext.getCmp('portraitExpansionTaskTakeMedicine');
										var getPortraitExpansionTaskTakeShower = Ext.getCmp('portraitExpansionTaskTakeShower');

										var getPortraitExpansionTime2pm = Ext.getCmp('portraitExpansionTime2pm');
										var getPortraitExpansionTime4pm = Ext.getCmp('portraitExpansionTime4pm');
										var getPortraitExpansionTime6am = Ext.getCmp('portraitExpansionTime6am');
										var getPortraitExpansionTime7am = Ext.getCmp('portraitExpansionTime7am');
										var getPortraitExpansionTime8am = Ext.getCmp('portraitExpansionTime8am');
										var getPortraitExpansionTime9am = Ext.getCmp('portraitExpansionTime9am');
										var getPortraitExpansionTimeNow = Ext.getCmp('portraitExpansionTimeNow');





										getPortraitExpansionTaskChangeClothing.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/changeclothing.png');
										getPortraitExpansionTaskDrinkWater.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/drinkwater.png');
										getPortraitExpansionTaskEatFruits.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatfruits.png');
										getPortraitExpansionTaskEatNoodle.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/eatnoodle.png');
										getPortraitExpansionTaskGoForExercise.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/goforexercise.png');
										getPortraitExpansionTaskTakeMedicine.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takemedicine.png');
										getPortraitExpansionTaskTakeShower.setSrc('resources/images/iPhone/expansion/task/' + displayLanguage + '/takeshower.png');
																			
										getPortraitExpansionTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitExpansionTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitExpansionTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitExpansionTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitExpansionTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitExpansionTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitExpansionTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');



										getPortraitTaskMop.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/mop.png');
										getPortraitTaskCook.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/cook.png');
										getPortraitTaskScrub.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/scrub.png');
										getPortraitTaskSweep.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/sweep.png');
										getPortraitTaskVacuum.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/vacuum.png');
										getPortraitTaskWashToilet.setSrc('resources/images/iPhone/main/task/' + displayLanguage + '/washtoilet.png');
										
										getPortraitPlaceBedroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/bedroom.png');
										getPortraitPlaceKitchen.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/kitchen.png');
										getPortraitPlaceLivingrm.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/livingrm.png');
										getPortraitPlacePlayroom.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/playroom.png');
										getPortraitPlaceStudy.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/study.png');
										getPortraitPlaceToilet.setSrc('resources/images/iPhone/main/place/' + displayLanguage + '/toilet.png');	

										getPortraitTime2pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/2pm.png');
										getPortraitTime4pm.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/4pm.png');
										getPortraitTime6am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/6am.png');
										getPortraitTime7am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/7am.png');
										getPortraitTime8am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/8am.png');
										getPortraitTime9am.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/9am.png');
										getPortraitTimeNow.setSrc('resources/images/iPhone/main/time/' + displayLanguage + '/now.png');


										getSettingsBanner.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/banner.png');
										getBookmarkBanner.setSrc('resources/images/iPhone/bookmark/' + displayLanguage + '/banner.png');
										getSuggestBanner.setSrc('resources/images/iPhone/suggest/' + displayLanguage + '/SuggestUI.png');

										var newSidebarPanelBg = 'url(resources/images/iPhone/main/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarPanel.element.setStyle('background-image', newSidebarPanelBg);

										var newSidebarExpansionPanelBg = 'url(resources/images/iPhone/expansion/sidebar/' + displayLanguage + '/sidebar.png)';
										getSidebarExpansionPanel.element.setStyle('background-image', newSidebarExpansionPanelBg);

										
										getTranslateFromFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateFromToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');
										getTranslateToFromImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateFrom.png');
										getTranslateToToImage.setSrc('resources/images/iPhone/settings/' + displayLanguage + '/translateTo.png');




										Ext.Msg.alert('Language Changed', 'Display Language: MALAY');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '125 0 0 75',
							src: 'resources/images/iPhone/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '125 0 0 175',
							src: 'resources/images/iPhone/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							} // end of listener
						}]
					},
					{
						xtype: 'panel',
						width: 313,
						height: 249,
						zIndex: 2,
						layout: 'fit',
						hidden: true,
						id: 'translateToPanel',
						margin: '45 0 0 5',
						style: {
							backgroundImage: 'url(resources/images/iPhone/settings/translatePanelBg.png)'
						},
						items: [{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 10',
							src: 'resources/images/iPhone/settings/english.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');

										outputLanguage = 'english';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 85',
							src: 'resources/images/iPhone/settings/chinese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');

										outputLanguage = 'chinese';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 160',
							src: 'resources/images/iPhone/settings/melayu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');

										outputLanguage = 'malay';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '35 0 0 235',
							src: 'resources/images/iPhone/settings/hindu.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '135 0 0 47',
							src: 'resources/images/iPhone/settings/tagalog.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										Ext.Msg.alert('Under Development', 'Coming Soon!');
									}
								}
							} // end of listener
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '135 0 0 122',
							src: 'resources/images/iPhone/settings/cantonese.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');

										outputLanguage = 'cantonese';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						},
						{
							xtype: 'image',
							height: 88,
							width: 71,
							margin: '135 0 0 197',
							src: 'resources/images/iPhone/settings/hokkien.png',
							listeners: {
								tap: {
									fn:function(event, div, listener) {
										var getTaskAudio = Ext.getCmp('taskAudio');
										var getPlaceAudio = Ext.getCmp('placeAudio');
										var getTimeAudio = Ext.getCmp('timeAudio');

										var getTaskExpansionAudio = Ext.getCmp('taskExpansionAudio');
										var getTimeExpansionAudio = Ext.getCmp('timeExpansionAudio');

										var getBookmarkTaskAudio = Ext.getCmp('bookmarkTaskAudio');
										var getBookmarkPlaceAudio = Ext.getCmp('bookmarkPlaceAudio');
										var getBookmarkTimeAudio = Ext.getCmp('bookmarkTimeAudio');

										var getTaskThumb = Ext.getCmp('taskThumb');
										var getPlaceThumb = Ext.getCmp('placeThumb');
										var getTimeThumb = Ext.getCmp('timeThumb');

										

										var getTaskExpansionThumb = Ext.getCmp('taskExpansionThumb');
										var getTimeExpansionThumb = Ext.getCmp('timeExpansionThumb');



										getTaskAudio.setUrl('resources/audio/blank.wav');
										getPlaceAudio.setUrl('resources/audio/blank.wav');
										getTimeAudio.setUrl('resources/audio/blank.wav');
										getTaskExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getTimeExpansionAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTaskAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkPlaceAudio.setUrl('resources/audio/blank.wav');
		                            	getBookmarkTimeAudio.setUrl('resources/audio/blank.wav');

		                            	getTaskThumb.taskThumbId = '0';
		                            	getPlaceThumb.placeThumbId = '0';
		                            	getTimeThumb.timeThumbId = '0';

		                            	getTaskExpansionThumb.taskThumbId = '0';
		                            	getTimeExpansionThumb.timeThumbId = '0';



										getTaskThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getPlaceThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTaskExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');
										getTimeExpansionThumb.setSrc('resources/images/iPhone/main/thumb-default.png');

										outputLanguage = 'hokkien';

										
										Ext.Msg.alert('Language Changed', 'Output Language: ' + outputLanguage.toUpperCase());
									}
								}
							}
						}]
					}]







				}]
			}] // end of all items in mainView
		}); // end mainView Panel
			
		Ext.Viewport.add(mainView);
















		} // end of launch function
	});
}

else {
}