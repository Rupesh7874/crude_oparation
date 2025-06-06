const usermodel = require('../models/usermodel');
const devicemodel = require('../models/device');
const adminmodel = require('../models/usermodel');
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
    const { email, password, deviceid, devicetype, userid } = req.body;

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

    const token = jwt.sign({ userid: userid, role: user.roles }, secretKey, {
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

exports.getalluser = async (req, res) => {
  try {
    const data = await usermodel.aggregate([

      {
        $group: {
          _id: "$roles",
          user_count: { $sum: 1 },
          maximum_student_age: { $min: "$age" },
          // user_name: { $push: "$name" },
        }
      }

      // {$sortByCount:'$roles'}, 

      // { $match: { age: { $gt: "10" } } },
      // { $skip: 2 },
      // { $limit: 3 }

      // { $sort: { age: 1 } },
      // { $project: { name: 1, age: 1, _id: 0 } }

      // {
      //   $match: {
      //     $and: [
      //       { age: { $gte: "20" } },
      //       { roles: "admin" },
      //       { gender: "female" }
      //     ]
      //   }
      // },



    ])
    console.log(data);
    res.status(200).json({ msg: "all user get sucessfully", status: 1, data })

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error in login process", status: 0 });
  }
}

// exports.getalluser = async (req, res) => {
//   try {

//     //  const aa = await usermodel.aggregate([
//     //   {$sortByCount:"$roles"}
//     // ]);


//     // const aa = await usermodel.aggregate([
//     //   { $match : {age : {$gt:'20'}}},
//     //   {$sort:{age:1,name:1}},
//     //   {$project:{name:1,email:1,roles:1,age:1,_id:0 }},
//     //   {$skip:3},
//     //   {$limit:2}
//     // ]);

//     //group start

//     // const aa = await usermodel.aggregate([
//     //   {
//     //     $group: {
//     //       _id: '$roles',
//     //       first_user: { $first: "$name" },  //first_name is custom name
//     //       last_user: { $last: "$$ROOT" },
//     //       Top_user: { $top:{       //top and bottom 
//     //         output:["$name","$email","$age"],
//     //         sortBy:{"age": -1}
//     //       }},
//     //       Top_user: {
//     //         $topN: {     //topN and bottomN
//     //           output: ["$name", "$email", "$age"],
//     //           sortBy: { "age": 1 },
//     //           n: 2
//     //         }
//     //       },
//     //       count: { $count: {} },     // count is custom name
//     //       username: { $push: "$$ROOT" },  //username is custom name
//     //       max_user_age: { $max: "$age" },  //max_user_age is custom name
//     //       min_user_age: { $min: "$age" },  //min_user_age is customname
//     //       avrage_user_age: { $avg: "$age" },  // avg , median will not work if age number are string
//     //     }
//     //   }
//     // ])

//     //group end

//     //bucket start
//     const aa = await usermodel.aggregate([
//       // {
//       //   $bucket: {
//       //     groupBy: "$age",
//       //     boundaries: ["20", "25", "30", "35", "40"],
//       //     default: "user is immature",
//       //     output: {
//       //       count: { $sum: 1 },
//       //       names: { $push: "$name" }, 
//       //       ages: { $push: "$age" }
//       //     }
//       //   }
//       // },
//       {
//         $addFields: {
//           age: { $toInt: "$age" } 
//         }
//       },
//       {
//         $bucketAuto: {
//           groupBy: "$age",
//           buckets: 5,
//           output: {
//             count: { $sum: 1 },
//             user_average: { $avg: "$age" },
//             // names: { $push: "$name" },
//             // ages: { $push: "$age" }
//           }
//         }
//       }
//     ])
//     //bucket end
//     console.log(aa);
//     res.status(200).json({ status: 1, users: aa });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Error in fetching users", status: 0 });
//   }
// };

exports.viewalldevice = async (req, res) => {
  try {
    const aa = await devicemodel.aggregate([
      {
        $lookup: {
          from: "adminmodels",
          localField: "userid",
          foreignField: "_id",
          as: "alldata"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: ["$alldata", 0] },
              "$$ROOT"
            ]
          }
        }
      },
      { $project: { alldata: 0 } }
    ])
    res.status(200).json({ msg: "all device data get sucessfully", aa })
    console.log(aa);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error in fetching device", status: 0 });
  }
}