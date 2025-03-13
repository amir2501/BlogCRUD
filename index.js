import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const frontendPort = 1000;
const backendPort = 5050;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
        "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
        "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve frontend
app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", { posts });
  } catch (error) {
    res.status(500).json({ message: "Error rendering page" });
  }
});

// Render new post page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Render edit post page
app.get("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  res.render("modify.ejs", {
    heading: "Edit Post",
    submit: "Update Post",
    post,
  });
});

// Backend API Routes

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Get a specific post by ID
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post);
});

// Create a new post
app.post("/posts", (req, res) => {
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString(),
  };

  posts.push(newPost);
  res.redirect("/");
});

// Update a post
app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.author = req.body.author || post.author;
  res.json(post);
});

// Delete a post
app.get("/api/posts/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== id);
  res.redirect("/");
});

// Start the server
app.listen(frontendPort, () => {
  console.log(`Server is running at http://localhost:${frontendPort}`);
});