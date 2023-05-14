import * as mongoose from 'mongoose';

export const movieSchema = new mongoose.Schema({
  title: String,
  youtube_id: String,
  playlist_cover_id: String,
  country_code: String,
  category: {
    type: String,
    enum: ['Food', 'Travel', 'Funny', 'Music', 'Others'],
    required: true,
  },
  params: String,
  created_at: Date,
  updated_at: Date,
  width: String,
  height: String,
  poster: String,
  ad_network: Boolean,
  no_cookie: Boolean,
  playlist: Boolean,
});
