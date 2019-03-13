const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/flood').onUpdate((change,context) => {
    
    const preVal = change.before.val(); //previous value when data base variable changes
    const value = change.after.val();// after value when data base variable changes 
    let text; //declaring the text variable which holds the body of the notification
    let title; //declaring the variable to hold the Notification title 


    // sending appropirate notifications according to the water level 
    if(value === 3){  
        text = 'There is a threat of flooding. please evacuate the area and take proper precautions. ';
        title = 'Flood Alert';
        
    }else if(value === 2) {
        if(preVal > value){
            text = 'The water level is gradually decreasing, but there is still a threat of flooding ';
            title = 'Flood Alert';
        }else{
            text = 'The water level is reaching the danger level. there is a possible threat of flooding ';
            title = 'Flood Alert';
        }
    }else if(value === 1){
        if(preVal > value){
            text = 'The water level has fallen . the threat has subsided';
            title = 'Flood Alert';
        }else{
            text = 'The water level is rising,there is a minor threat of flooding in your area ';
            title = 'Flood Alert';
        }
    }else{
        text = 'The threat has subsided ';
         title = 'Disaster subsided';
    }

    console.log('notification sent');//printing on log to clarify the notificatoin is sent 

    const payLoad = {
        notification:{
            title: title,
            body: text,
            sound: "default"
        }
    };

    const options = {
        priority: "high",
        timeToLive: 60*60*2
    };

    return admin.messaging().sendToTopic("flood", payLoad, options); //sending the relavant notification to the relevant users 
});

