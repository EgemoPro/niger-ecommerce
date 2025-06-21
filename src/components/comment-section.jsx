import  { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Reply, Send } from 'lucide-react';
import PropTypes from 'prop-types';



const CommentsSection = ({ 
  initialComments = [],
  onAddComment = () => {},
  onLikeComment = () => {},
  onReplyComment = () => {},
  currentUser = { id: 1, name: 'Utilisateur', avatar: '/api/placeholder/32/32' },
  placeholder = "Ajouter un commentaire...",
  maxLength = 500,
  showReplyButton = true,
  showLikeButton = true
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: currentUser,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    onAddComment(comment);
  };

  const handleSubmitReply = (parentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      author: currentUser,
      content: replyText,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      parentId
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));

    setReplyText('');
    setReplyingTo(null);
    onReplyComment(reply);
  };

  const handleLike = (commentId, isReply = false, parentId = null) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        };
      } else if (comment.id === commentId) {
        return { 
          ...comment, 
          liked: !comment.liked, 
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1 
        };
      }
      return comment;
    }));
    onLikeComment(commentId);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const CommentItem = ({ comment, isReply = false, parentId = null }) => (
    <div className={`${isReply ? 'ml-12 mt-3' : 'mb-6'}`}>
      <div className="flex space-x-3">
        <img 
          src={comment.author.avatar || `/api/placeholder/40/40`}
          alt={comment.author.name}
          className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0`}
        />
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed break-words">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 ml-2">
            {showLikeButton && (
              <button 
                onClick={() => handleLike(comment.id, isReply, parentId)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${comment.liked ? 'fill-red-500 text-red-500' : ''}`}
                />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>
            )}
            
            {showReplyButton && !isReply && (
              <button 
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Répondre</span>
              </button>
            )}
            
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Zone de réponse */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-2">
              <div className="flex space-x-2">
                <img 
                  src={currentUser.avatar || `/api/placeholder/32/32`}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-end space-x-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Répondre à ${comment.author.name}...`}
                      className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                      maxLength={maxLength}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitReply(comment.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Réponses */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg">
      {/* En-tête */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Formulaire nouveau commentaire */}
      <div className="mb-8">
        <div className="flex space-x-3">
          <img 
            src={currentUser.avatar || `/api/placeholder/40/40`}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={placeholder}
              className="w-full resize-none border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              maxLength={maxLength}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {newComment.length}/{maxLength}
              </span>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun commentaire pour le moment</p>
            <p className="text-sm text-gray-400">Soyez le premier à commenter !</p>
          </div>
        )}
      </div>
    </div>
  );
};

CommentsSection.propTypes = {
  initialComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
};

export default CommentsSection;