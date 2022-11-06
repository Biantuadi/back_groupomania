const Post = require("../models/posts.model");
const userModel = require("../models/user.model");

exports.createPost = (req, res) => {
  if (req.file) {
    const post = new Post({
      ...req.body,
      posterId: req.body.posterId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    post
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    const post = new Post({
      ...req.body,
      posterId: req.body.posterId,
      message: req.body.message,
    });
    post
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.status(400).json("Error: " + err));
  }
};

exports.updatePost = (req, res) => {
  let post = req.body;
  Post.findByIdAndUpdate(req.params.id, { ...post }, { new: true })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.deletePost = async (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.getPosts = async (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
};

// ^\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

exports.likePost = async (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: { likes: req.params.id },
    },
    { new: true }
  )
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));

  userModel
    .findByIdAndUpdate(
      req.body.userId,
      {
        $push: { likedPosts: req.params.id },
      },
      { new: true }
    )
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.unlikePost = async (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.params.id },
    },
    { new: true }
  )
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));

  userModel
    .findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { likedPosts: req.params.id },
      },
      { new: true }
    )
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
};

// ^\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

exports.commentPost = async (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          ...req.body,
          timestamp: new Date().getTime(),
        },
      },
    },
    { new: true }
  )
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.deleteComment = (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { comments: { _id: req.body.commentId } } },
    { new: true }
  )
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));
};
