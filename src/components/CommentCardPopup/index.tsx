import styles from "./styles.module.css";
import CommentThread from "./CommentThread";
const CommentCardPopup = () => {
  return (
    <div className={styles.commentCardPopup}>
      <CommentThread />
    </div>
  );
};

export default CommentCardPopup;
