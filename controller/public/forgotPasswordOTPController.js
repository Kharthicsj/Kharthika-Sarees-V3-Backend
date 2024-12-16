import userModel from "../../models/User.js";
import nodemailer from "nodemailer";

let generatedOtp = null;
let otpExpiration = null;

async function ForgotPasswordOTPController(req, res) {
  const { action } = req.query;

  try {
    if (action === 'send') {
      const { email } = req.body;

      // Check if email is provided
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Fetch user from the database using the email
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'No user found with this email address' });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Store the generated OTP globally and set expiration time
      generatedOtp = otp;
      otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.APP_PASSWORD,
        },
      });

      // Prepare email content
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your OTP for Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Hi ${user.name},</h2>
            <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
            <h3 style="color: #e63946;">${otp}</h3>
            <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Team</p>
          </div>
        `,
      };

      // Send OTP email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: 'OTP sent successfully' });

    } else if (action === 'validate') {
      const { otp } = req.body;

      // Check if the OTP exists and is not expired
      if (!generatedOtp) {
        return res.status(400).json({ message: 'No OTP found. Please request a new OTP.' });
      }

      if (Date.now() > otpExpiration) {
        generatedOtp = null; // Clear expired OTP
        otpExpiration = null;
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      }

      // Validate the entered OTP
      if (otp === String(generatedOtp)) {
        generatedOtp = null; // Clear OTP after successful validation
        otpExpiration = null;
        return res.status(200).json({ message: 'OTP is valid' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      }

    } else {
      return res.status(400).json({ message: 'Invalid action. Use "send" or "validate".' });
    }
  } catch (error) {
    console.error('Error in ForgotPasswordOTPController:', error);
    return res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
}

export default ForgotPasswordOTPController;
