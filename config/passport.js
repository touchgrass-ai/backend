const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:5000/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // user = new User({
                    //     googleId: profile.id,
                    //     username: profile.displayName, // Using Google profile name as username
                    //     profilePicture: profile.photos[0].value,
                    //     exp: 0, // Default experience points
                    //     rewardsEarned: [], // Empty rewards array
                    //     preferences: [], // Empty preferences array (to be set by user later)
                    //     tasks: [] // Empty tasks array
                    // });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
