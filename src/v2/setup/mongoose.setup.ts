import { User } from "../model/user.model";
import config from "config"
import mongoose from "mongoose";
import {load} from "js-yaml";
import { readFileSync } from "fs";

const seedDb = async ()=>{
    const seed = load( readFileSync(config.get<string>("db.seed-filepath"), 'utf-8') ) as any;
    await mongoose.connection.dropDatabase();
    User.Model.insertMany(seed.User);
    
    

}

mongoose.connect(config.get<string>("db.uri")).then(seedDb);
