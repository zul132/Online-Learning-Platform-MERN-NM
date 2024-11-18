const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const coursePaymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      index: true,
    },
    cardDetails: {
      cardholdername: {
        type: String,
      },
      last4Digits: {
        type: String, // Store only last 4 digits of the card number
      },
      expmonthyear: {
        type: String,
      },
    },
    status: {
      type: String,
      default: "enrolled",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash sensitive data
coursePaymentSchema.pre("save", async function (next) {
  if (this.isModified("cardDetails.cardnumber")) {
    this.cardDetails.last4Digits = this.cardDetails.cardnumber.slice(-4);
    delete this.cardDetails.cardnumber; // Remove the full card number
  }
  next();
});

const CoursePayment = mongoose.model("CoursePayment", coursePaymentSchema);

module.exports = CoursePayment;
