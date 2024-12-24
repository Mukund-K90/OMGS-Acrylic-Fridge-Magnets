const express = require('express');
const app = express();
const path = require('path');
const PORT = 1818;
const dotenv = require('dotenv');
dotenv.config();

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    const dictionary = {
        item1: { image: "https://s.omgs.in/wp-content/uploads/2024/01/Round-Corners-shape-min-500x500.jpg", description: "OMGs® Round Corners Acrylic Fridge Magnet\n₹349 – ₹449", type: "round-corners" },
        item2: { image: "https://s.omgs.in/wp-content/uploads/2024/01/circle-shape-min-768x768.jpg", description: "OMGs® Round Acrylic Fridge Magnet\n₹349 – ₹449", type: "round" },
        item3: { image: "https://s.omgs.in/wp-content/uploads/2024/01/Leaf-2-shape-min-2048x2048.jpg", description: "OMGs® Leaf Shape Acrylic Fridge Magnet\n₹349 – ₹449", type: "leaf" },
        item4: { image: "image4.jpg", description: "Description for item 4" },
        item5: { image: "image5.jpg", description: "Description for item 5" },
        item6: { image: "image6.jpg", description: "Description for item 6" },
        item7: { image: "image5.jpg", description: "Description for item 5" },
        item8: { image: "image6.jpg", description: "Description for item 6" },
    };
    res.render("home", { dictionary });
});

const viewRoutes = require('./src/routes/viewRoutes');
app.use('/customize', viewRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))