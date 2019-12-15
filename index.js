console.clear();
require("dotenv").config();

// Init cfg and other values
const { port, db_name } = require("./config.json");
const { logger, get_slug, gen_str, get_bio } = require("./util");
const is_dev = process.env.PROD == "false" ? true : false;

logger.info(`Starting script, is dev: ${is_dev}`);

// Routers
const routers = require("./routers");
logger.info(`[STARTUP] Loaded routers`);

// Init modules
const express = require("express");
const app = express();
logger.info(`[STARTUP] Loaded express`);

const handlebars = require("express-handlebars");
logger.info(`[STARTUP] Loaded handlebars`);

const { MongoClient } = require("mongodb");
const db_url = "mongodb://localhost:27017/" + db_name;

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

logger.info(`[STARTUP] Loaded mongo and sessions`);
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

logger.info(`[STARTUP] Loaded passport`);

app.engine("handlebars", handlebars({
	helpers: {
		...require("./handlebars_helpers"),
		get_bio
	}
}));
app.set("view engine", "handlebars");

MongoClient.connect(db_url, {	
	useNewUrlParser: true,
	useUnifiedTopology: true
	}, (err, client) => {
	if(err) {
		logger.error(err, "BgRed");
		return;
	}
	db = client.db(db_name);
	logger.info(`[STARTUP] Established DB connection`);
});

mongoose.connect(db_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
const mongoose_db = mongoose.connection;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: "my-secret",
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose_db })
}));

// Passport again;
passport.use(passport.initialize())
passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT,
		clientSecret: process.env.GOOGLE_PRIVATE,
		callbackURL: is_dev ? `http://127.0.0.1:${port}/google_auth_callback/` : "https://colors2.jipfr.nl/google_auth_callback/"
	},
	function(accessToken, refreshToken, profile, done) {
		done(null, profile);
	}
));

passport.serializeUser(async (user, done) => {
	
	let mail = (user.emails && user.emails[0] && user.emails[0].verified ? user.emails[0].value : "");

	let collection = db.collection("users");
	let i = await collection.findOne({mail: mail})
	if(i) {
		logger.success("[AUTH] User sign in: " + mail);
		await collection.updateOne({mail: mail}, {
			$set: {
				user
			}
		})
		done(null, i);
	} else {
		let new_obj = {
			g_id: user.id,
			mail: mail,
			user,
			palettes: [],
			slug: await get_slug(user),
			id: gen_str()
		}
		collection.insertOne(new_obj).then(d => {
			logger.success("[AUTH] Registered new user: " + mail);
		});
		done(null, new_obj);
	}
	
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/login//", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/google_auth_callback//", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
	res.redirect("/me/");
});



// Web routers
// app.get("/", routers.web.home);
app.get("/", routers.web.log_in);
app.get("/me/", routers.web.me);
app.get("/log-in/", routers.web.log_in);
app.get("/logout/", (req, res) => { req.logout(); res.redirect("/"); });

app.get("/u/:username/", routers.web.user_palette);
app.get("/u/:username/all/", routers.web.user_palette);
app.get("/u/:username/own/", routers.web.user_palette);
app.get("/u/:username/collections/", routers.web.user_collections);
app.get("/u/:username/p/:palette/", routers.web.user_palette);

app.get("/settings/", routers.web.settings);

// API routers
app.post("/u/:username/", routers.api.user_api);
app.post("/u/:username/own/", routers.api.user_api);
app.post("/u/:username/all/", routers.api.user_api);
app.post("/u/:username/collections/", routers.api.user_api);
app.post("/u/:username/p/:palette/", routers.api.user_api);
app.post("/api/new_palette/", routers.api.new_palette);
app.post("/api/move_palette/", routers.api.move_palette);
app.post("/api/delete_palette/", routers.api.delete_palette);
app.post("/api/add_color/", routers.api.add_color);
app.post("/api/delete_color/", routers.api.delete_color);
app.post("/api/toggle_palette_dashboard/", routers.api.toggle_palette_dashboard);
app.post("/api/toggle_palette_person/", routers.api.toggle_palette_person);
app.post("/api/toggle_palette_person_permissions/", routers.api.toggle_palette_person_permissions);

app.post("/api/set_username/", routers.api.set_username);
app.post("/api/set_color/", routers.api.set_color);
app.post("/api/set_bio/", routers.api.set_bio);

// Other routers
app.get("/image/:user/", routers.other.image);

app.use(express.static("public"));

app.get("*", (req, res, next) => {
	if(!req.url.startsWith("/u")) {
		res.redirect(`/u${req.url}`);
	} else {
		next();
	}
});

// Run express
app.listen(port, () => {
	logger.info("[STARTUP] Express running. Using port " + port);
});