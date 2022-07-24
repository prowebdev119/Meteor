/**
 * This is for essential email settings.
 * 
 * EmailSettingDB Schema
 *  type
    frequency 
        monthly: day, month, starttime, startdate
        weekly: day, weeks, starttime, startdate
        daily: day, duaration,starttime, startdate
        oneTime: starttime, startdate,
        event: logon||logout
    send 
    recepients: [email...];
 */

EmailSetting = new Mongo.Collection('emailSetting');

import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {

    Meteor.publish('EmailSettings', function CloudDatabasePublication() {
        return EmailSetting.find();
    });

}
Meteor.methods({
    createEmailSetting: function (type, frequency, send, recepients) {
        return EmailSetting.upsert({ type: type }, { type, frequency, send, recepients }, false, (error, data) => {
            if (error) {
                console.log(error);
                throw new Meteor.Error('document-not-create', 'Not created a new document. Please try again.');
            } else {
                return data;
            }
        });
    },
    readAllEmailSettings: () => {
        var cursor = EmailSetting.find({});
        if (!cursor) {
            throw new Meteor.Error('document-not-found', "Documents are not found");
        }
        return cursor.fetch();
    },
    readEmailSetting: function (transactiontype) {
        var documentPref = EmailSetting.findOne({ type: transactiontype });
        if (!documentPref) {
            throw new Meteor.Error('document-not-found', 'No documents found matching this query.');
        } else {
            console.log(document);
        }
        return documentPref;
    },
    updateEmailSetting: function (type, frequency, send, recepients) {
        EmailSetting.update({ type: type }, { $set: { frequency, send, recepients } });
    },
    deleteEmailSetting: function (type) {
        EmailSetting.remove({ type: type })
    },
    deleteAllEmailSettings: () => {
        EmailSetting.remove({});
    }

});
