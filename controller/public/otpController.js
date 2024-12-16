import nodemailer from "nodemailer";

let generatedOtp = null;
let otpExpiration = null;

const otpController = async (req, res) => {
  const { action } = req.query;

  try {
    if (action === 'send') {
      const { email, username } = req.body;

      if (!email || !username) {
        return res.status(400).json({ message: 'Email and Username are required' });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Store the generated OTP globally and set expiration time
      generatedOtp = otp;
      otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.APP_PASSWORD,
        },
      });

      // Email content
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your OTP for Account Verification',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Hi ${username},</h2>
            <p>Thank you for signing up. Please use the following OTP to verify your account:</p>
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
    console.error('Error in OTP Controller:', error);
    return res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

export default otpController;
