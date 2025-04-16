// middlewares/validateBookedSlotsRequest.js
const validateBookedSlotsRequest = (req, res, next) => {
  const { year, startMonth, endMonth } = req.params;
  const { accessToken } = req.query; // Get the access token from query params

  // Check if access token is provided
  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  // Validate month range (between 1 and 12, and startMonth <= endMonth)
  if (
    parseInt(startMonth) < 1 ||
    parseInt(endMonth) > 12 ||
    parseInt(startMonth) > parseInt(endMonth)
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid month range. Ensure the months are between 1 and 12 and startMonth <= endMonth.",
      });
  }

  // Check if the year is a valid number
  if (isNaN(year) || parseInt(year) <= 0) {
    return res.status(400).json({ error: "Invalid year provided." });
  }

  // Pass the validated data to the next middleware or controller
  req.year = parseInt(year);
  req.startMonth = parseInt(startMonth) - 1; // Adjust to 0-based month
  req.endMonth = parseInt(endMonth) - 1; // Adjust to 0-based month
  req.accessToken = accessToken;

  next(); // Proceed to the controller
};

module.exports = validateBookedSlotsRequest;
