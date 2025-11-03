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

const datasource = config.get<any>("db");

const seedDb = async ()=>{
    if(datasource['init-load'] !== 'always') return;
    const seed = YAML.load(readFileSync(datasource["seed-filepath"], 'utf-8')) as any;
    await mongoose.connection.dropDatabase();
    await User.Model.insertMany(seed.User);
    await Movie.Model.insertMany(seed.Movie);
    await Serie.Model.insertMany(seed.Serie);
    await Season.Model.insertMany(seed.Season);
    await Episode.Model.insertMany(seed.Episode);
    await Rating.Model.insertMany(seed.Rating);
}

const uri = datasource['env-uri'] ?
            process.env.DB_URI : 
            datasource.uri;
            
mongoose.connect(uri).then(seedDb);
