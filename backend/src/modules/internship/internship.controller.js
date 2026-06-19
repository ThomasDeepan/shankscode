const Internship = require("./internship.model");
const { google } = require("googleapis");
const path = require("path");

exports.applyInternship = async (req, res) => {
  try {
    // 1. Save data directly into MongoDB
    const application = await Internship.create(req.body);

    // 2. Safely trigger Google Sheets API append logic
    try {
      const auth = new google.auth.GoogleAuth({
        // Looks for service account credentials in your root directory
        keyFile: path.join(__dirname, "../../../service-account.json"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: "Sheet1!A:I", // Targets columns A through I
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              application.name,
              application.year,
              application.degree,
              application.department,
              application.college,
              application.location,
              application.phone,
              application.linkedin,
              application.github || "N/A",
            ],
          ],
        },
      });
      console.log("Successfully appended data to Google Sheets.");
    } catch (sheetError) {
      // Log sheet errors locally but don't crash the student's submission response
      console.error("Google Sheets Sync Failed:", sheetError.message);
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Admin Fetch Route: Allows the admin dashboard to read all submissions directly from MongoDB
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
