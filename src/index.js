const express = require("express");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
})

app.use(router);

app.listen(3000, 'localhost', () => console.log(`Server running on port 3000`));
