import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI'
import { AnimatePresence, motion } from 'framer-motion'

const Toast = () => {
    const { showToast, toastMessage } = useYoutubecontext()
    return (
        <div>
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-[110] bg-white text-black px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap pointer-events-none"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Toast