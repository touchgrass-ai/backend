const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User"); // Adjust based on actual path
const Task = require("./models/Task"); // Adjust based on actual path
const Reward = require("./models/Reward"); // Adjust based on actual path

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Sample data for rewards (cashback from restaurants or gift redemptions from shops)
const rewardCategories = ["Cashback", "Gift Redemption"];
const restaurants = ["The Pancake Parlour", "Chin Chin", "Hakata Gensuke", "Movida", "Gami Chicken", "400 Gradi"];
const shops = ["Myer", "David Jones", "Nike Store", "Apple Store", "Uniqlo", "JB Hi-Fi"];
const discounts = ["10% Cashback", "20% Off", "$5 Gift Card", "$10 Voucher", "Free Dessert", "Buy 1 Get 1 Free"];

// Generate 50 rewards
const generateRewards = () => {
    return Array.from({ length: 50 }, (_, i) => {
        const category = rewardCategories[Math.floor(Math.random() * rewardCategories.length)].toLowerCase();
        const place = category === "Cashback" ? restaurants[Math.floor(Math.random() * restaurants.length)] :
                      shops[Math.floor(Math.random() * shops.length)];

        return {
            code: `REWARD${String(i + 1).padStart(3, "0")}`,
            name: `${discounts[Math.floor(Math.random() * discounts.length)]} at ${place}`,
            description: `Enjoy ${discounts[Math.floor(Math.random() * discounts.length)]} when you visit ${place} in Melbourne.`,
            redeemed: false
        };
    });
};

// Sample data for tasks (activities to do in Melbourne, Australia)
const taskTypes = ["Explore", "Food", "Shop", "Cultural", "Adventure", "Social"];
const locations = ["Queen Victoria Market", "Federation Square", "Royal Botanic Gardens", "Chadstone Shopping Centre", 
                   "Hosier Lane", "St Kilda Beach", "Southbank Promenade", "Great Ocean Road", "Dandenong Ranges", "NGV"];
const activities = ["Try a new dish at", "Take a photo at", "Attend a free event at", "Explore", "Walk along", 
                    "Buy a souvenir from", "Join a guided tour at", "Go cycling near", "Have a picnic at", "Watch the sunset at"];

// Generate 50 tasks
const generateTasks = () => {
    return Array.from({ length: 50 }, (_, i) => ({
        type: taskTypes[Math.floor(Math.random() * taskTypes.length)].toLowerCase(),
        detail: `${activities[Math.floor(Math.random() * activities.length)]} ${locations[Math.floor(Math.random() * locations.length)]}`,
        rewardType: ["Gold", "Silver", "Bronze", "Platinum", "Diamond"][Math.floor(Math.random() * 5)].toLowerCase(),
        completionCriteria: `Complete this activity and check-in with a photo at ${locations[Math.floor(Math.random() * locations.length)]}`,
        taskCompleted: false
    }));
};

// Function to assign rewards & tasks to existing users
const assignRewardsAndTasksToUsers = async () => {
    try {
        const users = await User.find(); // Get all users
        const rewards = await Reward.find(); // Get all rewards
        const tasks = await Task.find(); // Get all tasks

        if (users.length === 0) {
            console.log("⚠️ No users found. Skipping user assignment.");
            return;
        }

        for (const user of users) {
            // Assign 2 random rewards & 2 random tasks per user
            const assignedRewards = rewards.sort(() => 0.5 - Math.random()).slice(0, 2);
            const assignedTasks = tasks.sort(() => 0.5 - Math.random()).slice(0, 2);

            user.rewardsEarned = assignedRewards.map(r => r._id);
            user.tasks = assignedTasks.map(t => t._id);
            await user.save();
        }

        console.log("✅ Users successfully assigned tasks and rewards!");
    } catch (err) {
        console.error("❌ Error assigning rewards/tasks to users:", err);
    }
};

// Seed the database
const seedDatabase = async () => {
    try {
        await Reward.deleteMany({});
        await Task.deleteMany({});

        const rewards = generateRewards();
        const tasks = generateTasks();

        await Reward.insertMany(rewards);
        await Task.insertMany(tasks);

        console.log("✅ 50 Rewards and 50 Tasks inserted successfully!");

        // Assign rewards & tasks to users
        await assignRewardsAndTasksToUsers();

        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        mongoose.connection.close();
    }
};

seedDatabase();
