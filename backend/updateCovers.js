require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Book = require("./models/bookModel");

// Cover images mapped by ISBN (optimized: Amazon _SL300_, OpenLibrary -M)
const coverImages = {
  // ─── CLASS 10 ───
  "978-9352530557": "https://m.media-amazon.com/images/I/81YOFDnDCUL._SL300_.jpg",   // RD Sharma Math 10
  "978-8174506313": "https://m.media-amazon.com/images/I/81yiGLQBTkL._SL300_.jpg",   // NCERT Science 10
  "978-8174506320": "https://m.media-amazon.com/images/I/71lBsXJRaTL._SL300_.jpg",   // NCERT Social Science 10
  "978-8174506344": "https://m.media-amazon.com/images/I/71mOhpEWV+L._SL300_.jpg",   // NCERT English First Flight 10
  "978-8174506351": "https://m.media-amazon.com/images/I/71SYC6X5PIL._SL300_.jpg",   // NCERT Hindi Kshitij 10

  // ─── CLASS 11 ───
  "978-8174506481": "https://m.media-amazon.com/images/I/71GiNb+JQjL._SL300_.jpg",   // NCERT Physics P1 11
  "978-8174506498": "https://m.media-amazon.com/images/I/71xGBLOJd1L._SL300_.jpg",   // NCERT Physics P2 11
  "978-8174506504": "https://m.media-amazon.com/images/I/71PqtthMdWL._SL300_.jpg",   // NCERT Chemistry P1 11
  "978-8174506528": "https://m.media-amazon.com/images/I/71Qx2fDLURL._SL300_.jpg",   // NCERT Math 11
  "978-8174506535": "https://m.media-amazon.com/images/I/71lx5hOuVeL._SL300_.jpg",   // NCERT English Hornbill 11
  "978-8174506559": "https://m.media-amazon.com/images/I/71Xq1V1yHTL._SL300_.jpg",   // NCERT Accountancy 11

  // ─── CLASS 12 ───
  "978-8174506610": "https://m.media-amazon.com/images/I/71KOOM+qURL._SL300_.jpg",   // NCERT Physics P1 12
  "978-8174506627": "https://m.media-amazon.com/images/I/71tueDN3ciL._SL300_.jpg",   // NCERT Physics P2 12
  "978-8174506634": "https://m.media-amazon.com/images/I/71z8TrNBYKL._SL300_.jpg",   // NCERT Chemistry P1 12
  "978-8174506658": "https://m.media-amazon.com/images/I/71Y3EPfc4KL._SL300_.jpg",   // NCERT Math P1 12
  "978-8174506665": "https://m.media-amazon.com/images/I/71AjJN1BP1L._SL300_.jpg",   // NCERT Math P2 12
  "978-8174506672": "https://m.media-amazon.com/images/I/71Fz3KmIO+L._SL300_.jpg",   // NCERT English Flamingo 12
  "978-8174506689": "https://m.media-amazon.com/images/I/71d952ij09L._SL300_.jpg",   // NCERT Biology 12

  // ─── BCA SEM 4 ───
  "978-1119800361": "https://covers.openlibrary.org/b/isbn/9781119800361-M.jpg",       // OS Concepts Silberschatz
  "978-9332518742": "https://covers.openlibrary.org/b/isbn/9780132126953-M.jpg",       // Computer Networks Tanenbaum
  "978-9354600555": "https://covers.openlibrary.org/b/isbn/9780078022128-M.jpg",       // Software Engineering Pressman
  "978-0072465631": "https://covers.openlibrary.org/b/isbn/9780072465631-M.jpg",       // DBMS Ramakrishnan
  "978-1259676512": "https://covers.openlibrary.org/b/isbn/9781259676512-M.jpg",       // Discrete Math Rosen

  // ─── BCA SEM 5 ───
  "978-9354246340": "https://m.media-amazon.com/images/I/81dp68XHORL._SL300_.jpg",   // Web Technologies Godbole
  "978-1260463422": "https://covers.openlibrary.org/b/isbn/9781260463422-M.jpg",       // Java Schildt
  "978-0134610993": "https://covers.openlibrary.org/b/isbn/9780134610993-M.jpg",       // AI Russell & Norvig
  "978-0131202382": "https://covers.openlibrary.org/b/isbn/9780131202382-M.jpg",       // Computer Graphics Hearn
  "978-0199480173": "https://m.media-amazon.com/images/I/71Fqsv2SYyL._SL300_.jpg",   // Python Reema Thareja

  // ─── BCA SEM 6 ───
  "978-0133387520": "https://covers.openlibrary.org/b/isbn/9780133387520-M.jpg",       // Cloud Computing Erl
  "978-1439851234": "https://covers.openlibrary.org/b/isbn/9781439851234-M.jpg",       // Cyber Security
  "978-1259096952": "https://covers.openlibrary.org/b/isbn/9780070428072-M.jpg",       // Machine Learning Mitchell
  "978-9351199250": "https://m.media-amazon.com/images/I/71J3+KMnEBL._SL300_.jpg",   // Android Pradeep Kothari
  "978-1118876138": "https://covers.openlibrary.org/b/isbn/9781118876138-M.jpg",       // Data Science EMC
  "978-1484274002": "https://covers.openlibrary.org/b/isbn/9781484274002-M.jpg",       // Full Stack MERN
};

const updateCovers = async () => {
  try {
    await connectDB();
    console.log("Connected to database.\n");

    let updated = 0;
    let notFound = 0;

    for (const [isbn, imageUrl] of Object.entries(coverImages)) {
      const book = await Book.findOneAndUpdate(
        { ISBN: isbn },
        { coverImage: imageUrl },
        { new: true }
      );

      if (book) {
        console.log(`  ✅  "${book.title}" → cover added`);
        updated++;
      } else {
        console.log(`  ❌  ISBN ${isbn} not found in database`);
        notFound++;
      }
    }

    console.log(`\n Done! Updated: ${updated} | Not found: ${notFound}`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating covers:", error.message);
    process.exit(1);
  }
};

updateCovers();
