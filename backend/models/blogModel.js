const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      index: {
        unique: true,
        collation: {locale: "en", strength: 2}
      }
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
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
);

module.exports = mongoose.model("Blog", blogSchema);