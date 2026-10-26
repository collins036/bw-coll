const nodemailer = require("nodemailer");
const express = require('express');
require('dotenv').config();
const webEmail = process.env.WEB_EMAIL;
const webEmailPass = process.env.WEB_EMAIL_PASS;
const adminEmail = process.env.ADMIN_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: webEmail,
    pass: webEmailPass,
  },
});

// General-purpose email function
async function sendEmail(params) {
  return transporter.sendMail({
    from: webEmail,
    to: adminEmail,
    subject: params.subject || "Website Notification",
    text: params.text || "",
    html: params.html,
  });
}

// Email sent when someone clicks your website button
async function sendVisitNotification({ button, clickedAt }) {
  return sendEmail({
    to: adminEmail,
    subject: "Someone clicked Visit Website",
    text: [
      "Someone clicked the visit button on your website.",
      "",
      `Button: ${button}`,
      `Time: ${clickedAt}`,
    ].join("\n"),
  });
}

module.exports = {
  sendVisitNotification,
};