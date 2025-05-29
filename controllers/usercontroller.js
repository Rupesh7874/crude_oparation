const usermodel = require('../models/usermodel');
const devicemodel = require('../models/device');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.ragister = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, age, gender, roles } = req.body;
    const checkmail = await usermodel.findOne({ email });
    if (checkmail) {
      res.status(400).json({ msg: "admin alredy ragister", status: 0 })
    }
    if (password !== confirmpassword) {
      res.status(400).json({ msg: "password and confirmpassword are not same", status: 0 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const admin = new usermodel({
      name,
      email,
      password: hashed,
      age,
      gender,
      roles
    })
    const admindata = await admin.save();
    if (admindata) {
      res.status(200).json({ msg: "admin ragister sucessfully", status: 1, admindata })
    } else {
      res.status(400).json({ msg: "admin not ragister", status: 0 })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error in adminragistration" })
  }
}



const storetoken = [];

exports.login = async (req, res) => {
  try {
    const { email, password, deviceid, devicetype,userid } = req.body;
    
    const user = await usermodel.findOne({ email });
    // console.log(user.roles);
    
    if (!user) {
      return res.status(400).json({ msg: "Admin not found", status: 0 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password", status: 0 });
    }

    const existingDevice = await devicemodel.findOne({ userid: user._id, devicetype });


    const totalDevices = await devicemodel.countDocuments({ userid: user._id });

    if (!existingDevice && totalDevices >= 5) {
      return res.status(403).json({ msg: "Maximum device limit 5 device", status: 0 });
    }

    if (!existingDevice) {
      const newDevice = new devicemodel({
        deviceid,
        userid: user._id,
        devicetype
      });
      await newDevice.save();
    } else {
      await devicemodel.updateOne({ userid: user._id, devicetype }, { $addToSet: { deviceid: deviceid } });
    }

    if (storetoken.length >= 5) {
      return res.status(403).json({ msg: "max 5 token", status: 0 });
    }

    let secretKey = 'exam3';
    let expiry;

    switch (user.roles) {
      case 'admin':
        expiry = '1m';
        break;
      case 'buyer':
        expiry = '20m';
        break;
      case 'seller':
        expiry = '10m';
        break;
      default:
        return res.status(400).json({ msg: "Invalid role", status: 0 });
    }

    const token = jwt.sign({ userid: userid,role:user.roles}, secretKey, {
      expiresIn: expiry
    });

    // user.tokens.push(token);
    storetoken.push(token)
    await user.save();

    res.status(200).json({
      msg: `${user.roles} login successful`,
      status: 1,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.roles,
        devices: totalDevices
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error in login process", status: 0 });
  }
};
