const express = require('express');
let router = express.Router();
let userSchema = require('../schemas/users');

// GET /users - Lấy tất cả users, query theo username (includes)
router.get('/', async (req, res) => {
    let queries = req.query;
    let usernameQ = queries.username ? queries.username : '';
    let dataUsers = await userSchema.find({
        isDeleted: false,
        username: new RegExp(usernameQ, 'i')
    }).populate('role');
    res.send(dataUsers);
});

// GET /users/:id - Lấy user theo id
router.get('/:id', async (req, res) => {
    try {
        let dataUser = await userSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        }).populate('role');
        if (!dataUser) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(dataUser);
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" });
    }
});

// POST /users/enable - Yêu cầu 2: truyền email + username đúng → status = true
router.post('/enable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            res.status(404).send({ message: "Email hoặc username không đúng" });
        } else {
            user.status = true;
            await user.save();
            res.send(user);
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// POST /users/disable - Yêu cầu 3: truyền email + username đúng → status = false
router.post('/disable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            res.status(404).send({ message: "Email hoặc username không đúng" });
        } else {
            user.status = false;
            await user.save();
            res.send(user);
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// POST /users - Tạo user mới
router.post('/', async (req, res) => {
    try {
        let newItem = new userSchema({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        });
        await newItem.save();
        res.send(newItem);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT /users/:id - Cập nhật user
router.put('/:id', async (req, res) => {
    try {
        let getItem = await userSchema.findByIdAndUpdate(
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

// DELETE /users/:id - Xoá mềm
router.delete('/:id', async (req, res) => {
    try {
        let getItem = await userSchema.findOne({
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
