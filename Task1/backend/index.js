var con = require('./Connection');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:filename', function (req, res) {
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, `../${filename}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            // Handle file not found or other errors
            res.status(404).send('File not found');
        }
    });
});

// Route for the root path ("/")
app.get('/', function (req, res) {
    const filePath = path.resolve(__dirname, '../index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            // Handle file not found or other errors
            res.status(404).send('File not found');
        }
    });
});

app.post('/', function (req, res) {
    var name = req.body.Username;
    var email = req.body.Email;
    var mno = req.body.Password;

    con.connect(function (error) {
        if (error) throw error;

        // Use parameterized query to prevent SQL injection
        var sql = "INSERT INTO students (Username, Email, Password) VALUES (?, ?, ?)";
        var values = [Username, Email, Password];

        con.query(sql, values, function (error, result) {
            if (error) throw error;
            console.log("Record inserted: " + result.affectedRows);

            // Send HTML response with embedded script for the pop-up
            res.send(`
                <html>
                    <head>
                        <title>Registration Success</title>
                        <script>
                            alert("Registration Successful!");
                            window.location.href = "/";
                        </script>
                    </head>
                    <body>
                        <p>Registration Successful!</p>
                    </body>
                </html>
            `);

            console.log("Registration successful");
        });
    });
});

app.listen(7000, function () {
    console.log('Server is running on port 7000');
});

