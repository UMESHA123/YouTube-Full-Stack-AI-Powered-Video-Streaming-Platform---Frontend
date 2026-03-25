import React, { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GetVideoLikeStatus, ToggleVideoLike } from '@/APIS';
import { VideoPlay } from '@/types/types';

interface LikeDislikeButtonsProps {
    initialLikes: number;
    video: VideoPlay
}

export const LikeDisLike: React.FC<LikeDislikeButtonsProps> = ({ initialLikes, video }) => {
    const [status, setStatus] = useState<'liked' | 'disliked' | null>(null);
    const [likes, setLikes] = useState(initialLikes);
    const [showParticles, setShowParticles] = useState(false);
    

    useEffect(() => {
        const getCurrentVideoLikeStatus = async () => {
            try {
                const response = await GetVideoLikeStatus(video?._id!);
                if(response?.data?.statusCode){
                    setStatus(() => response?.data?.data?.isLiked ? 'liked': null)
                }else{
                    console.log("error while fetching the video like status")
                }
            } catch (error) {
                console.log("error while fetching the current video like status: ", error);
            }
        }
        video?._id && getCurrentVideoLikeStatus()
    }, [video?._id])

    const handleLike = async () => {
        const response = await ToggleVideoLike(video?._id!);
        if (response?.statusCode === 200 && response?.success === true) {
            setStatus(() => response?.data?.data?.likeStatus ? 'liked': 'disliked')

            setLikes(initialLikes + 1);
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 1000);
        } else {
            console.error('Failed to toggle video like');
        }

        if (status === 'liked') {
            setStatus(null);
            setLikes(initialLikes);
        } else {
            setStatus('liked');
            
        }
    };

    const handleDislike = () => {
        if (status === 'disliked') {
            setStatus(null);
        } else {
            setStatus('disliked');
            if (status === 'liked') {
                setLikes(initialLikes);
            }
        }
    };
    const videoLikeHandler = async () => {

    }
    return (
        <div className="flex items-center bg-[#272727] rounded-full overflow-hidden h-9 relative isolate shadow-sm select-none">
            {/* Like Button */}
            <motion.button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 h-full border-r border-[#3f3f3f] hover:bg-[#3f3f3f] transition-colors relative z-10 ${status === 'liked' ? 'text-[#3ea6ff]' : 'text-white'
                    }`}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative w-5 h-5 flex items-center justify-center">
                    {/* Particles Effect */}
                    <AnimatePresence>
                        {showParticles && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                    <Particle key={i} index={i} />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Icon Animation */}
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait" initial={false}>
                            {status === 'liked' ? (
                                <motion.div
                                    key="liked"
                                    className="absolute inset-0"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: -45 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                    <ThumbsUp size={20} className="fill-current" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="unliked"
                                    className="absolute inset-0"
                                    initial={{ scale: 0, rotate: 45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 45 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <ThumbsUp size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Counter Animation */}
                <div className="relative h-5 min-w-[1ch] flex flex-col items-center justify-center overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={likes}
                            initial={{ y: 15, opacity: 0, filter: 'blur(4px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: -15, opacity: 0, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="text-sm font-medium block"
                        >
                            {/* {likes} */}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </motion.button>

            {/* Dislike Button */}
            <motion.button
                onClick={handleDislike}
                className={`px-4 h-full hover:bg-[#3f3f3f] transition-colors flex items-center justify-center ${status === 'disliked' ? 'text-white' : 'text-white'
                    }`}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative w-5 h-5">
                    <AnimatePresence mode="wait" initial={false}>
                        {status === 'disliked' ? (
                            <motion.div
                                key="disliked"
                                className="absolute inset-0"
                                initial={{ scale: 0, rotate: 45, y: -5 }}
                                animate={{ scale: 1, rotate: 0, y: 0 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                <ThumbsDown size={20} className="fill-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="undisliked"
                                className="absolute inset-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <ThumbsDown size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </div>
    );
};

const Particle = ({ index }: { index: number }) => {
    const angle = (index / 12) * 360;
    const radius = 18 + Math.random() * 12;
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    // Colors: Blue, Purple, White, Pink for a vibrant "AI/Tech" feel
    const colors = ['#3ea6ff', '#a855f7', '#ffffff', '#ec4899'];
    const color = colors[index % colors.length];

    return (
        <motion.div
            initial={{ x: 0, y: 0, scale: Math.random() * 0.5 + 0.5, opacity: 1 }}
            animate={{
                x,
                y,
                scale: 0,
                opacity: 0,
            }}
            transition={{
                duration: 0.5 + Math.random() * 0.3,
                ease: 'easeOut',
            }}
            className="absolute w-1 h-1 rounded-full top-1/2 left-1/2 -ml-0.5 -mt-0.5"
            style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
        />
    );
};
