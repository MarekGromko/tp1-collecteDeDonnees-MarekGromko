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
    if(datasource['init-load'] === 'never') return;
    if(datasource['init-load'] === 'once') {
        if((await mongoose.connection.listCollections()).length > 0)
            return;
    } 
    const seed = YAML.load(readFileSync(datasource["seed-filepath"], 'utf-8')) as any;
    await mongoose.connection.dropDatabase();
    await User.Model.insertMany(seed.User);
    await Movie.Model.insertMany(seed.Movie);
    await Serie.Model.insertMany(seed.Serie);
    await Season.Model.insertMany(seed.Season);
    await Episode.Model.insertMany(seed.Episode);
    await Rating.Model.insertMany(seed.Rating);
}

mongoose.connect(datasource.uri).then(seedDb);
