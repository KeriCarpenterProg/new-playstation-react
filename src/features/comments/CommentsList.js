import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { selectCommentsByGameId } from "./commentsSlice";

const CommentsList = ({ gameId }) => {
  const comments = useSelector(selectCommentsByGameId(gameId));
  if (comments && comments.length > 0) {
    return (
      <Col md="8" className="m-1">
        <h4>Comments</h4>
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
        {/* <CommentForm campsiteId={campsiteId} /> */}
      </Col>
    );
  }
  return (
    <Col className="m-1">There are no comments for this campsite yet.</Col>
  );
};

export default CommentsList;
