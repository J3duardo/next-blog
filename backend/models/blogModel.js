const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      index: true,
      unique: true,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {},
      required: true,
      min: 200,
      max: 2000000
    },
    excerpt: {
      type: String,
      required: true,
      max: 1000
    },
    mtitle: {
      type: String
    },
    mdescription: {
      type: String
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true
      }
    ],
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tag",
        required: true
      }
    ],
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }
  }, 
  {timestamps: true}
);

module.exports = mongoose.model("Blog", blogSchema);