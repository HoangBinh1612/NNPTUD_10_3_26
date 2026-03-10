const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect('mongodb+srv://admin:Hoangbinh.059@nnptud0310.gpqdqux.mongodb.net/NNPTUD_10_3_26?retryWrites=true&w=majority')
    .then(() => {
        console.log('Kết nối MongoDB thành công!');
    })
    .catch((err) => {
        console.log('Lỗi kết nối MongoDB:', err.message);
    });

// Mount routes
let rolesRouter = require('./routes/roles');
let usersRouter = require('./routes/users');

app.use('/roles', rolesRouter);
app.use('/users', usersRouter);

// Start server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
