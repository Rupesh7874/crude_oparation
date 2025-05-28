const mongoose=require('mongoose');


const deviceschema= new mongoose.Schema({
    deviceid:[{
        type:String,
        required:true
    }],
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminmodel",
        required: true
  },
  devicetype: {
        type: String,
        enum: {
            values: ['android', 'ios', 'web'],
            message: '{VALUE} is not supported. Choose android, ios, or web.'
        },
        default: 'android',
        required: true
    }
},{Timestamp:true});


const devices= mongoose.model('devicesmodel',deviceschema);

module.exports= devices
// https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/#mongodb-update-up.-addToSet