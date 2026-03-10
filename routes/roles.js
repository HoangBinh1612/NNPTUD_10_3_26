const express = require('express');
let router = express.Router();
let slugify = require('slugify');
let roleSchema = require('../schemas/roles');
let userSchema = require('../schemas/users');

// GET /roles - Lấy tất cả roles
router.get('/', async (req, res) => {
    let queries = req.query;
    let nameQ = queries.name ? queries.name : '';
    let dataRoles = await roleSchema.find({
        isDeleted: false,
        name: new RegExp(nameQ, 'i')
    });
    res.send(dataRoles);
});

// GET /roles/:id - Lấy role theo id
router.get('/:id', async (req, res) => {
    try {
        let dataRole = await roleSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!dataRole) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(dataRole);
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" });
    }
});

// GET /roles/:id/users - Yêu cầu 4: Lấy tất cả users có role = id
router.get('/:id/users', async (req, res) => {
    try {
        let id = req.params.id;
        let roleData = await roleSchema.findOne({
            _id: id,
            isDeleted: false
        });
        if (!roleData) {
            res.status(404).send({ message: "Role ID NOT FOUND" });
        } else {
            let users = await userSchema.find({
                role: id,
                isDeleted: false
            });
            res.send(users);
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" });
    }
});

// POST /roles - Tạo role mới
router.post('/', async (req, res) => {
    try {
        let newItem = new roleSchema({
            name: req.body.name,
            description: req.body.description
        });
        await newItem.save();
        res.send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT /roles/:id - Cập nhật role
router.put('/:id', async (req, res) => {
    try {
        let getItem = await roleSchema.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (getItem) {
            res.send(getItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE /roles/:id - Xoá mềm
router.delete('/:id', async (req, res) => {
    try {
        let getItem = await roleSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!getItem) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            getItem.isDeleted = true;
            await getItem.save();
            res.send(getItem);
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
