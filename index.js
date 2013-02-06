Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {

        // The following is accomplished with the Google Map API
        var geo = Ext.create({
            xtype   : 'geolocation',
            autoUpdate: true,
            listeners: {
                locationupdate: function(geo) {
                    alert('New latitude: ' + geo.getLatitude());
                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if(bTimeout){
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred.');
                    }
                }
            }
        }),  //Sencha HQ

            infowindow = new google.maps.InfoWindow({
                content: 'Sencha Touch HQ'
            }),

                //Tracking Marker Image
                image = new google.maps.MarkerImage(
                    'point.png',
                    new google.maps.Size(32, 31),
                    new google.maps.Point(0,0),
                    new google.maps.Point(16, 31)
                  ),

                shadow = new google.maps.MarkerImage(
                    'shadow.png',
                    new google.maps.Size(64, 52),
                    new google.maps.Point(0,0),
                    new google.maps.Point(-5, 42)
                  ),

            trackingButton = Ext.create({
               xtype   : 'button',
               iconMask: true,
               iconCls : 'locate'
            } ),

            toolbar = new Ext.Toolbar({
                    dock: 'top',
                    xtype: 'toolbar',
                    ui : 'light',
                    defaults: {
                        iconMask: true
                    },
                    items : [
                    {
                        position : geo.updateLocation(),
                        iconCls  : 'home',
                        handler : function(){
                            //disable tracking
                            //trackingButton.ownerCt.setActive(trackingButton, false);
                            //mapdemo.map.panTo(this.position);
                        }
                    },{
                        xtype : 'segmentedbutton',
                        allowMultiple : true,
                        listeners : {
                            toggle : function(buttons, button, active){
                               if(button.iconCls == 'maps' ){
                                   mapdemo.traffic[active ? 'show' : 'hide']();
                               }else if(button.iconCls == 'locate'){
                                   mapdemo.geo[active ? 'resumeUpdates' : 'suspendUpdates']();
                               }
                            }
                        },
                        items : [
                             trackingButton,
                                 {
                                        iconMask: true,
                                        iconCls: 'maps'
                                     }
                         ]
                    }]
                });
        
        mapdemo = new Ext.Map({
            mapOptions : {
                center : geo.updateLocation(),  //nearby San Fran
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.DEFAULT
                    }
            },

            plugins : [
                new Ext.plugin.GMap.Tracker({
                        trackSuspended : true,   //suspend tracking initially
                        highAccuracy   : false,
                        marker : new google.maps.Marker({
                            position: geo.updateLocation(),
                            title : 'My Current Location',
                            shadow: shadow,
                            icon  : image
                          })
                }),
                new Ext.plugin.GMap.Traffic({ hidden : true })
            ],

            listeners : {
                maprender : function(comp, map){
                    var marker = new google.maps.Marker({
                                     position: geo.updateLocation(),
                                     title : 'Sencha HQ',
                                     map: map
                                });

                                google.maps.event.addListener(marker, 'click', function() {
                                     infowindow.open(map, marker);
                                });

                    setTimeout( function(){ map.panTo (geo.updateLocation()); } , 1000);
                }

            }
        });

        new Ext.Panel({
            fullscreen: true,
            dockedItems: [toolbar],
            items: [mapdemo]
        });

    }
});