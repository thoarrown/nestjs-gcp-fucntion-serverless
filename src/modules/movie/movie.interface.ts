export type Movie = {
  title: string;
  youtube_id: string;
  playlist_cover_id: string;
  country: string;
  category: CategoryEnum;
  created_at: Date;
  updated_at: Date;
};

enum CategoryEnum {
  'Food',
  'Travel',
  'Funny',
  'Music',
}
