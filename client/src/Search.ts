
import Song from "./Song";

export interface DescriptionAttribution {
    kind: string;
    license_title: string;
    license_url: string;
    source_title: string;
    source_url: string;
}

export interface Album {
    albumArtRef: string;
    albumArtist: string;
    albumId: string;
    artist: string;
    artistId: string[];
    explicitType: string;
    kind: string;
    name: string;
    year: number;
    description_attribution: DescriptionAttribution;
}

export interface AlbumHit {
    album: Album;
    best_result: boolean;
    navigational_result: boolean;
    type: string;
}

export interface ArtistArtRef {
    aspectRatio: string;
    autogen: boolean;
    kind: string;
    url: string;
}

export interface ArtistBioAttribution {
    kind: string;
    source_title: string;
}

export interface Artist {
    artistArtRef: string;
    artistArtRefs: ArtistArtRef[];
    artistId: string;
    artist_bio_attribution: ArtistBioAttribution;
    kind: string;
    name: string;
}

export interface ArtistHit {
    artist: Artist;
    best_result: boolean;
    navigational_result: boolean;
    type: string;
}

export interface Playlist {
    description: string;
    kind: string;
    name: string;
    ownerName: string;
    ownerProfilePhotoUrl: string;
    shareToken: string;
    type: string;
}

export interface PlaylistHit {
    best_result: boolean;
    navigational_result: boolean;
    playlist: Playlist;
    type: string;
}

export interface Art {
    aspectRatio: string;
    autogen: boolean;
    kind: string;
    url: string;
}

export interface Series {
    art: Art[];
    author: string;
    continuationToken: string;
    copyright: string;
    description: string;
    explicitType: string;
    link: string;
    seriesId: string;
    title: string;
    totalNumEpisodes: number;
}

export interface PodcastHit {
    best_result: boolean;
    navigational_result: boolean;
    series: Series;
    type: string;
}

export interface AlbumArtRef {
    aspectRatio: string;
    autogen: boolean;
    kind: string;
    url: string;
}

export interface Thumbnail {
    height: number;
    url: string;
    width: number;
}

export interface PrimaryVideo {
    id: string;
    kind: string;
    thumbnails: Thumbnail[];
}

export interface Track {
    id: string;
    album: string;
    albumArtRef: AlbumArtRef[];
    albumArtist: string;
    albumAvailableForPurchase: boolean;
    albumId: string;
    artist: string;
    artistId: string[];
    composer: string;
    discNumber: number;
    durationMillis: string;
    estimatedSize: string;
    explicitType: string;
    genre: string;
    kind: string;
    lastModifiedTimestamp: string;
    nid: string;
    playCount: number;
    primaryVideo: PrimaryVideo;
    storeId: string;
    title: string;
    trackAvailableForPurchase: boolean;
    trackAvailableForSubscription: boolean;
    trackNumber: number;
    trackType: string;
    year: number;
    lastRatingChangeTimestamp: string;
    rating: string;
}

export interface SongHit {
    best_result: boolean;
    navigational_result: boolean;
    track: Track;
    type: string;
}

export interface CompositeArtRef {
    aspectRatio: string;
    kind: string;
    url: string;
}

export interface ImageUrl {
    aspectRatio: string;
    autogen: boolean;
    kind: string;
    url: string;
}

export interface Seed {
    artistId: string;
    kind: string;
    seedType: string;
    curatedStationId: string;
    trackId: string;
}

export interface StationSeed {
    artistId: string;
    kind: string;
    seedType: string;
    curatedStationId: string;
    trackId: string;
}

export interface Station {
    compositeArtRefs: CompositeArtRef[];
    imageUrls: ImageUrl[];
    kind: string;
    name: string;
    seed: Seed;
    skipEventHistory: any[];
    stationSeeds: StationSeed[];
    byline: string;
    contentTypes: string[];
    description: string;
}

export interface StationHit {
    best_result: boolean;
    navigational_result: boolean;
    station: Station;
    type: string;
}

export interface YoutubeVideo {
    id: string;
    kind: string;
    thumbnails: Thumbnail[];
    title: string;
}

export interface VideoHit {
    best_result: boolean;
    navigational_result: boolean;
    score: number;
    type: string;
    youtube_video: YoutubeVideo;
}

export interface GMSearchResults {
    album_hits: AlbumHit[];
    artist_hits: ArtistHit[];
    playlist_hits: PlaylistHit[];
    podcast_hits: PodcastHit[];
    // situation_hits: any[];
    song_hits: SongHit[];
    station_hits: StationHit[];
    video_hits: VideoHit[];
}

export interface SearchResults {
    song_hits: Song[];
}

