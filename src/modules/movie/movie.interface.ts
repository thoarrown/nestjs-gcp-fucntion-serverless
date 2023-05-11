export type Movie = {
  title: string;
  youtubeId: string;
  playlistCoverId: string;
  country: string;
  category: CategoryEnum;
  createdAt: Date;
  updatedAt: Date;
};

enum CategoryEnum {
  'Food',
  'Travel',
  'Funny',
  'Music',
}
