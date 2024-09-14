export type Playlist = {
  id: string; // include this in the csv?
  name: string; // -> try to use the hover image component.
  owner: string; // here we try to fetch display_name, fallback with id and link it using owner.href
  description: string; // can be null.
  followers: number;
  link: string; // use href property.
};

