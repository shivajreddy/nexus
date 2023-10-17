import {useState} from "react";

function EmojiPicker() {
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [isEmojiListVisible, setIsEmojiListVisible] = useState(false);

    const emojis = ['😀', '😍', '🚀', '🎉', '❤️', '😊']; // Add more emojis as needed

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji);
        toggleEmojiList();
    };

    const toggleEmojiList = () => {
        setIsEmojiListVisible(!isEmojiListVisible);
    };

    return (
        <div className="emoji-container">
            <div id="selected-emoji" onClick={toggleEmojiList}>
                {selectedEmoji}
            </div>
            {isEmojiListVisible && (
                <div className="emoji-picker">
                    {emojis.map((emoji, index) => (
                        <span key={index} onClick={() => handleEmojiClick(emoji)}>
                            <p>{emoji}</p>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EmojiPicker;
