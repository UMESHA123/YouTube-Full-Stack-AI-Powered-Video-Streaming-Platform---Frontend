export interface UserData {
    fullName: string;
    email: string;
    username: string;
    password: string;
    avatar: File | null;
    coverImage?: File | null;
}

export interface Credentials {
    email: string;
    username: string;
    password: string;
}

export interface PasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateAccountData {
    fullName?: string;
    email?: string;
}

export interface AvatarData {
    avatar: string;
}

export interface CoverImageData {
    coverImage: File;
}

// tweet data types

export interface TweetData {
    content: string;
}
export interface TweetCommentData {
    content: string;
}

// videos data types

export interface GetAllVideosParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortType?: string;
    userId?: string
}

export interface PublishVideoData {
    videoFile: File | null;
    thumbnail: File | null;
    title: string;
    description: string;
}

export interface StartLiveStreamData {
    title: string;
    streamUrl: string;
    description?: string;
}

export interface EndLiveStreamData {
    videoId: string;
    unpublish?: boolean;
}

export interface UpdateThumbnailData {
    thumbnail: string;
}

export interface GetCommentsParams {
    page: number;
    limit: number;
    parentComment?: string;
}

export interface AddCommentData {
    content: string;
    parentComment?: string;
}

export interface UpdateCommentData {
    content: string;
}

export interface CreatePlaylistData {
    name: string;
    description: string;
}

export interface UpdatePlaylistData {
    name?: string;
    description?: string;
}

export interface RegisterResponseData  {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
    _v: number;
}

export interface UserDataType {
     _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
    _v: number;
}


export interface LoginResponseData {
    user: UserDataType;
    accessToken: string;
    refreshToken: string;
}
