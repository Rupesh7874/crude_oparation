const mongoose=require('mongoose');


const deviceschema= new mongoose.Schema({
    deviceid:{
        type:String,
        required:true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminmodel",
        required: true
  },
    devicetype:{
        type:String,
        enum: ['android', 'ios', 'web'],
        default:'android',
        required:true
    }
},{Timestamp:true});


const devices= mongoose.model('devicesmodel',deviceschema);

module.exports= devices