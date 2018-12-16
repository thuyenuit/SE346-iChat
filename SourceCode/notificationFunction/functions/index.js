
'use strict'

const functions = require('firebase-functions');

//with out admin we wont be able to send noticiation
const admin = require('firebase-admin');
admin.initializeApp();

/*
 * 'OnWrite' works as 'addValueEventListener' for android. It will fire the function
 * everytime there is some item added, removed or changed from the provided 'database.ref'
 * 'sendNotification' is the name of the function, which can be changed according to
 * your requirement
 */
exports.sendNotification = functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite((change , context) => {


 /*
   * You can store values as variables from the 'database.ref'
   * Just like here, I've done for 'user_id' and 'notification_id'
   */

    const user_id = context.params.user_id;
    const notification_id = context.params.notification_id;

	console.log('We have a notification to send to : ', user_id);


   /*
   * Stops proceeding to the rest of the function if the entry is deleted from database.
   * If you want to work with what should happen when an entry is deleted, you can replace the
   * line from "return console.log.... "
   */
   

	 if (!change.after.val()) {
	  return console.log('A Notification has been deleted from the database:' , notification_id);
	 }

 /*
   * 'fromUser' query retreives the ID of the user who sent the notification
   */


	const fromUser = admin.database().ref('/notifications/' + user_id + '/' + notification_id).once('value');

	return fromUser.then(fromUserResult => {
		
		console.log('Value of fromUserResult :', fromUserResult);
		const from_user_id = fromUserResult.val().from;

		console.log('Sender Name :', from_user_id);


		// to get the sender name
		const userQuery = admin.database().ref('/user/' + from_user_id + '/name').once('value');
		// device token
		const deviceToken = admin.database().ref('/user/' + user_id + '/device_token').once('value');

	   
		return Promise.all([userQuery , deviceToken]).then(result => {

			const userName = result[0].val();
			const token_id = result[1].val();

			console.log('userName: ', userName);
			console.log('token_id: ', token_id);
			  /*
			   * We are creating a 'payload' to create a notification to be sent.
			   */

			const payload = {
				data: {
					title : "Yêu cầu kết bạn",
					body :  userName + " muốn kết bạn",
					icon : "default",
					timestamp: new Date().getTime().toString(),
					click_action : "com.example.android.him_TARGET_NOTIFICATION",
					from_user_id : from_user_id
				}

				//data:{
				//	from_user_id : from_user_id
				//}
			};
		 /*
			   * Then using admin.messaging() we are sending the payload notification to the token_id of
			   * the device we retreived.
			   */

			return admin.messaging().sendToDevice(token_id , payload).then(response => {

				console.log('This was notification feature');

				return true;
			});
		}); 
   });
 });
 
 
 
 exports.sendMessage = functions.database.ref('/messagenotification/{room_id}/{user_id}/{message_id}').onWrite((change , context) => {


 /*
   * You can store values as variables from the 'database.ref'
   * Just like here, I've done for 'user_id' and 'notification_id'
   */

    const room_id = context.params.room_id;
    const user_id = context.params.user_id;
	const message_id = context.params.message_id;
  
	console.log('Có tin nhắn từ phòng : ' + room_id + ' đến user : ' + user_id);
	console.log('Mã tin nhắn ' + message_id);

   /*
   * Stops proceeding to the rest of the function if the entry is deleted from database.
   * If you want to work with what should happen when an entry is deleted, you can replace the
   * line from "return console.log.... "
   */
   

	 if (!change.after.val()) {
	  return console.log('Tin nhắn đã được xóa từ phòng :' , room_id);
	 }

 /*
   * 'fromUser' query retreives the ID of the user who sent the notification
   */


	const fromUser = admin.database().ref('/messagenotification/' + room_id + '/' + user_id + '/' + message_id).once('value');
	
	console.log('Value of fromUser :', fromUser);
	
	return fromUser.then(fromUserResult => {
		
		console.log('Value of fromUserResult :', fromUserResult);
		
		const from_user_id = fromUserResult.val().from;

		console.log('Người gửi :', from_user_id);

		// to get the sender name
		const userQuery = admin.database().ref('/user/' + from_user_id + '/name').once('value');
		// device token
		const deviceToken = admin.database().ref('/user/' + user_id + '/device_token').once('value');
		
		const textMessage = admin.database().ref('/messagenotification/' + room_id + '/' + user_id + '/' + message_id + '/message').once('value');

		return Promise.all([userQuery , deviceToken, textMessage]).then(result => {

			const userName = result[0].val();
			const token_id = result[1].val();
			const txtMessage = result[2].val();

			console.log('userName: ', userName);
			console.log('token_id: ', token_id);
			console.log('Noi dung: ', txtMessage);
			  /*
			   * We are creating a 'payload' to create a notification to be sent.
			   */

			const payload = {
				data: {
					title : "Tin nhắn từ " + userName,
					body :  txtMessage,
					icon : "default",
					timestamp: new Date().getTime().toString(),
					click_action : "com.example.android.him_TARGET_NOTIFICATION",
					from_user_id : from_user_id
				}
			};
		 /*
			   * Then using admin.messaging() we are sending the payload notification to the token_id of
			   * the device we retreived.
			   */

			return admin.messaging().sendToDevice(token_id , payload).then(response => {

				console.log('This was notification feature');

				return true;
			});
		}); 
   });
 });
 
 
 
 exports.sendMessageGroup = functions.database.ref('/messagegroupnotification/{room_id}/{user_id}/{message_id}').onWrite((change , context) => {


 /*
   * You can store values as variables from the 'database.ref'
   * Just like here, I've done for 'user_id' and 'notification_id'
   */

    const room_id = context.params.room_id;
    const user_id = context.params.user_id;
	const message_id = context.params.message_id;
  
	console.log('Có tin nhắn từ phòng : ' + room_id + ' đến user : ' + user_id);
	console.log('Mã tin nhắn ' + message_id);

   /*
   * Stops proceeding to the rest of the function if the entry is deleted from database.
   * If you want to work with what should happen when an entry is deleted, you can replace the
   * line from "return console.log.... "
   */
   

	 if (!change.after.val()) {
	  return console.log('Tin nhắn đã được xóa từ phòng :' , room_id);
	 }

 /*
   * 'fromUser' query retreives the ID of the user who sent the notification
   */


	const fromUser = admin.database().ref('/messagegroupnotification/' + room_id + '/' + user_id + '/' + message_id).once('value');
	
	console.log('Value of fromUser :', fromUser);
	
	return fromUser.then(fromUserResult => {
		
		console.log('Value of fromUserResult :', fromUserResult);
		
		const from_user_id = fromUserResult.val().from;

		console.log('Người gửi :', from_user_id);

		// to get the sender name
		const userQuery = admin.database().ref('/user/' + from_user_id + '/name').once('value');		
		// device token
		const deviceToken = admin.database().ref('/user/' + user_id + '/device_token').once('value');
		
		const textMessage = admin.database().ref('/messagegroupnotification/' + room_id + '/' + user_id + '/' + message_id + '/message').once('value');
		
		// to get group name
		const groupName = admin.database().ref('/group/' + room_id + '/groupInfo/name').once('value');

		return Promise.all([userQuery , deviceToken, textMessage, groupName]).then(result => {

			const userName = result[0].val();
			const token_id = result[1].val();
			const txtMessage = result[2].val();
			const txtGroupName = result[3].val();

			console.log('userName: ', userName);
			console.log('token_id: ', token_id);
			console.log('Noi dung: ', txtMessage);
			console.log('Tu nhom: ', txtGroupName);
			  /*
			   * We are creating a 'payload' to create a notification to be sent.
			   */

			const payload = {
				data: {
					title : "Tin nhắn từ " + txtGroupName,
					body :  userName + ": " + txtMessage,
					icon : "default",
					timestamp: new Date().getTime().toString(),
					click_action : "com.example.android.him_TARGET_NOTIFICATION",
					from_user_id : from_user_id
				}
			};
		 /*
			   * Then using admin.messaging() we are sending the payload notification to the token_id of
			   * the device we retreived.
			   */

			return admin.messaging().sendToDevice(token_id , payload).then(response => {

				console.log('This was notification feature');

				return true;
			});
		}); 
   });
 });