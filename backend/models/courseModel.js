const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Technology", "Business", "Art", "Science", "Health", "Other"],
      required: true,
    },
    content: [
      {
        title: { type: String, required: true },
        type: { type: String, enum: ["video", "text", "quiz"], required: true },
        url: {
          type: String,
          required: function () { return this.type === "video"; } // Required if content type is video
        },
        text: {
          type: String,
          required: function () { return this.type === "text"; } // Required if content type is text
        },
        quiz: [
          {
            question: {
              type: String,
              required: function () { return this.parent().type === "quiz"; } // Required if content type is quiz
            },
            options: {
              type: [String],
              required: function () { return this.parent().type === "quiz"; } // Required if content type is quiz
            },
            answer: {
              type: String,
              required: function () { return this.parent().type === "quiz"; } // Required if content type is quiz
            },
          }
        ],
      },
    ],
    thumbnail: {
      type: String,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
