const DB = require("../models");
const bcrypt = require("bcrypt");

const AdminsDB = DB.admins;
const Op = DB.Sequelize.Op;

exports.create = async (req, res) => {
	try {

		// check if username is unique
		let isUnique =  await AdminsDB.findOne({
			where: {username: req.body.username}
		})

		if(isUnique) {
			return res.status(400).send({
				status: 400,
				success: false,
				message: "Validation Error",
				errors: [{
					"value": req.body.username,
					"msg": "Username already taken",
					"param": "username",
					"location": "body"
        }]
			});
		} 

		const NewAdmin = await AdminsDB.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      fullname: req.body.fullname
    })

		return res.send({
			status: 200,
			success: true,
			message: "New Admin Created!",
			data: {
				username: req.body.username,
				fullname: req.body.fullname
			}
		})

	} catch (error) {
		return res.status(500).send({
			status: 500,
			success: false,
			message: "Unexpected Error",
			errors: error.message || "Some error occurred"
		});
	}
}