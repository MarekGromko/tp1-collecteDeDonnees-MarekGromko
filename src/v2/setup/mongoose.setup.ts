import config from "config"
import mongoose from "mongoose";
import { readFileSync } from "fs";
import * as YAML from "js-yaml";
import { User } from "../model/user.model";
import { Movie } from "../model/movie.model";
import { Serie } from "../model/serie.model";
import { Season } from "../model/season.mode";
import { Episode } from "../model/episode.model";
import { Rating } from "../model/rating.model";

const seedDb = async ()=>{
    const seed = YAML.load( readFileSync(config.get<string>("db.seed-filepath"), 'utf-8') ) as any;
    await mongoose.connection.dropDatabase();
    await User.Model.insertMany(seed.User);
    await Movie.Model.insertMany(seed.Movie);
    await Serie.Model.insertMany(seed.Serie);
    await Season.Model.insertMany(seed.Season);
    await Episode.Model.insertMany(seed.Episode);
    await Rating.Model.insertMany(seed.Rating);
}

mongoose.connect(config.get<string>("db.uri")).then(seedDb);
