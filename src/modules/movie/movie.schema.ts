import * as mongoose from 'mongoose';

export const movieSchema = new mongoose.Schema({
  title: String,
  youtubeId: String,
  playlistCoverId: String,
  country: String,
  category: {
    type: String,
    enum: ['Food', 'Travel', 'Funny', 'Music'],
    required: true,
  },
  createdAt: Date,
  updatedAt: Date,
});
