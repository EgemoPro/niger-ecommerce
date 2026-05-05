import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, AlertCircle, Trash2, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

import {
  fetchProductComments,
  addProductComment,
  deleteProductComment,
  commentsSelectors,
} from '@/redux/Slices/commentsSlice';

const commentSchema = z.object({
  content: z.string()
    .min(10, 'Le commentaire doit faire au moins 10 caractères')
    .max(1000, 'Le commentaire ne doit pas dépasser 1000 caractères'),
  rating: z.number().min(1).max(5).optional(),
});

const ProductComments = ({ productId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    comments,
    isLoading,
    error,
    successMessage,
  } = useSelector((state) => ({
    comments: commentsSelectors.selectCurrentProductComments(state),
    isLoading: commentsSelectors.selectIsLoading(state),
    error: commentsSelectors.selectError(state),
    successMessage: commentsSelectors.selectSuccessMessage(state),
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
      rating: 5,
    },
  });

  useEffect(() => {
    dispatch(fetchProductComments(productId)).catch((err) => {
      console.error('Error fetching comments:', err);
    });
  }, [dispatch, productId]);

  const handleSubmit = async (data) => {
    if (!user?._id) {
      alert('Vous devez être connecté pour laisser un commentaire');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(addProductComment({
        productId,
        userId: user._id,
        content: data.content,
        rating: data.rating,
      }));
      form.reset();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await dispatch(deleteProductComment(commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Commentaires</h3>
        <p className="text-gray-600 text-sm mt-1">
          {comments?.length || 0} commentaire{comments?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Comment Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Laisser un commentaire
          </h4>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Rating */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Évaluation</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoveredRating || field.value)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre avis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Partagez votre expérience avec ce produit..."
                        {...field}
                        rows={4}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Envoi...' : 'Publier le commentaire'}
              </Button>
            </form>
          </Form>
        </motion.div>
      )}

      {/* Comments List */}
      {isLoading && !comments?.length ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : comments?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun commentaire pour l'instant</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage
                        src={comment.userAvatar}
                        alt={comment.userName}
                      />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">
                          {comment.userName || 'Utilisateur anonyme'}
                        </p>
                        {comment.rating && (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= comment.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </p>

                      <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {user?._id === comment.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProductComments;
