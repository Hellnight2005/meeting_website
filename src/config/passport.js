const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("@/models/User"); // path to your model
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // Optionally update token
          existingUser.accessToken = accessToken;
          existingUser.refreshToken = refreshToken;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create a new user
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          photo: profile.photos?.[0]?.value || null,
          accessToken,
          refreshToken,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error("Error in Google Strategy callback:", error);
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user._id); // store only the ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
