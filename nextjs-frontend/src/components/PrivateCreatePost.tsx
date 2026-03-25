
export const PrivateCreatePost = ({ createUserPost, tweetData, setTweetData }: { createUserPost: () => void, tweetData: string, setTweetData: React.Dispatch<React.SetStateAction<string>> }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tweetData.trim()) {
            createUserPost();
            setTweetData('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border border-[#3f3f3f] rounded-xl p-4 bg-[#1f1f1f] mb-6">
            <textarea
                value={tweetData}
                onChange={(e) => setTweetData(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-white placeholder-[#717171] resize-none focus:outline-none min-h-[80px] mb-3"
            />
            <div className="flex justify-between items-center border-t border-[#3f3f3f] pt-3">
                <span className="text-xs text-[#717171]">Public post</span>
                <button
                    type="submit"
                    disabled={!tweetData.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-black font-bold rounded-full text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </form>
    );
};
