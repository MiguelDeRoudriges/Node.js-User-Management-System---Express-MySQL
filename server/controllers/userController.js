const mysql = require('mysql');

// Connect to DB
const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {

        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

        //User the connection
                connection.query('SELECT * FROM user WHERE status = "active" ', (err, rows) => {
                   // When done with the connection, release it
                        connection.release();

                        if (!err) {
                                let removedUser = req.query.removed;
                                res.render('home', {rows, removedUser});
                        }
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}
exports.find = (req, res) => {
        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                let searchTerm = req.body.search

                //User the connection
                connection.query('SELECT * FROM user WHERE first_name OR last_name LIKE ? OR last_name LIKE ?',
                    ['%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
                        // When done with the connection, release it
                        connection.release();

                        if (!err)  res.render('home', {rows});
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}

exports.form = (req, res) => {
        res.render('add-user');

}
// Add new user
exports.create = (req, res) => {

        const {first_name, last_name, email, phone, comments} = req.body;

        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                let searchTerm = req.body.search

                //User the connection
                connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',[first_name,last_name, email, phone,comments], (err, rows) => {
                            // When done with the connection, release it
                            connection.release();

                            if (!err)  res.render('add-user', {alert: 'User added successfully!'});
                            else       console.log(err);

                            console.log('The data from user table: \n', rows);
                    });
        });
}
// Add edit user
exports.edit = (req, res) => {

        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                //User the connection
                connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        // When done with the connection, release it
                        connection.release();

                        if (!err)  res.render('edit-user', {rows});
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}

// Update user
exports.update = (req, res) => {
        const { first_name, last_name, email, phone, comments} = req.body;

        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                //User the connection
                connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id= ?',
                    [first_name,last_name, email, phone,comments, req.params.id], (err, rows) => {
                        // When done with the connection, release it
                        connection.release();
                        if (!err) {
                                pool.getConnection((err, connection) => {
                                        if (err) return console.error("Ошибка: " + err.message);
                                        else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                                        //User the connection
                                        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                                                // When done with the connection, release it
                                                connection.release();

                                                if (!err)  res.render('edit-user', {rows, alert: `${first_name} has been updated.`});
                                                else       console.log(err);

                                                console.log('The data from user table: \n', rows);
                                        });
                                });
                        }
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}

//Delet user
exports.delete = (req, res) => {

        // pool.getConnection((err, connection) => {
        //         if (err) return console.error("Ошибка: " + err.message);
        //         else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);
        //
        //         //User the connection
        //         connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        //                 // When done with the connection, release it
        //                 connection.release();
        //
        //                 if (!err)  res.redirect('/');
        //                 else       console.log(err);
        //
        //                 console.log('The data from user table: \n', rows);
        //         });
        // });


        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
                        connection.release();

                        if (!err) {
                                let removedUser = encodeURIComponent('User successfully removed')
                                res.redirect('/?removed =' + removedUser);
                        }
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}

exports.viewall = (req, res) => {

        pool.getConnection((err, connection) => {
                if (err) return console.error("Ошибка: " + err.message);
                else console.log("Подключение к серверу MySQL успешно установлено " + connection.threadId);

                //User the connection
                connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        // When done with the connection, release it
                        connection.release();

                        if (!err)  res.render('view-user', {rows});
                        else       console.log(err);

                        console.log('The data from user table: \n', rows);
                });
        });
}









