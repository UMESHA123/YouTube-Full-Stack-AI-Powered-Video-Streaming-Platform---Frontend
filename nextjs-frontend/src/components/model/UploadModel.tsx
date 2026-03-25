"use client";
import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Film } from "lucide-react";
import { PublishVideo } from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import { triggerToast } from "@/utills";

interface UploadModelProps {
    isOpen: boolean;
    onClose: () => void;
}
interface PublishVideoData {
    videoFile: File | null;
    thumbnail: File | null;
    title: string;
    description: string;
}

const UploadModel: React.FC<UploadModelProps> = ({ isOpen, onClose }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [publishVideoData, setPublishVideoData] = useState<PublishVideoData>({
        videoFile: null,
        thumbnail: null,
        title: "",
        description: ""
    })
    const { videos, setVideos, setUploadState, setToastMessage, setShowToast, setIsUploadModalOpen } = useYoutubecontext();
    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setPublishVideoData({ ...publishVideoData, videoFile: e.dataTransfer.files![0] })
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToUpload = { ...publishVideoData };
        setPublishVideoData({ title: "", description: "", videoFile: null, thumbnail: null });
        setIsUploadModalOpen(false);
        onClose();

        setUploadState({
            isActive: true,
            progress: 0,
            isComplete: false,
            data: { title: dataToUpload.title ?? "Uploading...", description: "Uploading..." },
        });

        try {
            const response = await PublishVideo(dataToUpload, (progress) => {
                setUploadState((prev) => ({
                    ...prev,
                    progress,
                    data: prev.data ? { ...prev.data, title: dataToUpload.title ?? "Uploading..." } : null,
                }));
            });

            if (response?.statusCode === 200) {
                setVideos((prevVideo: any) => [...prevVideo, response?.data]);
                setUploadState({
                    isActive: true,
                    progress: 100,
                    isComplete: true,
                    data: {
                        title: response?.data?.title,
                        description: "Video uploaded successfully",
                    },
                });
                triggerToast("Video uploaded successfully", setToastMessage, setShowToast);
                setTimeout(() => {
                    setUploadState({ isActive: false, progress: 0, isComplete: false, data: null });
                }, 3000);
            } else {
                setUploadState({
                    isActive: true,
                    progress: 0,
                    isComplete: true,
                    data: {
                        title: "Upload failed",
                        description: "Something went wrong",
                    },
                });
                triggerToast("Something went wrong", setToastMessage, setShowToast);
                setTimeout(() => {
                    setUploadState({ isActive: false, progress: 0, isComplete: false, data: null });
                }, 3000);
            }
        } catch (error) {
            console.log("video upload failed", error);
            setUploadState({
                isActive: true,
                progress: 0,
                isComplete: true,
                data: {
                    title: "Upload failed",
                    description: "Video upload failed",
                },
            });
            triggerToast("Video upload failed", setToastMessage, setShowToast);
            setTimeout(() => {
                setUploadState({ isActive: false, progress: 0, isComplete: false, data: null });
            }, 3000);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
        >
            <div
                className="relative w-full max-w-2xl bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Video</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 flex-1">
                    <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Video Upload Area */}
                        <div
                            className={`
                                border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                                ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                                ${publishVideoData?.videoFile ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => videoInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={videoInputRef}
                                className="hidden"
                                accept="video/*"
                                onChange={(e) => setPublishVideoData({ ...publishVideoData, videoFile: e.target.files![0] })}
                            />
                            {publishVideoData?.videoFile ? (
                                <>
                                    <Film className="w-12 h-12 text-green-500 mb-4" />
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400 break-all">{publishVideoData?.videoFile?.name}</p>
                                    <p className="text-xs text-gray-500 mt-2">Click to change video</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-base font-medium text-gray-900 dark:text-white">Drag and drop video files to upload</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your videos will be private until you publish them.</p>
                                    <button type="button" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors">
                                        Select Files
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={publishVideoData.title}
                                    onChange={(e) => setPublishVideoData({ ...publishVideoData, title: e.target.value })}
                                    placeholder="Video title"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    required
                                    value={publishVideoData?.description}
                                    onChange={(e) => setPublishVideoData({ ...publishVideoData, description: e.target.value })}
                                    placeholder="Tell viewers about your video"
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail</label>
                                <div
                                    className="flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#121212]"
                                >
                                    <div className="w-24 h-14 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {publishVideoData?.thumbnail ? (
                                            <img
                                                src={URL.createObjectURL(publishVideoData?.thumbnail)}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="text-gray-400" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {publishVideoData?.thumbnail ? publishVideoData?.thumbnail.name : 'Select or upload a picture that shows what\'s in your video.'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => thumbInputRef.current?.click()}
                                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            {publishVideoData?.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                                        </button>
                                        <input
                                            type="file"
                                            ref={thumbInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            // onChange={(e) => e.target.files && setThumbnailFile(e.target.files[0])}
                                            onChange={(e) => setPublishVideoData({ ...publishVideoData, thumbnail: e.target.files![0] })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="upload-form"
                        disabled={!publishVideoData.description || !publishVideoData.title || !publishVideoData.videoFile || !publishVideoData.thumbnail}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Upload
                    </button>
                </div>

            </div>
        </div>
    )
}

export default UploadModel