const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

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
        let existingUser = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (existingUser) {
          // Optionally update token
          existingUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              accessToken,
              refreshToken,
            },
          });
          return done(null, existingUser);
        }

        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            photo: profile.photos?.[0]?.value || null,
            accessToken,
            refreshToken,
          },
        });

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
  done(null, user.id); // use Prisma user's ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
