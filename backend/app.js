const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const errorMiddleware = require("./middlewares/errorMiddleware");
const csrfProtection = require("./middlewares/csrfMiddleware");

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS configuration - allow requests from frontend only
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// CSRF protection - validates Origin header on state-changing requests
app.use(csrfProtection);

// Rate limiting - general API limiter (100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth routes (20 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);

// File upload middleware (for book cover images)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: require("os").tmpdir(),
  })
);

// Import routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Library Management System API is running",
  });
});

// Temporary: test email route (remove after debugging)
app.get("/api/test-email", async (req, res) => {
  try {
    const sendEmail = require("./utils/sendEmail");
    await sendEmail({
      email: "panchalken50@gmail.com",
      subject: "Render SMTP Test",
      html: "<p>If you see this, SMTP works on Render!</p>",
    });
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ success: false, message: error.message, code: error.code });
  }
});

// Centralized error handler (must be after routes)
app.use(errorMiddleware);

module.exports = app;
