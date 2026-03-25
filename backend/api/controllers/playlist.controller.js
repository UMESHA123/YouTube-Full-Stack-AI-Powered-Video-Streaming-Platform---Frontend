import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "name and description are required");
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  });
  if (!playlist) {
    throw new ApiError(500, "Somethng went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const playlists = await Playlist.find({ owner: userId });
  if (!playlists) {
    throw new ApiError(400, "playlists not found");
  }

  for (let i = 0; i < playlists.length; i++) {
    const videoIds = playlists[i].videos?.filter((id) => id != null) || [];

    const videos = await Video.find({ _id: { $in: videoIds } }); // fetch actual video docs
    playlists[i] = {
      ...playlists[i]._doc,
      videos,
    };
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "user playlists featched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId)
    .populate({
      path: "videos",
      model: "Video"
    });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Remove null videos (deleted ones)
  const validVideos = playlist.videos.filter(video => video !== null);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        playlistName: playlist.name, // ✅ top-level playlist name
        videos: validVideos          // ✅ array of video objects
      },
      "Playlist fetched successfully"
    )
  );
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
  }

  const videoToPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  ).populate("videos");
  if (!videoToPlaylist) {
    throw new ApiError(400, "something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videoToPlaylist, "Video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
  }

  const removeVideofromPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: {
          $in: [videoId],
        },
      },
    },
    {
      new: true,
    }
  ).populate("videos");
  if (!removeVideofromPlaylist) {
    throw new ApiError(400, "Something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removeVideofromPlaylist,
        "video deleted from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to delete this playlist");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new ApiError(400, "something went wrong ");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
  }

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "name and description are required");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { name: name.trim(), description: description.trim() },
    },
    {
      new: true,
    }
  );
  if (!updatedPlaylist) {
    throw new ApiError(400, "something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
