import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import Comment from "./Comment";
import { selectCommentsByGameId, selectCommentsLoading } from "./commentsSlice";
import Loading from "../../components/Loading";

const CommentsList = ({ gameId }) => {
  const comments = useSelector(selectCommentsByGameId(gameId));
  const loading = useSelector(selectCommentsLoading);

  if (loading) {
    return (
      <Col md="8" className="m-1">
        <Loading message="Loading comments..." />
      </Col>
    );
  }

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
    <Col className="m-1">
      <p className="text-muted">There are no comments for this game yet.</p>
    </Col>
  );
};

export default CommentsList;
