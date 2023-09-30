const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// create post
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// delete post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No Post with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


// update post
router.put('/:id', withAuth, async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body
    try {
        const postData = await Post.findByPk(postId);

        if (!postData) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        postData.title = title;
        postData.content = content;

        await postData.save();

        res.status(200).json({ message: 'Post updated', postData });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router
