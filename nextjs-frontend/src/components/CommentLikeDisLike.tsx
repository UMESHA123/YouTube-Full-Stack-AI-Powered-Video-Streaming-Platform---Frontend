import { GetCommentLikeStatus, ToggleCommentLike } from '@/APIS';
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type CommentLikeDisLikeType = {
    commentId: string;
}

const CommentLikeDisLike: React.FC<CommentLikeDisLikeType> = ({ commentId }) => {
    const [status, setStatus] = useState<'liked' | 'disliked' | null>(null);
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        const getCommentLikeStatus = async () => {
            try {
                const response = await GetCommentLikeStatus(commentId);
                // console.log("response", response)
                if (response?.data?.statusCode === 200) {
                    // console.log("response?.data?.isLiked", response?.data?.isLiked)
                    setStatus(response?.data?.data?.isLiked ? "liked" : null);
                } else {
                    console.log("error while fetching the comment like status")
                }
            } catch (error) {
                console.log("error while fetching the comment like status: ", error);
            }
        }
        getCommentLikeStatus()
    }, [commentId])

    const handleLike = async () => {

        try {
            const response = await ToggleCommentLike(commentId);
            if (response?.statusCode === 200 && response?.success === true) {
                setStatus(() => response?.data?.data?.likeStatus ? 'liked' : 'disliked')
                setShowParticles(true);
                setTimeout(() => setShowParticles(false), 1000);
            } else {
                console.error('Failed to toggle video like');
            }

            if (status === 'liked') {
                setStatus(null);
            } else {
                setStatus('liked');
            }
        } catch {
            console.log("error while comment like and dislike")
        }
    };

    const handleDislike = () => {
        if (status === 'disliked') {
            setStatus(null);
        } else {
            setStatus('disliked');
            if (status === 'liked') {
            }
        }
    };
    return (
        <div className="flex items-center gap-1 -ml-2">
      {/* Like Button */}
      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.85 }}
        className="group flex items-center gap-1.5 p-2 rounded-full hover:bg-[#272727] transition-colors relative overflow-visible"
        aria-label="Like comment"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {/* Particles */}
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                {[...Array(8)].map((_, i) => (
                  <Particle key={i} index={i} />
                ))}
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            {status === 'liked' ? (
              <motion.div
                key="liked"
                className="absolute inset-0"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <ThumbsUp size={16} className="text-[#3ea6ff] fill-[#3ea6ff]" />
              </motion.div>
            ) : (
              <motion.div
                key="unliked"
                className="absolute inset-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <ThumbsUp size={16} className="text-gray-300 group-hover:text-white transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Counter */}
        {/* <div className="relative h-4 min-w-[1ch] overflow-hidden flex flex-col items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              
              initial={{ y: 12, opacity: 0, filter: 'blur(2px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -12, opacity: 0, filter: 'blur(2px)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`text-xs font-medium block ${status === 'liked' ? 'text-[#3ea6ff]' : 'text-gray-400'}`}
            >
              {likes || (status === 'liked' ? 1 : '')}
            </motion.span>
          </AnimatePresence>
        </div> */}
      </motion.button>

      {/* Dislike Button */}
      <motion.button
        onClick={handleDislike}
        whileTap={{ scale: 0.85 }}
        className="group p-2 rounded-full hover:bg-[#272727] transition-colors relative"
        aria-label="Dislike comment"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'disliked' ? (
              <motion.div
                key="disliked"
                className="absolute inset-0"
                initial={{ scale: 0, rotate: 30, y: 2 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <ThumbsDown size={16} className="text-white fill-white" />
              </motion.div>
            ) : (
              <motion.div
                key="undisliked"
                className="absolute inset-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <ThumbsDown size={16} className="text-gray-300 group-hover:text-white transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
    )
}


const Particle = ({ index }: { index: number }) => {
  const angle = (index / 8) * 360;
  const radius = 12 + (index % 4) * 2;
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  const colors = ['#3ea6ff', '#a855f7', '#ffffff'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0.7, opacity: 1 }}
      animate={{
        x,
        y,
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: 0.45 + (index % 3) * 0.05,
        ease: 'easeOut',
      }}
      className="absolute w-1 h-1 rounded-full top-1/2 left-1/2 -ml-0.5 -mt-0.5"
      style={{ backgroundColor: color, boxShadow: `0 0 2px ${color}` }}
    />
  );
};

export default CommentLikeDisLike
