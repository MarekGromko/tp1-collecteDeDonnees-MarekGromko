import dotenv from "dotenv";
dotenv.config({quiet: true});
process.env.NODE_CONFIG_PARSER = '../config.parser.js'
process.env.NODE_CONFIG_DIR    = './config'