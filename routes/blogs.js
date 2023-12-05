const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Blog = require('../models/Blog');
const { query, validationResult, body } = require('express-validator');


router.get('/fetchallblogs', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.json(blogs)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

})



router.post('/addblog', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter valid description').isLength({ min: 5 }),
], async (req, res) => {
    try {


        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const blog = new Blog({
            title, description, tag, user: req.user.id
        })
        const savedBlog = await blog.save()


        res.json(savedBlog)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");


    }
})



router.put('/updateblog/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    const newBlog = {};
    if (title) { newBlog.title = title };
    if (description) { newBlog.description = description };
    if (tag) { newBlog.tag = tag };

    let blog = await Blog.findById(req.params.id);
    if (!blog) { return res.status(404).send("Not Found") }

    if (blog.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true })
    res.json({ blog });

})

router.get('/blogbyId/:id', fetchuser, async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findOne({ _id: blogId, user: req.user.id });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
    }

})



module.exports = router